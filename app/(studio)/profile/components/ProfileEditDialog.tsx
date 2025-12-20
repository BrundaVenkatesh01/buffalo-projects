"use client";

import { useState, useEffect } from "react";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Textarea,
  Badge,
} from "@/components/unified";
import { X, Plus } from "@/icons";
import type { User, SocialLink } from "@/types";

interface ProfileEditDialogProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updates: {
    firstName?: string;
    lastName?: string;
    bio?: string;
    buffaloConnection?: string;
    displayName?: string;
    socialLinks?: SocialLink[];
    skills?: string[];
    areasOfInterest?: string[];
  }) => Promise<void>;
  saving?: boolean;
}

export function ProfileEditDialog({
  user,
  isOpen,
  onClose,
  onSave,
  saving = false,
}: ProfileEditDialogProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [buffaloConnection, setBuffaloConnection] = useState("");
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [areasOfInterest, setAreasOfInterest] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [newInterest, setNewInterest] = useState("");

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setBio(user.bio || "");
      setBuffaloConnection(user.buffaloConnection || "");
      setSocialLinks(user.socialLinks || []);
      setSkills(user.skills || []);
      setAreasOfInterest(user.areasOfInterest || []);
    }
  }, [user]);

  const handleSave = async () => {
    const updates: Parameters<typeof onSave>[0] = {
      firstName: firstName.trim() || undefined,
      lastName: lastName.trim() || undefined,
      bio: bio.trim() || undefined,
      buffaloConnection: buffaloConnection.trim() || undefined,
      socialLinks: socialLinks.filter((link) => link.url.trim()),
      skills: skills.filter((skill) => skill.trim()),
      areasOfInterest: areasOfInterest.filter((interest) => interest.trim()),
    };

    // Update displayName if first/last name changed
    if (updates.firstName || updates.lastName) {
      updates.displayName = [updates.firstName, updates.lastName]
        .filter(Boolean)
        .join(" ");
    }

    await onSave(updates);
  };

  const handleCancel = () => {
    // Reset form to current user values
    setFirstName(user.firstName || "");
    setLastName(user.lastName || "");
    setBio(user.bio || "");
    setBuffaloConnection(user.buffaloConnection || "");
    setSocialLinks(user.socialLinks || []);
    setSkills(user.skills || []);
    setAreasOfInterest(user.areasOfInterest || []);
    onClose();
  };

  const addSocialLink = () => {
    setSocialLinks([...socialLinks, { platform: "", url: "" }]);
  };

  const updateSocialLink = (
    index: number,
    field: keyof SocialLink,
    value: string,
  ) => {
    const updated = [...socialLinks];
    updated[index] = { ...updated[index]!, [field]: value };
    setSocialLinks(updated);
  };

  const removeSocialLink = (index: number) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== index));
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const addInterest = () => {
    if (newInterest.trim() && !areasOfInterest.includes(newInterest.trim())) {
      setAreasOfInterest([...areasOfInterest, newInterest.trim()]);
      setNewInterest("");
    }
  };

  const removeInterest = (interest: string) => {
    setAreasOfInterest(areasOfInterest.filter((i) => i !== interest));
  };

  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto pointer-events-auto animate-in zoom-in-95 duration-200">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
            <div>
              <CardTitle className="text-2xl">Edit Public Profile</CardTitle>
              <CardDescription className="mt-1.5">
                Share what you&apos;re building with the Buffalo community
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                Basic Information
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="firstName" className="text-xs font-medium">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter first name"
                    className="h-9"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lastName" className="text-xs font-medium">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter last name"
                    className="h-9"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="bio" className="text-xs font-medium">
                  Bio
                </Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself and what you're building..."
                  rows={4}
                  className="resize-none text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  This appears on your public profile
                </p>
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="buffaloConnection"
                  className="text-xs font-medium"
                >
                  Buffalo Connection
                </Label>
                <Input
                  id="buffaloConnection"
                  value={buffaloConnection}
                  onChange={(e) => setBuffaloConnection(e.target.value)}
                  placeholder="e.g., UB Student, Local Builder, Canisius Alumni"
                  className="h-9"
                />
                <p className="text-xs text-muted-foreground">
                  How you&apos;re connected to Buffalo
                </p>
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                Skills & Expertise
              </h3>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSkill();
                      }
                    }}
                    placeholder="Add a skill (e.g., React, Marketing, Design)"
                    className="h-9"
                  />
                  <Button
                    type="button"
                    onClick={addSkill}
                    variant="outline"
                    size="sm"
                    leftIcon={<Plus className="h-3.5 w-3.5" />}
                  >
                    Add
                  </Button>
                </div>
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="cursor-pointer hover:bg-destructive/10 hover:text-destructive transition-colors"
                        onClick={() => removeSkill(skill)}
                      >
                        {skill}
                        <X className="ml-1 h-3 w-3" />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Areas of Interest */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                Areas of Interest
              </h3>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addInterest();
                      }
                    }}
                    placeholder="Add an interest (e.g., SaaS, EdTech, Sustainability)"
                    className="h-9"
                  />
                  <Button
                    type="button"
                    onClick={addInterest}
                    variant="outline"
                    size="sm"
                    leftIcon={<Plus className="h-3.5 w-3.5" />}
                  >
                    Add
                  </Button>
                </div>
                {areasOfInterest.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {areasOfInterest.map((interest) => (
                      <Badge
                        key={interest}
                        variant="secondary"
                        className="cursor-pointer hover:bg-destructive/10 hover:text-destructive transition-colors"
                        onClick={() => removeInterest(interest)}
                      >
                        {interest}
                        <X className="ml-1 h-3 w-3" />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                Social Links
              </h3>
              <div className="space-y-3">
                {socialLinks.map((link, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={link.platform}
                      onChange={(e) =>
                        updateSocialLink(index, "platform", e.target.value)
                      }
                      placeholder="Platform (e.g., GitHub, LinkedIn)"
                      className="h-9 w-40"
                    />
                    <Input
                      value={link.url}
                      onChange={(e) =>
                        updateSocialLink(index, "url", e.target.value)
                      }
                      placeholder="URL"
                      className="h-9 flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSocialLink(index)}
                      className="shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  onClick={addSocialLink}
                  variant="outline"
                  size="sm"
                  leftIcon={<Plus className="h-3.5 w-3.5" />}
                >
                  Add Social Link
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t">
              <Button
                onClick={() => {
                  void handleSave();
                }}
                disabled={saving}
                size="sm"
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                variant="ghost"
                onClick={handleCancel}
                disabled={saving}
                size="sm"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
