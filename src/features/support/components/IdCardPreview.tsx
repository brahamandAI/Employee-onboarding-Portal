"use client";

import Image from "next/image";
import { IdCardPreviewData } from "@/lib/services/id-card.service";

interface IdCardPreviewProps {
  data: IdCardPreviewData;
}

function formatDate(iso?: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function IdCardPreview({ data }: IdCardPreviewProps) {
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <IdCardFace data={data} side="front" />
      <IdCardFace data={data} side="back" />
    </div>
  );
}

function IdCardFace({ data, side }: { data: IdCardPreviewData; side: "front" | "back" }) {
  const template =
    side === "front"
      ? "/brand/id-card-template-front.png"
      : "/brand/id-card-template-back.png";

  return (
    <div className="mx-auto w-full max-w-[280px]">
      <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wider text-[#64748B]">
        {side === "front" ? "Front" : "Back"}
      </p>
      <div className="relative aspect-[459/729] overflow-hidden rounded-xl shadow-lg ring-1 ring-black/10">
        <Image
          src={template}
          alt={`ID card ${side}`}
          fill
          className="object-cover"
          sizes="280px"
          priority
        />

        {side === "front" ? (
          <>
            <div
              className="absolute overflow-hidden rounded-[14px] border-2 border-[#001A57] bg-[#E2E8F0]"
              style={{
                left: "25.7%",
                top: "36.8%",
                width: "48.8%",
                height: "20.6%",
              }}
            >
              {data.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={data.photoUrl}
                  alt={data.fullName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-[10px] text-[#64748B]">
                  Photo
                </div>
              )}
            </div>

            <p
              className="absolute left-0 right-0 text-center font-bold uppercase text-black"
              style={{ top: "69.1%", fontSize: "clamp(9px, 3.2vw, 13px)" }}
            >
              {data.fullName}
            </p>

            <div
              className="absolute flex items-center justify-center rounded bg-[#001A57] px-2"
              style={{
                left: "20.7%",
                top: "71.1%",
                width: "58.8%",
                height: "4.4%",
              }}
            >
              <p
                className="truncate font-bold uppercase text-white"
                style={{ fontSize: "clamp(7px, 2.2vw, 10px)" }}
              >
                {data.designation ?? data.postAppliedFor ?? "—"}
              </p>
            </div>

            <CardValue style={{ top: "77.9%" }} value={data.branch ?? "—"} />
            <CardValue style={{ top: "81.2%" }} value={data.employeeIdCode} />
            <CardValue style={{ top: "84.5%" }} value={formatDate(data.expiryDate)} />
            <CardValue style={{ top: "87.8%" }} value={data.bloodGroup ?? "—"} />
          </>
        ) : (
          <>
            <CardValue
              back
              style={{ top: "6.6%" }}
              value={formatDate(data.dateOfBirth)}
            />
            <p
              className="absolute font-medium leading-tight text-black"
              style={{
                left: "20.7%",
                top: "12.1%",
                width: "69.7%",
                fontSize: "clamp(6px, 1.8vw, 9px)",
              }}
            >
              {data.address ?? "—"}
            </p>

            {data.qrCodeDataUrl && (
              <div
                className="absolute bg-white p-0.5"
                style={{
                  left: "12.2%",
                  top: "64.9%",
                  width: "29.2%",
                  height: "11.8%",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={data.qrCodeDataUrl}
                  alt="QR verification code"
                  className="h-full w-full object-contain"
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function CardValue({
  value,
  style,
  back,
}: {
  value: string;
  style: React.CSSProperties;
  back?: boolean;
}) {
  return (
    <p
      className="absolute truncate font-bold text-black"
      style={{
        left: back ? "20.7%" : "38.1%",
        width: back ? "69.7%" : "43.6%",
        fontSize: "clamp(7px, 2vw, 10px)",
        ...style,
      }}
    >
      {value}
    </p>
  );
}
