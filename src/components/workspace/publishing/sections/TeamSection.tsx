/**
 * Team Section
 *
 * Collaborators and acknowledgments for the project.
 */

"use client";

import { useState } from "react";

import { usePublishForm, type TeamMember } from "../PublishFormContext";

import { SectionWrapper } from "./SectionWrapper";

import { Input, Label, Textarea, Button } from "@/components/unified";
import { Users, Plus, X, User } from "@/icons";
import { cn } from "@/lib/utils";

export function TeamSection() {
  const { state, dispatch } = usePublishForm();
  const [newMember, setNewMember] = useState<Partial<TeamMember>>({
    name: "",
    role: "",
    linkedin: "",
  });
  const [isAdding, setIsAdding] = useState(false);

  const handleAddMember = () => {
    if (newMember.name?.trim() && newMember.role?.trim()) {
      dispatch({
        type: "ADD_COLLABORATOR",
        payload: {
          name: newMember.name.trim(),
          role: newMember.role.trim(),
          linkedin: newMember.linkedin?.trim(),
        },
      });
      setNewMember({ name: "", role: "", linkedin: "" });
      setIsAdding(false);
    }
  };

  const handleRemoveMember = (index: number) => {
    dispatch({ type: "REMOVE_COLLABORATOR", payload: index });
  };

  return (
    <SectionWrapper
      title="Team"
      sectionKey="team"
      icon={<Users className="h-4 w-4 text-muted-foreground" />}
    >
      <div className="space-y-4">
        {/* Collaborators List */}
        {state.collaborators.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm text-foreground">Collaborators</Label>
            <div className="space-y-2">
              {state.collaborators.map((member, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/[0.03] border border-white/10"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center">
                      <User className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {member.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {member.role}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveMember(index)}
                    className="p-1.5 rounded-md text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Member Form */}
        {isAdding ? (
          <div className="p-4 rounded-lg border border-white/10 bg-white/[0.02] space-y-3">
            <div className="space-y-1.5">
              <Label
                htmlFor="memberName"
                className="text-xs text-muted-foreground"
              >
                Name
              </Label>
              <Input
                id="memberName"
                value={newMember.name}
                onChange={(e) =>
                  setNewMember({ ...newMember, name: e.target.value })
                }
                placeholder="Team member name"
                className="bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground focus:border-primary"
              />
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="memberRole"
                className="text-xs text-muted-foreground"
              >
                Role
              </Label>
              <Input
                id="memberRole"
                value={newMember.role}
                onChange={(e) =>
                  setNewMember({ ...newMember, role: e.target.value })
                }
                placeholder="e.g., Co-founder, Designer, Developer"
                className="bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground focus:border-primary"
              />
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="memberLinkedin"
                className="text-xs text-muted-foreground"
              >
                LinkedIn (optional)
              </Label>
              <Input
                id="memberLinkedin"
                value={newMember.linkedin}
                onChange={(e) =>
                  setNewMember({ ...newMember, linkedin: e.target.value })
                }
                placeholder="https://linkedin.com/in/..."
                className="bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground focus:border-primary"
              />
            </div>
            <div className="flex items-center gap-2 pt-2">
              <Button
                size="sm"
                onClick={handleAddMember}
                disabled={!newMember.name?.trim() || !newMember.role?.trim()}
                className="flex-1"
              >
                Add Member
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setIsAdding(false);
                  setNewMember({ name: "", role: "", linkedin: "" });
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className={cn(
              "w-full p-3 rounded-lg border-2 border-dashed border-white/10",
              "flex items-center justify-center gap-2",
              "text-muted-foreground hover:text-foreground hover:border-white/20 hover:bg-white/[0.02]",
              "transition-all cursor-pointer",
            )}
          >
            <Plus className="h-4 w-4" />
            <span className="text-sm">Add team member</span>
          </button>
        )}

        {/* Acknowledgments */}
        <div className="space-y-1.5 pt-2 border-t border-white/5">
          <Label htmlFor="acknowledgments" className="text-sm text-foreground">
            Acknowledgments
          </Label>
          <Textarea
            id="acknowledgments"
            value={state.acknowledgments}
            onChange={(e) =>
              dispatch({ type: "SET_ACKNOWLEDGMENTS", payload: e.target.value })
            }
            placeholder="Thank advisors, mentors, supporters, or anyone who helped..."
            rows={3}
            className="bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground focus:border-primary resize-none"
          />
          <p className="text-xs text-muted-foreground">
            A place to thank those who helped make your project possible
          </p>
        </div>
      </div>
    </SectionWrapper>
  );
}
