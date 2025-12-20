# Firebase Production Deployment Instructions

## Step 1: Deploy Firestore Security Rules

**Go to**: [Firebase Console > Firestore > Rules](https://console.firebase.google.com/project/buffalo-projects-4ca32/firestore/rules)

**Copy and paste this complete ruleset:**

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }

    function isOwner(ownerId) {
      return isAuthenticated() && request.auth.uid == ownerId;
    }

    function isCollaborator(collaborators) {
      return isAuthenticated() &&
             collaborators != null &&
             request.auth.uid in collaborators;
    }

    function hasWorkspaceAccess(workspace) {
      return isOwner(workspace.ownerId) ||
             workspace.isPublic == true ||
             isCollaborator(workspace.collaborators);
    }

    // User profiles - users can only read/write their own profile
    match /users/{userId} {
      allow read, write: if isAuthenticated() && request.auth.uid == userId;

      // Allow reading basic profile info for collaboration features
      allow read: if isAuthenticated() &&
                      request.auth.uid != userId &&
                      resource.data.keys().hasOnly(['displayName', 'photoURL', 'firstName', 'lastName']);
    }

    // Workspaces - complex access control
    match /workspaces/{workspaceCode} {
      // Read access: owner, collaborators, or public workspaces
      allow read: if hasWorkspaceAccess(resource.data);

      // Create: authenticated users only, must set themselves as owner
      allow create: if isAuthenticated() &&
                        request.auth.uid == request.resource.data.ownerId &&
                        request.resource.data.keys().hasAll(['ownerId', 'projectName', 'createdAt', 'lastModified']);

      // Update: only owner or collaborators with edit permissions
      allow update: if isOwner(resource.data.ownerId) ||
                        (isCollaborator(resource.data.collaborators) &&
                         resource.data.collaborationSettings.editPermissions == 'collaborators');

      // Delete: only owner
      allow delete: if isOwner(resource.data.ownerId);

      // Additional validation for updates
      allow update: if isAuthenticated() &&
                        // Prevent changing owner
                        request.resource.data.ownerId == resource.data.ownerId &&
                        // Prevent changing code
                        request.resource.data.code == resource.data.code &&
                        // Prevent changing createdAt
                        request.resource.data.createdAt == resource.data.createdAt &&
                        // Ensure lastModified is updated
                        request.resource.data.lastModified is timestamp;
    }

    // Comments on workspaces
    match /workspaces/{workspaceCode}/comments/{commentId} {
      // Read: anyone who can read the workspace
      allow read: if exists(/databases/$(database)/documents/workspaces/$(workspaceCode)) &&
                      hasWorkspaceAccess(get(/databases/$(database)/documents/workspaces/$(workspaceCode)).data);

      // Create: authenticated users who can read the workspace
      allow create: if isAuthenticated() &&
                        exists(/databases/$(database)/documents/workspaces/$(workspaceCode)) &&
                        hasWorkspaceAccess(get(/databases/$(database)/documents/workspaces/$(workspaceCode)).data) &&
                        request.auth.uid == request.resource.data.authorId;

      // Update/Delete: comment author or workspace owner
      allow update, delete: if isAuthenticated() && (
        request.auth.uid == resource.data.authorId ||
        (exists(/databases/$(database)/documents/workspaces/$(workspaceCode)) &&
         request.auth.uid == get(/databases/$(database)/documents/workspaces/$(workspaceCode)).data.ownerId)
      );
    }

    // Public project directory - read-only
    match /public_projects/{projectId} {
      allow read: if true; // Public read access
      allow write: if false; // Only updated through cloud functions
    }

    // Default deny rule
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## Step 2: Deploy Storage Security Rules

**Go to**: [Firebase Console > Storage > Rules](https://console.firebase.google.com/project/buffalo-projects-4ca32/storage/rules)

**Copy and paste this complete ruleset:**

```javascript
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {

    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    function hasWorkspaceAccess(workspaceCode) {
      return isAuthenticated() &&
             exists(/databases/(default)/documents/workspaces/$(workspaceCode)) &&
             (get(/databases/(default)/documents/workspaces/$(workspaceCode)).data.ownerId == request.auth.uid ||
              get(/databases/(default)/documents/workspaces/$(workspaceCode)).data.isPublic == true ||
              request.auth.uid in get(/databases/(default)/documents/workspaces/$(workspaceCode)).data.collaborators);
    }

    function isValidFileSize(maxSizeInMB) {
      return request.resource.size <= maxSizeInMB * 1024 * 1024;
    }

    function isValidFileType(allowedTypes) {
      return request.resource.contentType in allowedTypes;
    }

    // User profile images
    match /profile_images/{userId}/{fileName} {
      // Allow read if authenticated (for displaying user avatars)
      allow read: if isAuthenticated();

      // Allow write only for the user's own profile image
      allow write: if isOwner(userId) &&
                       isValidFileSize(5) && // 5MB limit
                       isValidFileType(['image/jpeg', 'image/png', 'image/webp']);

      // Allow delete only by the owner
      allow delete: if isOwner(userId);
    }

    // Workspace documents
    match /documents/{workspaceCode}/{fileName} {
      // Read access: same as workspace access
      allow read: if hasWorkspaceAccess(workspaceCode);

      // Write access: workspace owner or collaborators with edit permissions
      allow write: if isAuthenticated() &&
                       exists(/databases/(default)/documents/workspaces/$(workspaceCode)) &&
                       (get(/databases/(default)/documents/workspaces/$(workspaceCode)).data.ownerId == request.auth.uid ||
                        (request.auth.uid in get(/databases/(default)/documents/workspaces/$(workspaceCode)).data.collaborators &&
                         get(/databases/(default)/documents/workspaces/$(workspaceCode)).data.collaborationSettings.editPermissions == 'collaborators')) &&
                       isValidFileSize(100) && // 100MB limit per file
                       isValidFileType([
                         'application/pdf',
                         'text/plain',
                         'text/markdown',
                         'application/msword',
                         'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                         'text/csv',
                         'application/vnd.ms-excel',
                         'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                         'image/jpeg',
                         'image/png',
                         'image/webp',
                         'image/svg+xml'
                       ]);

      // Delete: only workspace owner
      allow delete: if isAuthenticated() &&
                        exists(/databases/(default)/documents/workspaces/$(workspaceCode)) &&
                        get(/databases/(default)/documents/workspaces/$(workspaceCode)).data.ownerId == request.auth.uid;
    }

    // Default deny rule
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

## Step 3: Enable Required Firebase Services

1. **Authentication**: Already enabled ✅
2. **Firestore**: Already enabled ✅
3. **Storage**: Go to [Storage](https://console.firebase.google.com/project/buffalo-projects-4ca32/storage) and click "Get started"
4. **Analytics**: Already configured ✅

## Step 4: Test Integration

1. Visit `http://localhost:5174/test`
2. Test user registration/login
3. Test workspace creation
4. Verify data persistence in Firebase Console

## Step 5: Production Deployment

After testing, deploy to production:

```bash
npm run build
firebase deploy --only hosting
```

Your Buffalo Projects platform is ready for production! 🚀
