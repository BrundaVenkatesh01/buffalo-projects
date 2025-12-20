"use client";

import { Button } from "@/components/unified";
import { Calendar, Edit3, Mail, MapPin } from "@/icons";
import { BUFFALO_BRAND } from "@/tokens/brand";

interface ProfileHeaderProps {
  displayName: string;
  initials: string;
  email?: string | null;
  photoURL?: string | null;
  buffaloConnection?: string;
  memberSince: string;
  bio?: string;
  isEditing: boolean;
  onEditClick: () => void;
}

export function ProfileHeader({
  displayName,
  initials,
  email,
  photoURL,
  buffaloConnection,
  memberSince,
  bio,
  isEditing,
  onEditClick,
}: ProfileHeaderProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        {/* Avatar - Compact */}
        <div className="relative group shrink-0">
          <div
            className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-xl border text-lg sm:text-xl font-bold transition-all duration-200"
            style={{
              borderColor: `${BUFFALO_BRAND.blue.primary}30`,
              background: photoURL
                ? "transparent"
                : `linear-gradient(135deg, ${BUFFALO_BRAND.blue.primary}08 0%, ${BUFFALO_BRAND.blue.primary}15 100%)`,
            }}
          >
            {photoURL ? (
              <img
                src={photoURL}
                alt={displayName}
                className="h-full w-full rounded-xl object-cover"
              />
            ) : (
              <span style={{ color: BUFFALO_BRAND.blue.primary }}>
                {initials}
              </span>
            )}
          </div>
        </div>

        {/* Name and metadata - Single line on desktop */}
        <div className="flex min-w-0 flex-1 flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="min-w-0 space-y-0.5">
            {/* Name - Compact */}
            <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight truncate">
              {displayName}
            </h1>
            {/* Email - Compact */}
            {email && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Mail className="h-3 w-3 shrink-0" />
                <span className="truncate">{email}</span>
              </div>
            )}
          </div>

          {/* Edit Button - Inline */}
          {!isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={onEditClick}
              leftIcon={<Edit3 className="h-3 w-3" />}
              className="shrink-0"
              style={{
                borderColor: BUFFALO_BRAND.blue.primary + "30",
              }}
            >
              Edit Public Profile
            </Button>
          )}
        </div>
      </div>

      {/* Metadata pills - Compact */}
      <div className="flex flex-wrap items-center gap-1.5 pl-15 sm:pl-19">
        {buffaloConnection && (
          <div
            className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium border"
            style={{
              backgroundColor: `${BUFFALO_BRAND.blue.primary}12`,
              borderColor: `${BUFFALO_BRAND.blue.primary}25`,
              color: BUFFALO_BRAND.blue.primary,
            }}
          >
            <MapPin className="h-2.5 w-2.5" />
            {buffaloConnection}
          </div>
        )}

        <div className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-foreground/70 border border-border/50">
          <Calendar className="h-2.5 w-2.5" />
          {memberSince}
        </div>
      </div>

      {/* Bio - Collapsed with line clamp */}
      {!isEditing && bio && (
        <div className="pl-15 sm:pl-19">
          <p
            className="text-xs leading-relaxed text-foreground/70 line-clamp-2"
            style={{ borderColor: `${BUFFALO_BRAND.blue.primary}40` }}
          >
            {bio}
          </p>
        </div>
      )}
    </div>
  );
}
