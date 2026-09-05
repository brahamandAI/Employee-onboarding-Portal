"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface SignaturePadProps {
  value?: string;
  onChange: (dataUrl: string) => void;
  error?: string;
}

export function SignaturePad({ value, onChange, error }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawing = useRef(false);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);
  const sized = useRef(false);
  const [hasStroke, setHasStroke] = useState(Boolean(value?.startsWith("data:image/")));

  function sizeCanvas(preserve: boolean) {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const ratio = window.devicePixelRatio || 1;
    const width = Math.max(canvas.clientWidth || 320, 1);
    const height = Math.max(canvas.clientHeight || 160, 1);
    const nextW = Math.floor(width * ratio);
    const nextH = Math.floor(height * ratio);

    if (canvas.width === nextW && canvas.height === nextH) {
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = "#0F172A";
      return;
    }

    const snapshot = preserve ? canvas.toDataURL("image/png") : "";
    canvas.width = nextW;
    canvas.height = nextH;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#0F172A";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, width, height);

    if (preserve && snapshot.startsWith("data:image/")) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0, width, height);
      img.src = snapshot;
    }
    sized.current = true;
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    sizeCanvas(false);
    if (value?.startsWith("data:image/")) {
      const ctx = canvas.getContext("2d");
      const width = Math.max(canvas.clientWidth || 320, 1);
      const height = Math.max(canvas.clientHeight || 160, 1);
      const img = new Image();
      img.onload = () => {
        ctx?.drawImage(img, 0, 0, width, height);
        setHasStroke(true);
      };
      img.src = value;
    }

    const observer =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => {
            if (drawing.current) return;
            sizeCanvas(true);
          })
        : null;
    observer?.observe(canvas);
    return () => observer?.disconnect();
    // Size on mount only. Do not reset the pad when the signature value updates.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (drawing.current) return;
    if (!value) {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      setHasStroke(false);
    }
  }, [value]);

  function getPoint(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function startDraw(e: React.PointerEvent<HTMLCanvasElement>) {
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    drawing.current = true;
    canvas.setPointerCapture(e.pointerId);
    const point = getPoint(e);
    lastPoint.current = point;
    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
    ctx.lineTo(point.x + 0.1, point.y + 0.1);
    ctx.stroke();
    setHasStroke(true);
  }

  function draw(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return;
    e.preventDefault();
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const point = getPoint(e);
    const prev = lastPoint.current ?? point;
    ctx.beginPath();
    ctx.moveTo(prev.x, prev.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    lastPoint.current = point;
  }

  function endDraw(e?: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return;
    drawing.current = false;
    lastPoint.current = null;
    const canvas = canvasRef.current;
    if (canvas && e) {
      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch {
        // already released
      }
    }
    if (!canvas) return;
    onChange(canvas.toDataURL("image/png"));
  }

  function clearPad() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    setHasStroke(false);
    onChange("");
  }

  return (
    <div className="relative z-10 space-y-2">
      <div className="flex items-center justify-between gap-2">
        <Label required>Live Signature</Label>
        <Button type="button" variant="ghost" size="sm" onClick={clearPad}>
          Clear
        </Button>
      </div>
      <canvas
        ref={canvasRef}
        className="relative z-10 block h-40 max-h-40 w-full cursor-crosshair touch-none rounded-xl border border-[#E2E8F0] bg-white shadow-inner"
        style={{ touchAction: "none", height: "160px" }}
        onPointerDown={startDraw}
        onPointerMove={draw}
        onPointerUp={endDraw}
        onPointerCancel={endDraw}
      />
      <p className="text-xs text-[#64748B]">
        Sign using mouse or touch. {hasStroke ? "Signature captured." : "Signature is required."}
      </p>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
