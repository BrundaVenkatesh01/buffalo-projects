"use client";

import { notFound } from "next/navigation";
import { toast } from "sonner";

import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Input,
  Textarea,
  Badge,
  StatCard,
  EmptyState,
} from "@/components/unified";
import { Mail, Search, User, TrendingUp, Folder } from "@/icons";
import { allowDemoContent } from "@/utils/env";

export default function DesignSystemPage() {
  if (!allowDemoContent()) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background py-12 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-6xl space-y-24 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="space-y-4 text-center">
          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Buffalo Projects Design System
          </h1>
          <p className="text-base text-muted-foreground sm:text-lg">
            Built with shadcn/ui primitives, customized for Buffalo Projects
          </p>
        </div>

        {/* Buttons */}
        <section className="space-y-10">
          <div className="space-y-3">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Buttons
            </h2>
            <p className="text-sm text-muted-foreground sm:text-base">
              Button component with variants, sizes, and loading states
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Variants</CardTitle>
              <CardDescription>
                Different button styles for different contexts
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
              <Button variant="link">Link</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sizes</CardTitle>
              <CardDescription>From extra small to extra large</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center gap-3">
              <Button size="xs">Extra Small</Button>
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
              <Button size="xl">Extra Large</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>States</CardTitle>
              <CardDescription>
                Loading, disabled, and icon variants
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Button isLoading>Loading...</Button>
              <Button disabled>Disabled</Button>
              <Button size="icon" aria-label="User profile">
                <User className="h-4 w-4" />
              </Button>
              <Button>
                <Mail className="h-4 w-4" />
                With Icon
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* Inputs */}
        <section className="space-y-10">
          <div className="space-y-3">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Inputs
            </h2>
            <p className="text-sm text-muted-foreground sm:text-base">
              Enhanced inputs with built-in labels, helper text, icons, and
              error affordances
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Basic Input</CardTitle>
              <CardDescription>Standard text input with label</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Email"
                type="email"
                placeholder="you@buffaloprojects.com"
                helperText="We'll share workspace updates here."
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Input with Icon</CardTitle>
              <CardDescription>Left icon with magnetic focus</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Search"
                type="text"
                placeholder="Search projects..."
                leftIcon={<Search className="h-4 w-4" />}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Input with Error</CardTitle>
              <CardDescription>Input showing error state</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Password"
                type="password"
                placeholder="••••••"
                error="Password must be at least 8 characters"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Textarea</CardTitle>
              <CardDescription>
                Long-form writing with the same focus and helper states
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                label="Weekly update"
                placeholder="Share what moved the needle for your project this week."
                helperText="Supports markdown for emphasis and links."
                rows={4}
              />
            </CardContent>
          </Card>
        </section>

        {/* Cards */}
        <section className="space-y-10">
          <div className="space-y-3">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Cards
            </h2>
            <p className="text-sm text-muted-foreground sm:text-base">
              Card component with multiple variants and composition patterns
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card variant="default">
              <CardHeader>
                <CardTitle>Default Card</CardTitle>
                <CardDescription>
                  Standard card with subtle elevation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  This is the default card variant with standard styling.
                </p>
              </CardContent>
            </Card>

            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Elevated Card</CardTitle>
                <CardDescription>Higher layer with shadow</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Elevated variant for important content.
                </p>
              </CardContent>
            </Card>

            <Card variant="interactive">
              <CardHeader>
                <CardTitle>Interactive Card</CardTitle>
                <CardDescription>Clickable with hover states</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Use for cards that trigger actions.
                </p>
              </CardContent>
            </Card>

            <Card variant="minimal">
              <CardHeader>
                <CardTitle>Minimal Card</CardTitle>
                <CardDescription>Nearly invisible borders</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Subtle card for background elements.
                </p>
              </CardContent>
            </Card>

            <Card variant="ghost">
              <CardHeader>
                <CardTitle>Ghost Card</CardTitle>
                <CardDescription>Transparent background</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  No background until hover.
                </p>
              </CardContent>
            </Card>

            <Card variant="outline">
              <CardHeader>
                <CardTitle>Outline Card</CardTitle>
                <CardDescription>Border only styling</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Clean outline variant.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Badges */}
        <section className="space-y-10">
          <div className="space-y-3">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Badges
            </h2>
            <p className="text-sm text-muted-foreground sm:text-base">
              Small status indicators and labels
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Badge Variants</CardTitle>
              <CardDescription>Different badge styles</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Badge variant="default">Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
            </CardContent>
          </Card>
        </section>

        {/* Buffalo Pattern Components */}
        <section className="space-y-10">
          <div className="space-y-3">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Buffalo Components
            </h2>
            <p className="text-sm text-muted-foreground sm:text-base">
              Custom pattern components built on shadcn primitives
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-xl font-semibold">Stat Cards</h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <StatCard
                label="Total Projects"
                value="127"
                change={{ value: 12, trend: "up" }}
                icon={<Folder />}
              />
              <StatCard
                label="Active Users"
                value="1,234"
                change={{ value: 8, trend: "up" }}
                icon={<User />}
              />
              <StatCard
                label="Conversion Rate"
                value="24.5%"
                change={{ value: 3, trend: "down" }}
                icon={<TrendingUp />}
              />
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-xl font-semibold">Empty State</h3>
            <Card>
              <CardContent className="p-0">
                <EmptyState
                  icon={<Folder />}
                  title="No projects yet"
                  description="Get started by creating your first project. It only takes a minute."
                  action={{
                    label: "Create Project",
                    onClick: () => toast.info("Create project clicked"),
                  }}
                  secondaryAction={{
                    label: "Learn More",
                    onClick: () => toast.info("Learn more clicked"),
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Typography */}
        <section className="space-y-10">
          <div className="space-y-3">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Typography
            </h2>
            <p className="text-sm text-muted-foreground sm:text-base">
              Text styles and hierarchy throughout the application
            </p>
          </div>

          <Card>
            <CardContent className="space-y-6 pt-6">
              <div>
                <div
                  className="font-display text-6xl font-bold"
                  role="heading"
                  aria-level={1}
                >
                  Display Heading
                </div>
                <p className="text-sm text-muted-foreground">
                  text-6xl font-display
                </p>
              </div>
              <div>
                <h2 className="text-4xl font-bold">Heading 1</h2>
                <p className="text-sm text-muted-foreground">
                  text-4xl font-bold
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-semibold">Heading 2</h3>
                <p className="text-sm text-muted-foreground">
                  text-2xl font-semibold
                </p>
              </div>
              <div>
                <h4 className="text-xl font-semibold">Heading 3</h4>
                <p className="text-sm text-muted-foreground">
                  text-xl font-semibold
                </p>
              </div>
              <div>
                <p className="text-base">
                  Body text - This is regular paragraph text. Lorem ipsum dolor
                  sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                  incididunt ut labore.
                </p>
                <p className="text-sm text-muted-foreground">text-base</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Secondary text - Supporting information and less important
                  content.
                </p>
                <p className="text-xs text-muted-foreground">
                  text-sm text-muted-foreground
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  Label Text
                </p>
                <p className="text-xs text-muted-foreground">
                  text-xs uppercase tracking-wider
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Colors */}
        <section className="space-y-10">
          <div className="space-y-3">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Colors
            </h2>
            <p className="text-sm text-muted-foreground sm:text-base">
              Semantic color palette based on HSL variables
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Background</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-background ring-1 ring-white/10" />
                  <div className="text-sm">
                    <div className="font-medium">Background</div>
                    <div className="text-muted-foreground">
                      hsl(var(--background))
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-foreground" />
                  <div className="text-sm">
                    <div className="font-medium">Foreground</div>
                    <div className="text-muted-foreground">
                      hsl(var(--foreground))
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Primary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-primary" />
                  <div className="text-sm">
                    <div className="font-medium">Primary</div>
                    <div className="text-muted-foreground">
                      hsl(var(--primary))
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Destructive</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-destructive" />
                  <div className="text-sm">
                    <div className="font-medium">Destructive</div>
                    <div className="text-muted-foreground">
                      hsl(var(--destructive))
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Muted</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-muted ring-1 ring-white/10" />
                  <div className="text-sm">
                    <div className="font-medium">Muted</div>
                    <div className="text-muted-foreground">
                      hsl(var(--muted))
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-background">
                    <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                      Text
                    </div>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium">Muted Foreground</div>
                    <div className="text-muted-foreground">
                      hsl(var(--muted-foreground))
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Border</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-background ring-2 ring-border" />
                  <div className="text-sm">
                    <div className="font-medium">Border</div>
                    <div className="text-muted-foreground">
                      hsl(var(--border))
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Spacing */}
        <section className="space-y-10">
          <div className="space-y-3">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Spacing
            </h2>
            <p className="text-sm text-muted-foreground sm:text-base">
              Consistent spacing scale throughout the application
            </p>
          </div>

          <Card>
            <CardContent className="space-y-4 pt-6">
              {[1, 2, 3, 4, 6, 8, 12, 16, 20, 24].map((space) => (
                <div key={space} className="flex items-center gap-4">
                  <div className="w-16 text-sm font-medium">{space * 4}px</div>
                  <div className="w-16 text-sm text-muted-foreground">
                    space-{space}
                  </div>
                  <div
                    className="h-8 bg-primary"
                    style={{ width: `${space * 4}px` }}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
