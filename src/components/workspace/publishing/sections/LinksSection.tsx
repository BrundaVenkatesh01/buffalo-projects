/**
 * Links Section
 *
 * External links: demo, GitHub, website, social media.
 */

"use client";

import { usePublishForm } from "../PublishFormContext";

import { SectionWrapper } from "./SectionWrapper";

import { Input, Label } from "@/components/unified";
import { Globe, Github, Linkedin, ExternalLink } from "@/icons";

export function LinksSection() {
  const { state, dispatch } = usePublishForm();

  return (
    <SectionWrapper
      title="Links"
      sectionKey="links"
      icon={<Globe className="h-4 w-4 text-muted-foreground" />}
    >
      <div className="space-y-4">
        {/* Demo URL */}
        <div className="space-y-1.5">
          <Label
            htmlFor="demoUrl"
            className="text-sm text-foreground flex items-center gap-2"
          >
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
            Live Demo
          </Label>
          <Input
            id="demoUrl"
            type="url"
            value={state.demoUrl}
            onChange={(e) =>
              dispatch({ type: "SET_DEMO_URL", payload: e.target.value })
            }
            placeholder="https://your-demo.com"
            className="bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground focus:border-primary"
          />
        </div>

        {/* GitHub URL */}
        <div className="space-y-1.5">
          <Label
            htmlFor="githubUrl"
            className="text-sm text-foreground flex items-center gap-2"
          >
            <Github className="h-3.5 w-3.5 text-muted-foreground" />
            GitHub Repository
          </Label>
          <Input
            id="githubUrl"
            type="url"
            value={state.githubUrl}
            onChange={(e) =>
              dispatch({ type: "SET_GITHUB_URL", payload: e.target.value })
            }
            placeholder="https://github.com/user/repo"
            className="bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground focus:border-primary"
          />
        </div>

        {/* Website URL */}
        <div className="space-y-1.5">
          <Label
            htmlFor="websiteUrl"
            className="text-sm text-foreground flex items-center gap-2"
          >
            <Globe className="h-3.5 w-3.5 text-muted-foreground" />
            Website
          </Label>
          <Input
            id="websiteUrl"
            type="url"
            value={state.websiteUrl}
            onChange={(e) =>
              dispatch({ type: "SET_WEBSITE_URL", payload: e.target.value })
            }
            placeholder="https://your-project.com"
            className="bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground focus:border-primary"
          />
        </div>

        {/* Social Links */}
        <div className="pt-2 border-t border-white/5">
          <p className="text-xs text-muted-foreground mb-3">Social Links</p>
          <div className="grid grid-cols-2 gap-3">
            {/* Twitter/X */}
            <div className="space-y-1.5">
              <Label
                htmlFor="twitterUrl"
                className="text-xs text-muted-foreground"
              >
                Twitter / X
              </Label>
              <Input
                id="twitterUrl"
                type="url"
                value={state.twitterUrl}
                onChange={(e) =>
                  dispatch({ type: "SET_TWITTER_URL", payload: e.target.value })
                }
                placeholder="https://twitter.com/..."
                className="bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground focus:border-primary text-sm"
              />
            </div>

            {/* LinkedIn */}
            <div className="space-y-1.5">
              <Label
                htmlFor="linkedinUrl"
                className="text-xs text-muted-foreground flex items-center gap-1"
              >
                <Linkedin className="h-3 w-3" />
                LinkedIn
              </Label>
              <Input
                id="linkedinUrl"
                type="url"
                value={state.linkedinUrl}
                onChange={(e) =>
                  dispatch({
                    type: "SET_LINKEDIN_URL",
                    payload: e.target.value,
                  })
                }
                placeholder="https://linkedin.com/..."
                className="bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground focus:border-primary text-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
