import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-[0.24em] transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary/15 text-primary-foreground",
        secondary: "border border-white/10 bg-white/5 text-muted-foreground",
        destructive:
          "border-transparent bg-destructive/20 text-destructive-foreground",
        outline: "border-white/15 text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
