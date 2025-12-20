import { cva, type VariantProps } from "class-variance-authority";
import { m } from "framer-motion";
import type { MotionStyle } from "framer-motion";
import React from "react";

import { cn } from "@/lib/utils";

const cardVariants = cva(
  "rounded-lg border border-white/[0.08] bg-elevation-1 transition-all duration-200",
  {
    variants: {
      variant: {
        // Default - Subtle elevation
        default: "border-white/[0.08] bg-elevation-1 hover:border-white/[0.12]",

        // Interactive - Clickable cards
        interactive:
          "group cursor-pointer border-white/[0.08] bg-elevation-1 hover:border-white/[0.12] hover:bg-elevation-2 hover:shadow-[0_12px_24px_rgba(0,0,0,0.2)]",

        // Elevated - Higher layer
        elevated: "border-white/[0.1] bg-elevation-2",

        // Minimal - Nearly invisible
        minimal:
          "border border-white/[0.05] bg-transparent hover:border-white/[0.08]",

        // Ghost - Transparent background
        ghost:
          "border border-transparent bg-transparent hover:border-white/[0.05]",

        // Outline - Border only
        outline: "border border-white/[0.12] bg-transparent",

        // Feature - Accent highlight
        feature: "border-accent/20 bg-accent/5 hover:border-accent/30",

        // Light - Soft translucent panel used widely in app
        light: "border-white/10 bg-white/5 hover:border-white/20",
      },
      padding: {
        none: "p-0",
        xs: "p-3",
        sm: "p-4",
        default: "p-6",
        lg: "p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "default",
    },
  },
);

// Separate div props that should not be passed to motion components
type BaseDivProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  | "onAnimationStart"
  | "onAnimationEnd"
  | "onAnimationIteration"
  | "onDrag"
  | "onDragEnd"
  | "onDragStart"
  | "onDragEnter"
  | "onDragExit"
  | "onDragLeave"
  | "onDragOver"
  | "onDrop"
>;

export interface CardProps
  extends BaseDivProps,
    VariantProps<typeof cardVariants> {
  animate?: boolean;
  hover?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant,
      padding,
      animate = false,
      hover = true,
      children,
      ...props
    },
    ref,
  ) => {
    const cardClassName = cn(cardVariants({ variant, padding, className }));

    if (animate) {
      return (
        <m.div
          ref={ref}
          className={cardClassName}
          whileHover={hover ? { y: -4 } : {}}
          whileTap={hover ? { scale: 0.98, y: 0 } : {}}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 25,
          }}
          onClick={props.onClick}
          onMouseEnter={props.onMouseEnter}
          onMouseLeave={props.onMouseLeave}
          onFocus={props.onFocus}
          onBlur={props.onBlur}
          id={props.id}
          style={props.style as unknown as MotionStyle}
          role={props.role}
          tabIndex={props.tabIndex}
        >
          {children}
        </m.div>
      );
    }

    return (
      <div ref={ref} className={cardClassName} {...props}>
        {children}
      </div>
    );
  },
);

Card.displayName = "Card";

// Sub-components for consistent card structure
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-2", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight text-foreground",
      className,
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm leading-relaxed text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("pt-6", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center pt-6", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

// FeatureCard - A specialized card for showcasing features
const FeatureCard = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Card
        ref={ref}
        variant="feature"
        animate
        className={cn("h-full", className)}
        {...props}
      >
        {children}
      </Card>
    );
  },
);

FeatureCard.displayName = "FeatureCard";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  FeatureCard,
};
