import { useMemo, useState } from "react";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  Switch,
} from "@/components/unified";
import { Share2, Copy, Check, ExternalLink } from "@/icons";
import { useWorkspaceStore } from "@/stores/workspaceStore";
import { getSiteUrl } from "@/utils/env";

export function ShareDialog() {
  const { currentWorkspace, updateWorkspace, saveWorkspace } =
    useWorkspaceStore();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [externalLink, setExternalLink] = useState(
    currentWorkspace?.publicLink || "",
  );

  const siteUrl = useMemo(() => {
    if (typeof window !== "undefined" && window.location?.origin) {
      return window.location.origin;
    }
    return getSiteUrl();
  }, []);

  if (!currentWorkspace) {
    return null;
  }
  const isPublic = currentWorkspace.isPublic || false;
  const isBuffaloAffiliated = currentWorkspace.buffaloAffiliated ?? false;
  const projectSlug = currentWorkspace.slug;
  const projectUrl = projectSlug
    ? `${siteUrl}/p/${projectSlug}`
    : `${siteUrl}/workspace/${currentWorkspace.code}`;

  const handleTogglePublic = async (checked: boolean) => {
    updateWorkspace({ isPublic: checked });
    await saveWorkspace();
  };

  const handleUpdateExternalLink = async () => {
    updateWorkspace({ publicLink: externalLink });
    await saveWorkspace();
  };

  const handleToggleBuffaloAffiliation = async (checked: boolean) => {
    updateWorkspace({ buffaloAffiliated: checked });
    await saveWorkspace();
  };

  const handleCopyUrl = () => {
    void navigator.clipboard.writeText(projectUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" leftIcon={<Share2 />}>
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg border-white/10 bg-[#0b0d0f]/90">
        <DialogHeader>
          <DialogTitle className="font-display text-xl text-foreground">
            Share your project
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Control what appears in public directories. Your canvas, journal,
            and pivot insights remain private.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <div className="space-y-0.5">
              <Label
                htmlFor="public-toggle"
                className="text-sm font-medium text-foreground"
              >
                Make project public
              </Label>
              <p className="text-xs text-muted-foreground">
                List your workspace in the Buffalo community showcase.
              </p>
            </div>
            <Switch
              id="public-toggle"
              checked={isPublic}
              onCheckedChange={(checked) => {
                void handleTogglePublic(checked);
              }}
            />
          </div>

          {isPublic && (
            <>
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <div className="space-y-0.5">
                  <Label
                    htmlFor="buffalo-affiliation"
                    className="text-sm font-medium text-foreground"
                  >
                    Buffalo affiliation
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Highlight that you live, work, or study in the Buffalo
                    region.
                  </p>
                </div>
                <Switch
                  id="buffalo-affiliation"
                  checked={isBuffaloAffiliated}
                  onCheckedChange={(checked) => {
                    void handleToggleBuffaloAffiliation(checked);
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">
                  Project URL
                </Label>
                <div className="flex gap-2">
                  <Input
                    value={projectUrl}
                    readOnly
                    className="flex-1 cursor-text bg-white/5 text-sm text-muted-foreground"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyUrl}
                    className="shrink-0"
                  >
                    {copied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* External Link (optional) */}
              <div className="space-y-2">
                <Label htmlFor="external-link">
                  External project link (optional)
                </Label>
                <p className="text-xs text-muted-foreground">
                  Link to a live demo, GitHub repo, or website.
                </p>
                <div className="flex gap-2">
                  <Input
                    id="external-link"
                    value={externalLink}
                    onChange={(e) => setExternalLink(e.target.value)}
                    placeholder="https://example.com"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      void handleUpdateExternalLink();
                    }}
                  >
                    Save
                  </Button>
                </div>
              </div>

              <div className="rounded-2xl border border-primary/30 bg-primary/10 p-4 text-xs text-primary-foreground">
                <p className="mb-1 text-sm font-medium">Privacy protection</p>
                <p>
                  Only your project name, description, and optional external
                  link will be public. Your Business Model Canvas, journal
                  entries, and pivot history remain private.
                </p>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-between border-t border-white/10 pt-4">
          <Button
            variant="ghost"
            onClick={() => setOpen(false)}
            className="text-muted-foreground hover:text-foreground"
          >
            Close
          </Button>
          <div className="flex items-center gap-2">
            {isPublic && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(projectUrl, "_blank")}
              >
                Preview public page
              </Button>
            )}
            {isPublic && externalLink && (
              <Button
                variant="outline"
                size="sm"
                leftIcon={<ExternalLink />}
                onClick={() => window.open(externalLink, "_blank")}
              >
                View External Link
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
