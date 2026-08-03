"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Camera, FlipHorizontal, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CameraCaptureModalProps {
  open: boolean;
  onClose: () => void;
  onCapture: (file: File) => void;
  title?: string;
  defaultFacingMode?: "user" | "environment";
}

export function CameraCaptureModal({
  open,
  onClose,
  onCapture,
  title = "Take Photo",
  defaultFacingMode = "environment",
}: CameraCaptureModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">(defaultFacingMode);
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  useEffect(() => {
    if (!open) {
      stopStream();
      setError(null);
      return;
    }

    let cancelled = false;

    async function startCamera() {
      setIsStarting(true);
      setError(null);
      stopStream();

      if (!navigator.mediaDevices?.getUserMedia) {
        setError("Camera is not supported on this device or browser.");
        setIsStarting(false);
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode,
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
          audio: false,
        });

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        const video = videoRef.current;
        if (video) {
          video.srcObject = stream;
          await video.play();
        }
      } catch {
        setError(
          "Unable to access the camera. Allow camera permission or upload a file instead."
        );
      } finally {
        if (!cancelled) setIsStarting(false);
      }
    }

    startCamera();

    return () => {
      cancelled = true;
      stopStream();
    };
  }, [open, facingMode, stopStream]);

  useEffect(() => {
    if (open) setFacingMode(defaultFacingMode);
  }, [open, defaultFacingMode]);

  function handleCapture() {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0);
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const file = new File([blob], `camera-${Date.now()}.jpg`, {
          type: "image/jpeg",
        });
        onCapture(file);
        onClose();
      },
      "image/jpeg",
      0.92
    );
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="camera-capture-title"
      >
        <div className="flex items-center justify-between border-b border-[#E2E8F0] px-4 py-3">
          <h2 id="camera-capture-title" className="font-heading text-base font-semibold text-primary">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-[#64748B] hover:bg-[#F1F5F9]"
            aria-label="Close camera"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="relative aspect-[4/3] bg-black">
          {isStarting && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-10 w-10 animate-spin text-white" />
            </div>
          )}
          {error ? (
            <div className="flex h-full items-center justify-center p-6 text-center text-sm text-white/90">
              {error}
            </div>
          ) : (
            <video
              ref={videoRef}
              className={cn("h-full w-full object-cover", facingMode === "user" && "scale-x-[-1]")}
              playsInline
              muted
              autoPlay
            />
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E2E8F0] px-4 py-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() =>
              setFacingMode((current) => (current === "user" ? "environment" : "user"))
            }
            disabled={!!error || isStarting}
          >
            <FlipHorizontal className="h-4 w-4" />
            Flip Camera
          </Button>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleCapture}
              disabled={!!error || isStarting}
              className="gap-2"
            >
              <Camera className="h-4 w-4" />
              Capture Photo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
