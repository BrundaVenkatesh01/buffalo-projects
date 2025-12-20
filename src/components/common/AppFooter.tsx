import Link from "next/link";

import { cn } from "@/lib/utils";

export function AppFooter({ className }: { className?: string }) {
  return (
    <footer
      className={cn(
        "border-t border-white/5 bg-black/50 backdrop-blur-xl",
        className,
      )}
    >
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-lg">
                B
              </div>
              <div>
                <div className="font-bold text-lg text-foreground">
                  Buffalo Projects
                </div>
                <div className="text-sm text-muted-foreground">
                  Build in public
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              The entrepreneurial nerve center for Buffalo builders. Crafted in
              Buffalo, for Buffalo.
            </p>
            <div className="flex gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-primary" />
                Realtime sync
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-success" />
                Secure by Firebase
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="text-sm font-semibold text-foreground">
              Platform
            </div>
            <div className="space-y-3 text-sm">
              <Link
                href="/resources"
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                Resources
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <div className="text-sm font-semibold text-foreground">Support</div>
            <div className="space-y-3 text-sm">
              <a
                href="mailto:hello@buffaloprojects.com"
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                Contact
              </a>
              <Link
                href="/support"
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                Help Center
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 text-sm text-muted-foreground">
          © {new Date().getFullYear()} Buffalo Projects. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default AppFooter;
