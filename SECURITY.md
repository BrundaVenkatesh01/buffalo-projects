# 🔐 Security Guidelines for Buffalo Projects

## 🚨 IMMEDIATE ACTION REQUIRED

**If you've exposed a service account key (like in your recent message), take these steps NOW:**

1. **Go to Firebase Console** → Project Settings → Service Accounts
2. **Delete the compromised key immediately**
3. **Generate a new key if needed** (only for backend/server use)
4. **Never commit service account keys to version control**

## ✅ Proper Firebase Security Setup

### Client-Side Configuration (Public Config)

Firebase web config values are not secrets, but we still source them from environment variables for consistency and safer operational hygiene:

```typescript
// src/services/firebase.ts
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};
```

Do not hardcode real project values in source. Prefer environment-specific `.env` files and CI/CD secrets management.

### Environment Variables (For sensitive config)

Create `.env` files for different environments:

```bash
# .env.production
VITE_FIREBASE_API_KEY=your_production_api_key
VITE_FIREBASE_PROJECT_ID=your_production_project_id
# ... other environment-specific values
```

## 🔒 What to NEVER Commit

❌ **Service Account Private Keys**

```json
{
  "private_key": "-----BEGIN PRIVATE KEY-----\n...",
  "private_key_id": "..."
  // These provide admin access to your entire Firebase project
}
```

❌ **Database URLs with secrets**
❌ **API tokens with write permissions**
❌ **Admin SDK credentials**

## ✅ What's Safe to Commit

✅ **Public Firebase Config** (apiKey, authDomain, projectId, etc.)
✅ **Firestore Security Rules** (they protect your data)
✅ **Client-side code** (it runs in browsers anyway)

## 🛡️ Security Best Practices

### 1. **Firestore Security Rules**

```javascript
// Always require authentication
allow read, write: if request.auth != null;

// Only allow users to access their own data
allow read, write: if resource.data.ownerId == request.auth.uid;
```

### 2. **Environment Management**

- Use different Firebase projects for dev/staging/production
- Never put production credentials in development code
- Use environment variables for deployment

### 3. **Access Control**

- Use Firebase Auth for user management
- Implement role-based permissions in Firestore rules
- Validate all input on both client and server side

## 🚀 Production Deployment Checklist

- [ ] Service account keys revoked/secured
- [ ] Environment variables configured
- [ ] Firestore rules deployed and tested
- [ ] Storage rules deployed and tested
- [ ] Authentication properly configured
- [ ] Billing limits set appropriately

## 🆘 Security Incident Response

If you accidentally expose credentials:

1. **Immediately revoke/delete** the exposed credentials
2. **Generate new credentials** if needed
3. **Check logs** for any unauthorized usage
4. **Update all systems** with new credentials
5. **Review and improve** security practices

---

**Remember**: Security is not optional for a production SaaS platform. Your users trust you with their data - protect it accordingly.
