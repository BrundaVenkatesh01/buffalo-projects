"use client";
/* eslint-disable @typescript-eslint/no-misused-promises, @typescript-eslint/no-floating-promises */

import { useState } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Button,
  Input,
} from "@/components/unified";
import { Plus, X, Briefcase } from "@/icons";
import type { User } from "@/types";

interface ProfileSkillsProps {
  user: User;
  onUpdateSkills?: (skills: string[]) => Promise<void>;
  onUpdateInterests?: (interests: string[]) => Promise<void>;
  onUpdateSocialLinks?: (links: SocialLink[]) => Promise<void>;
  editable?: boolean;
}

interface SocialLink {
  platform: string;
  url: string;
}

export function ProfileSkills({
  user,
  onUpdateSkills,
  onUpdateInterests,
  editable = false,
}: ProfileSkillsProps) {
  const [isEditingSkills, setIsEditingSkills] = useState(false);
  const [isEditingInterests, setIsEditingInterests] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [newInterest, setNewInterest] = useState("");

  const skills = user.skills || [];
  const interests = user.areasOfInterest || [];

  const handleAddSkill = async () => {
    if (!newSkill.trim() || !onUpdateSkills) {
      return;
    }

    const updatedSkills = [...skills, newSkill.trim()];
    await onUpdateSkills(updatedSkills);
    setNewSkill("");
  };

  const handleRemoveSkill = async (skillToRemove: string) => {
    if (!onUpdateSkills) {
      return;
    }
    const updatedSkills = skills.filter((s) => s !== skillToRemove);
    await onUpdateSkills(updatedSkills);
  };

  const handleAddInterest = async () => {
    if (!newInterest.trim() || !onUpdateInterests) {
      return;
    }

    const updatedInterests = [...interests, newInterest.trim()];
    await onUpdateInterests(updatedInterests);
    setNewInterest("");
  };

  const handleRemoveInterest = async (interestToRemove: string) => {
    if (!onUpdateInterests) {
      return;
    }
    const updatedInterests = interests.filter((i) => i !== interestToRemove);
    await onUpdateInterests(updatedInterests);
  };

  return (
    <Card>
      <CardHeader className="p-4 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-1.5">
            <Briefcase className="h-3.5 w-3.5" />
            Skills & Interests
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-3">
        {/* Skills - Compact */}
        {skills.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <h4 className="text-[10px] font-semibold text-muted-foreground uppercase">
                Skills
              </h4>
              {editable && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditingSkills(!isEditingSkills)}
                  className="h-6 px-2 text-[10px]"
                >
                  {isEditingSkills ? "Done" : "Edit"}
                </Button>
              )}
            </div>
            <div className="flex flex-wrap gap-1">
              {skills.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="text-[10px] py-0 h-5 gap-1"
                >
                  {skill}
                  {isEditingSkills && editable && (
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className="hover:text-destructive"
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  )}
                </Badge>
              ))}
            </div>
            {isEditingSkills && editable && (
              <div className="flex gap-1.5 mt-2">
                <Input
                  placeholder="Add skill"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddSkill();
                    }
                  }}
                  className="h-7 text-xs"
                />
                <Button
                  size="sm"
                  onClick={handleAddSkill}
                  disabled={!newSkill.trim()}
                  className="h-7 w-7 p-0"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Interests - Compact */}
        {interests.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <h4 className="text-[10px] font-semibold text-muted-foreground uppercase">
                Interests
              </h4>
              {editable && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditingInterests(!isEditingInterests)}
                  className="h-6 px-2 text-[10px]"
                >
                  {isEditingInterests ? "Done" : "Edit"}
                </Button>
              )}
            </div>
            <div className="flex flex-wrap gap-1">
              {interests.map((interest) => (
                <Badge
                  key={interest}
                  variant="outline"
                  className="text-[10px] py-0 h-5 gap-1"
                  style={{
                    borderColor: "#0070f340",
                    backgroundColor: "#0070f310",
                  }}
                >
                  {interest}
                  {isEditingInterests && editable && (
                    <button
                      onClick={() => handleRemoveInterest(interest)}
                      className="hover:text-destructive"
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  )}
                </Badge>
              ))}
            </div>
            {isEditingInterests && editable && (
              <div className="flex gap-1.5 mt-2">
                <Input
                  placeholder="Add interest"
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddInterest();
                    }
                  }}
                  className="h-7 text-xs"
                />
                <Button
                  size="sm"
                  onClick={handleAddInterest}
                  disabled={!newInterest.trim()}
                  className="h-7 w-7 p-0"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
