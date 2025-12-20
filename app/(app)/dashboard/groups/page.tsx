"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Skeleton,
} from "@/components/unified";
import { Plus, Users, Copy, ExternalLink, Loader2 } from "@/icons";
import { groupService } from "@/services/groupService";
import { useAuthStore } from "@/stores/authStore";
import type { Group } from "@/types";

export default function GroupsPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    const loadGroups = async () => {
      try {
        const userGroups = await groupService.getGroups();
        setGroups(userGroups);
      } catch (error) {
        console.error("Failed to load groups:", error);
        toast.error("Failed to load groups");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      void loadGroups();
    }
  }, [user]);

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) {
      toast.error("Please enter a group name");
      return;
    }

    setCreating(true);
    try {
      const newGroup = await groupService.createGroup({
        name: newGroupName.trim(),
        description: newGroupDescription.trim() || undefined,
      });

      setGroups((prev) => [newGroup, ...prev]);
      setNewGroupName("");
      setNewGroupDescription("");
      setShowCreateForm(false);
      toast.success(`Group "${newGroup.name}" created! Code: ${newGroup.code}`);
    } catch (error) {
      console.error("Failed to create group:", error);
      toast.error("Failed to create group");
    } finally {
      setCreating(false);
    }
  };

  const copyGroupCode = (code: string) => {
    void navigator.clipboard.writeText(code);
    toast.success("Group code copied to clipboard");
  };

  if (loading) {
    return (
      <div className="container max-w-4xl py-8 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Groups</h1>
          <p className="text-muted-foreground">
            Create groups and share codes with members to view their projects
          </p>
        </div>
        {!showCreateForm && (
          <Button variant="default" size="sm" onClick={() => setShowCreateForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Group
          </Button>
        )}
      </div>

      {/* Create Group Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Group</CardTitle>
            <CardDescription>
              Create a group and share the code with members. They&apos;ll add the code
              to their projects so you can view their progress.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="groupName">Group Name</Label>
              <Input
                id="groupName"
                placeholder="e.g., Fall 2024 Cohort"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                disabled={creating}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="groupDescription">
                Description <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Input
                id="groupDescription"
                placeholder="e.g., Entrepreneurship 101 students"
                value={newGroupDescription}
                onChange={(e) => setNewGroupDescription(e.target.value)}
                disabled={creating}
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateForm(false);
                  setNewGroupName("");
                  setNewGroupDescription("");
                }}
                disabled={creating}
              >
                Cancel
              </Button>
              <Button
                onClick={() => void handleCreateGroup()}
                disabled={creating || !newGroupName.trim()}
              >
                {creating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Group"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Groups List */}
      {groups.length === 0 && !showCreateForm ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No groups yet</h3>
            <p className="text-muted-foreground mb-4 max-w-sm">
              Create a group to get a shareable code. Members add this code to their
              projects so you can view their progress.
            </p>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Group
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {groups.map((group) => (
            <Card key={group.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{group.name}</CardTitle>
                    {group.description && (
                      <CardDescription className="mt-1">
                        {group.description}
                      </CardDescription>
                    )}
                  </div>
                  <Users className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Group Code */}
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground mb-1">Group Code</p>
                    <p className="font-mono text-lg font-bold tracking-widest">
                      {group.code}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyGroupCode(group.code)}
                    title="Copy code"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {group.members?.length || 0} member
                    {(group.members?.length || 0) !== 1 ? "s" : ""}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(`/dashboard/groups/${group.code}`)}
                    className="text-primary"
                  >
                    View Projects
                    <ExternalLink className="ml-2 h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
