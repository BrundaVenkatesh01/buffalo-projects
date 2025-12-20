/**
 * Image Crop Modal
 *
 * Modal for cropping images before upload using react-easy-crop.
 * Supports multiple aspect ratios and provides zoom controls.
 */

"use client";

import { useCallback, useEffect, useState } from "react";
import Cropper from "react-easy-crop";
import type { Area, Point } from "react-easy-crop";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Button,
} from "@/components/unified";
import { Crop, ZoomIn, ZoomOut, Loader2 } from "@/icons";
import { cn } from "@/lib/utils";
import {
  getCroppedImg,
  blobToFile,
  readFileAsDataUrl,
  getImageProcessingOptions,
  type CroppedAreaPixels,
} from "@/utils/imageUtils";

// Aspect ratio presets
const ASPECT_RATIOS = {
  "16:9": 16 / 9,
  "3:2": 3 / 2,
  "4:3": 4 / 3,
  "1:1": 1,
  Free: 0, // 0 means freeform
} as const;

type AspectRatioKey = keyof typeof ASPECT_RATIOS;

export type ImageType = "cover" | "screenshot";

export interface ImageCropModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when modal is closed */
  onClose: () => void;
  /** The image file to crop (for new uploads) */
  imageFile: File | null;
  /** Type of image being cropped */
  imageType: ImageType;
  /** Callback when crop is complete, receives the cropped File */
  onCropComplete: (croppedFile: File) => Promise<void>;
  /** Default aspect ratio */
  defaultAspectRatio?: AspectRatioKey;
}

export function ImageCropModal({
  isOpen,
  onClose,
  imageFile,
  imageType,
  onCropComplete,
  defaultAspectRatio,
}: ImageCropModalProps) {
  // Image source
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  // Crop state
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] =
    useState<CroppedAreaPixels | null>(null);

  // Aspect ratio - default based on image type
  const [selectedAspect, setSelectedAspect] = useState<AspectRatioKey>(
    defaultAspectRatio || (imageType === "cover" ? "16:9" : "16:9"),
  );

  // Processing state
  const [processing, setProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<
    "cropping" | "uploading" | null
  >(null);

  // Load image when file changes
  useEffect(() => {
    if (!imageFile) {
      setImageSrc(null);
      return;
    }

    const loadImage = async () => {
      try {
        const dataUrl = await readFileAsDataUrl(imageFile);
        setImageSrc(dataUrl);
      } catch (error) {
        console.error("Failed to load image:", error);
      }
    };

    void loadImage();
  }, [imageFile]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null);
      setProcessing(false);
      setProcessingStep(null);
      setSelectedAspect(
        defaultAspectRatio || (imageType === "cover" ? "16:9" : "16:9"),
      );
    }
  }, [isOpen, imageType, defaultAspectRatio]);

  // Handle crop complete from Cropper
  const handleCropComplete = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    [],
  );

  // Handle apply crop
  const handleApply = async () => {
    if (!imageSrc || !croppedAreaPixels || !imageFile) {
      return;
    }

    setProcessing(true);
    setProcessingStep("cropping");

    try {
      // Get processing options based on image type
      const options = getImageProcessingOptions(imageType);

      // Generate cropped image blob
      const croppedBlob = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        options,
      );

      // Convert to File
      const croppedFile = blobToFile(croppedBlob, imageFile.name);

      // Call parent handler (will upload)
      setProcessingStep("uploading");
      await onCropComplete(croppedFile);

      // Close modal on success
      onClose();
    } catch (error) {
      console.error("Failed to crop image:", error);
      // Error handling done by parent
    } finally {
      setProcessing(false);
      setProcessingStep(null);
    }
  };

  // Get actual aspect ratio value (0 = freeform)
  const aspectValue = ASPECT_RATIOS[selectedAspect];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border-white/10 bg-[#0b0d0f]/98 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="font-display text-xl text-foreground flex items-center gap-2">
            <Crop className="h-5 w-5" />
            Crop {imageType === "cover" ? "Cover Image" : "Image"}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Adjust the crop area and aspect ratio before uploading
          </DialogDescription>
        </DialogHeader>

        {/* Cropper Area */}
        <div className="relative flex-1 min-h-[300px] bg-black/50 rounded-lg overflow-hidden">
          {imageSrc ? (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={aspectValue || undefined}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={handleCropComplete}
              classes={{
                containerClassName: "!absolute !inset-0",
                cropAreaClassName: "!border-primary !border-2",
              }}
              showGrid
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="space-y-4 pt-4">
          {/* Aspect Ratio Selector */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-muted-foreground mr-2">Ratio:</span>
            {(Object.keys(ASPECT_RATIOS) as AspectRatioKey[]).map((ratio) => (
              <button
                key={ratio}
                type="button"
                onClick={() => setSelectedAspect(ratio)}
                className={cn(
                  "px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                  selectedAspect === ratio
                    ? "bg-primary text-primary-foreground"
                    : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground",
                )}
              >
                {ratio}
              </button>
            ))}
          </div>

          {/* Zoom Slider */}
          <div className="flex items-center gap-3">
            <ZoomOut className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="flex-1 h-2 bg-white/10 rounded-full appearance-none cursor-pointer
                         [&::-webkit-slider-thumb]:appearance-none
                         [&::-webkit-slider-thumb]:w-4
                         [&::-webkit-slider-thumb]:h-4
                         [&::-webkit-slider-thumb]:rounded-full
                         [&::-webkit-slider-thumb]:bg-primary
                         [&::-webkit-slider-thumb]:cursor-pointer
                         [&::-webkit-slider-thumb]:transition-transform
                         [&::-webkit-slider-thumb]:hover:scale-110"
            />
            <ZoomIn className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="text-xs text-muted-foreground w-10 text-right">
              {zoom.toFixed(1)}x
            </span>
          </div>
        </div>

        <DialogFooter className="gap-2 pt-4 border-t border-white/10">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={processing}
            className="text-muted-foreground hover:text-foreground"
          >
            Cancel
          </Button>
          <Button
            onClick={() => void handleApply()}
            disabled={processing || !croppedAreaPixels || !imageSrc}
          >
            {processing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {processingStep === "cropping" ? "Cropping..." : "Uploading..."}
              </>
            ) : (
              "Apply & Upload"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
