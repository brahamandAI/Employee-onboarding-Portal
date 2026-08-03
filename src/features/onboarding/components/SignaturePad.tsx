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
  const [hasStroke, setHasStroke] = useState(Boolean(value));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function paint() {
      const el = canvasRef.current;
      const context = el?.getContext("2d");
      if (!el || !context) return;
      const ratio = window.devicePixelRatio || 1;
      const width = Math.max(el.clientWidth || 320, 1);
      const height = Math.max(el.clientHeight || 176, 1);
      el.width = width * ratio;
      el.height = height * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.lineWidth = 2;
      context.lineCap = "round";
      context.strokeStyle = "#0F172A";
      context.fillStyle = "#FFFFFF";
      context.fillRect(0, 0, width, height);

      if (value) {
        const img = new Image();
        img.onload = () => {
          context.drawImage(img, 0, 0, width, height);
          setHasStroke(true);
        };
        img.onerror = () => undefined;
        img.src = value;
      }
    }

    paint();
    const observer = typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(() => paint())
      : null;
    observer?.observe(canvas);
    return () => observer?.disconnect();
  }, [value]);

  function getPoint(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function startDraw(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    drawing.current = true;
    canvas.setPointerCapture(e.pointerId);
    const point = getPoint(e);
    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
  }

  function draw(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const point = getPoint(e);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    setHasStroke(true);
  }

  function endDraw() {
    if (!drawing.current) return;
    drawing.current = false;
    const canvas = canvasRef.current;
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
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <Label required>Live Signature</Label>
        <Button type="button" variant="ghost" size="sm" onClick={clearPad}>
          Clear
        </Button>
      </div>
      <canvas
        ref={canvasRef}
        className="h-44 w-full touch-none rounded-xl border border-[#E2E8F0] bg-white shadow-inner"
        onPointerDown={startDraw}
        onPointerMove={draw}
        onPointerUp={endDraw}
        onPointerLeave={endDraw}
      />
      <p className="text-xs text-[#64748B]">
        Sign using mouse or touch. {hasStroke ? "Signature captured." : "Signature is required."}
      </p>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
