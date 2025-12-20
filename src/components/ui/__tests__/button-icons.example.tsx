/**
 * Button Icon Examples
 *
 * This file demonstrates the improved button component
 * with proper icon alignment and sizing.
 */

import { Button } from "../button";

import { ArrowRight, Download, Plus, Send, Upload } from "@/icons";


export function ButtonIconExamples() {
  return (
    <div className="flex flex-col gap-6 p-8">
      {/* Size variations with icons */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Size Variations</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="xs" leftIcon={<Plus />}>
            Extra Small
          </Button>
          <Button size="sm" leftIcon={<Plus />}>
            Small Button
          </Button>
          <Button size="md" leftIcon={<Plus />}>
            Medium Button
          </Button>
          <Button size="lg" leftIcon={<Plus />}>
            Large Button
          </Button>
          <Button size="xl" leftIcon={<Plus />}>
            Extra Large
          </Button>
        </div>
      </div>

      {/* Icon positions */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Icon Positions</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Button leftIcon={<Upload />}>Upload File</Button>
          <Button rightIcon={<Download />}>Download File</Button>
          <Button leftIcon={<Send />} rightIcon={<ArrowRight />}>
            Send Message
          </Button>
        </div>
      </div>

      {/* Variant styles */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Variant Styles</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary" leftIcon={<Plus />}>
            Primary
          </Button>
          <Button variant="secondary" leftIcon={<Plus />}>
            Secondary
          </Button>
          <Button variant="outline" leftIcon={<Plus />}>
            Outline
          </Button>
          <Button variant="ghost" leftIcon={<Plus />}>
            Ghost
          </Button>
          <Button variant="destructive" leftIcon={<Plus />}>
            Destructive
          </Button>
        </div>
      </div>

      {/* Loading states */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Loading States</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Button loading>Loading...</Button>
          <Button loading size="sm">
            Processing
          </Button>
          <Button loading size="lg">
            Please Wait
          </Button>
        </div>
      </div>

      {/* Icon-only buttons */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Icon-Only Buttons</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="icon" aria-label="Add">
            <Plus />
          </Button>
          <Button size="icon-sm" aria-label="Upload">
            <Upload />
          </Button>
          <Button size="icon-lg" aria-label="Download">
            <Download />
          </Button>
        </div>
      </div>

      {/* Block width */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Block Width</h2>
        <Button block leftIcon={<Upload />} rightIcon={<ArrowRight />}>
          Full Width Button
        </Button>
      </div>
    </div>
  );
}
