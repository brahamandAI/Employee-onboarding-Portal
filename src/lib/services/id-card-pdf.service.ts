import fs from "fs/promises";
import path from "path";
import PDFDocument from "pdfkit";
import {
  A6_PAGE,
  ID_CARD_BACK_LAYOUT,
  ID_CARD_FRONT_LAYOUT,
  ID_CARD_HEIGHT_PT,
  ID_CARD_WIDTH_PT,
  ID_CARD_DESIGNATION_BAR,
  cardOriginOnA6,
  TEMPLATE_SCALE,
} from "@/lib/id-card/layout";
import {
  buildEmployeeQrPayload,
  generateQrCodeBuffer,
  serializeQrPayload,
} from "@/lib/services/qr-code.service";

export interface IdCardPdfData {
  fullName: string;
  employeeIdCode: string;
  designation?: string;
  department?: string;
  branch?: string;
  bloodGroup?: string;
  dateOfBirth?: string;
  address?: string;
  photoUrl?: string;
  issueDate?: Date;
  expiryDate?: Date;
  status?: string;
}

let frontTemplateCache: Buffer | null = null;
let backTemplateCache: Buffer | null = null;

async function loadTemplate(side: "front" | "back"): Promise<Buffer> {
  if (side === "front" && frontTemplateCache) return frontTemplateCache;
  if (side === "back" && backTemplateCache) return backTemplateCache;

  const file =
    side === "front" ? "id-card-template-front.png" : "id-card-template-back.png";
  const buffer = await fs.readFile(path.join(process.cwd(), "public/brand", file));

  if (side === "front") frontTemplateCache = buffer;
  else backTemplateCache = buffer;

  return buffer;
}

async function fetchImageBuffer(url: string): Promise<Buffer | null> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
    if (!res.ok) return null;
    return Buffer.from(await res.arrayBuffer());
  } catch {
    return null;
  }
}

function formatDate(value?: string | Date): string {
  if (!value) return "—";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function addYears(date: Date, years: number): Date {
  const next = new Date(date);
  next.setFullYear(next.getFullYear() + years);
  return next;
}

function drawCardPage(
  doc: PDFKit.PDFDocument,
  originX: number,
  originY: number,
  draw: (ox: number, oy: number) => void
) {
  doc.save();
  doc.translate(originX, originY);
  draw(0, 0);
  doc.restore();
}

export async function generateIdCardPdf(data: IdCardPdfData): Promise<Buffer> {
  const issueDate = data.issueDate ?? new Date();
  const expiryDate = data.expiryDate ?? addYears(issueDate, 2);

  const [frontTemplate, backTemplate, photoBuffer, qrBuffer] = await Promise.all([
    loadTemplate("front"),
    loadTemplate("back"),
    data.photoUrl ? fetchImageBuffer(data.photoUrl) : Promise.resolve(null),
    generateQrCodeBuffer(
      serializeQrPayload(
        buildEmployeeQrPayload({
          employeeIdCode: data.employeeIdCode,
          fullName: data.fullName,
          designation: data.designation,
          department: data.department,
          branch: data.branch,
          bloodGroup: data.bloodGroup,
          issueDate: issueDate.toISOString(),
          status: data.status ?? "ACTIVE",
        })
      ),
      280
    ),
  ]);

  const origin = cardOriginOnA6();

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: A6_PAGE,
      margin: 0,
      compress: false,
    });
    const chunks: Buffer[] = [];

    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    // —— Front ——
    drawCardPage(doc, origin.x, origin.y, (ox, oy) => {
      doc.image(frontTemplate, ox, oy, {
        width: ID_CARD_WIDTH_PT,
        height: ID_CARD_HEIGHT_PT,
      });

      const photo = ID_CARD_FRONT_LAYOUT.photo;
      if (photoBuffer) {
        doc.save();
        doc.roundedRect(ox + photo.x, oy + photo.y, photo.w, photo.h, photo.radius).clip();
        doc.image(photoBuffer, ox + photo.x, oy + photo.y, {
          width: photo.w,
          height: photo.h,
          fit: [photo.w, photo.h],
          align: "center",
          valign: "center",
        });
        doc.restore();
      } else {
        doc.save();
        doc.roundedRect(ox + photo.x, oy + photo.y, photo.w, photo.h, photo.radius)
          .fill("#E2E8F0");
        doc.fillColor("#64748B")
          .fontSize(7)
          .font("Helvetica")
          .text("Photo", ox + photo.x, oy + photo.y + photo.h / 2 - 4, {
            width: photo.w,
            align: "center",
          });
        doc.restore();
      }

      const nameCover = ID_CARD_FRONT_LAYOUT.nameCover;
      doc.rect(ox + nameCover.x, oy + nameCover.y, nameCover.w, nameCover.h).fill("#FFFFFF");

      doc.fillColor("#000000")
        .font("Helvetica-Bold")
        .fontSize(ID_CARD_FRONT_LAYOUT.name.fontSize)
        .text(data.fullName.toUpperCase(), ox, oy + ID_CARD_FRONT_LAYOUT.name.y, {
          width: ID_CARD_WIDTH_PT,
          align: "center",
        });

      const desCover = ID_CARD_FRONT_LAYOUT.designationCover;
      doc.roundedRect(
        ox + desCover.x,
        oy + desCover.y,
        desCover.w,
        desCover.h,
        4
      ).fill(ID_CARD_DESIGNATION_BAR);

      doc.fillColor("#FFFFFF")
        .font("Helvetica-Bold")
        .fontSize(ID_CARD_FRONT_LAYOUT.designation.fontSize)
        .text(
          (data.designation ?? "—").toUpperCase(),
          ox + desCover.x,
          oy + ID_CARD_FRONT_LAYOUT.designation.y,
          { width: desCover.w, align: "center" }
        );

      const writeValue = (
        layout: { x: number; y: number; w: number; fontSize: number },
        value: string
      ) => {
        doc.fillColor("#000000")
          .font("Helvetica-Bold")
          .fontSize(layout.fontSize)
          .text(value, ox + layout.x, oy + layout.y, { width: layout.w });
      };

      writeValue(ID_CARD_FRONT_LAYOUT.branch, data.branch ?? "—");
      writeValue(ID_CARD_FRONT_LAYOUT.empId, data.employeeIdCode);
      writeValue(ID_CARD_FRONT_LAYOUT.validUpto, formatDate(expiryDate));
      writeValue(ID_CARD_FRONT_LAYOUT.bloodGroup, data.bloodGroup ?? "—");
    });

    doc.addPage({ size: A6_PAGE, margin: 0 });

    // —— Back ——
    drawCardPage(doc, origin.x, origin.y, (ox, oy) => {
      doc.image(backTemplate, ox, oy, {
        width: ID_CARD_WIDTH_PT,
        height: ID_CARD_HEIGHT_PT,
      });

      doc.fillColor("#000000")
        .font("Helvetica-Bold")
        .fontSize(ID_CARD_BACK_LAYOUT.dob.fontSize)
        .text(
          formatDate(data.dateOfBirth),
          ox + ID_CARD_BACK_LAYOUT.dob.x,
          oy + ID_CARD_BACK_LAYOUT.dob.y,
          { width: ID_CARD_BACK_LAYOUT.dob.w }
        );

      doc.font("Helvetica")
        .fontSize(ID_CARD_BACK_LAYOUT.address.fontSize)
        .text(
          data.address ?? "—",
          ox + ID_CARD_BACK_LAYOUT.address.x,
          oy + ID_CARD_BACK_LAYOUT.address.y,
          {
            width: ID_CARD_BACK_LAYOUT.address.w,
            lineGap: 1,
          }
        );

      const qr = ID_CARD_BACK_LAYOUT.qr;
      const qrSize = Math.min(qr.w, qr.h - 12 * TEMPLATE_SCALE);
      const qrX = ox + qr.x + (qr.w - qrSize) / 2;
      const qrY = oy + qr.y + 2;
      doc.image(qrBuffer, qrX, qrY, { width: qrSize, height: qrSize });
    });

    doc.end();
  });
}
