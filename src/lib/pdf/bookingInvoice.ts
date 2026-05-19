import jsPDF from "jspdf";
import gosendeetLogo from "@/assets/images/logo-green.png";

type GenericRecord = Record<string, unknown>;

type BookingInvoiceParams = {
  booking: GenericRecord;
  details?: GenericRecord;
};

const AMOUNT_FORMATTER = new Intl.NumberFormat("en-NG", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const PREFER_MANUAL_NAIRA = false;
const NAIRA_VALUE_GAP = 4;

let cachedLogoDataUrl: string | null = null;

const firstValue = (...values: unknown[]) => {
  for (const value of values) {
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      return value;
    }
  }
  return "";
};

const displayText = (value: unknown) => {
  if (value === undefined || value === null || String(value).trim() === "") {
    return "N/A";
  }
  return String(value);
};

const formatAmount = (value: unknown) => {
  if (value === undefined || value === null || value === "") return "N/A";
  const amount = Number(value);
  if (!Number.isFinite(amount)) return displayText(value);
  return AMOUNT_FORMATTER.format(amount);
};

const drawNairaSymbol = (doc: jsPDF, x: number, y: number) => {
  const top = y - 7.8;
  const bottom = y + 1.8;
  const right = x + 6.4;

  doc.setDrawColor(25, 33, 46);
  doc.setLineWidth(1.0);
  doc.line(x, top, x, bottom);
  doc.line(right, top, right, bottom);
  doc.line(x, top, right, bottom);
  doc.line(x - 0.35, y - 4.0, right + 0.35, y - 4.0);
  doc.line(x - 0.35, y - 1.35, right + 0.35, y - 1.35);
};

const formatDate = (value: unknown) => {
  if (!value) return "N/A";
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return displayText(value);
  return date.toLocaleString("en-NG", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const fileSafe = (value: unknown) =>
  String(value || "booking")
    .replace(/[^a-zA-Z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();

const getLogoDataUrl = async () => {
  if (cachedLogoDataUrl) return cachedLogoDataUrl;
  try {
    const response = await fetch(gosendeetLogo);
    const blob = await response.blob();
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(String(reader.result || ""));
      reader.onerror = () => reject(new Error("Unable to process logo"));
      reader.readAsDataURL(blob);
    });
    cachedLogoDataUrl = dataUrl;
    return dataUrl;
  } catch {
    return "";
  }
};

const addMetaRow = (
  doc: jsPDF,
  label: string,
  value: string,
  x: number,
  y: number,
  valueX = 175,
  options?: {
    maxWidth?: number;
    maxLines?: number;
  }
) => {
  const maxWidth = options?.maxWidth ?? 340;
  const maxLines = options?.maxLines ?? 1;
  const lineHeight = 14;

  const splitLines = doc.splitTextToSize(value, maxWidth) as string[];
  const lines = splitLines.slice(0, maxLines);
  if (splitLines.length > maxLines && lines.length > 0) {
    const lastIndex = lines.length - 1;
    let lastLine = lines[lastIndex];
    while (doc.getTextWidth(`${lastLine}...`) > maxWidth && lastLine.length > 0) {
      lastLine = lastLine.slice(0, -1);
    }
    lines[lastIndex] = `${lastLine}...`;
  }

  doc.setFont("helvetica", "bold");
  doc.setTextColor(69, 79, 95);
  doc.text(`${label}:`, x, y);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(25, 33, 46);
  doc.text(lines, valueX, y);

  return y + Math.max(18, lines.length * lineHeight);
};

const addSectionTitle = (doc: jsPDF, title: string, y: number, margin: number, width: number) => {
  doc.setFillColor(240, 247, 242);
  doc.roundedRect(margin, y - 13, width, 24, 4, 4, "F");
  doc.setFont("helvetica", "bold");
  doc.setTextColor(25, 33, 46);
  doc.text(title, margin + 10, y + 3);
  return y + 24;
};

export const downloadBookingInvoicePdf = async ({
  booking,
  details,
}: BookingInvoiceParams) => {
  const doc = new jsPDF({
    unit: "pt",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;
  let y = 52;

  const logoDataUrl = await getLogoDataUrl();
  if (logoDataUrl) {
    doc.addImage(logoDataUrl, "PNG", margin, y - 22, 130, 34);
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(25, 33, 46);
  doc.text("BOOKING INVOICE", pageWidth - margin, y, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(96, 105, 123);
  doc.text(`Generated: ${formatDate(new Date().toISOString())}`, pageWidth - margin, y + 16, {
    align: "right",
  });

  y += 30;
  doc.setDrawColor(224, 229, 236);
  doc.line(margin, y, pageWidth - margin, y);
  y += 22;

  const cost = (details?.cost as GenericRecord | undefined) || (booking?.cost as GenericRecord | undefined) || {};
  const senderName = displayText(firstValue(booking?.senderName, details?.senderName));
  const receiverName = displayText(firstValue(booking?.receiverName, details?.receiverName));
  const pickupLocation = displayText(firstValue(details?.pickupLocation, booking?.pickupLocation));
  const destination = displayText(firstValue(details?.destination, booking?.destination));
  const trackingNumber = displayText(firstValue(booking?.trackingNumber, details?.trackingNumber));
  const bookingDate = formatDate(firstValue(booking?.bookingDate, details?.bookingDate));
  const status = displayText(firstValue(booking?.status, details?.status));
  const companyName = displayText(firstValue(booking?.companyName, details?.companyName));
  const packageType = displayText(firstValue(booking?.packageType, details?.packageType));
  const weight = displayText(
    `${displayText(firstValue(booking?.weight, details?.weight))} ${displayText(
      firstValue(booking?.weightUnit, details?.weightUnit)
    )}`.trim()
  );
  const dimensions = displayText(
    `${displayText(firstValue(booking?.length, details?.length))} x ${displayText(
      firstValue(booking?.width, details?.width)
    )} x ${displayText(firstValue(booking?.height, details?.height))} ${displayText(
      firstValue(booking?.dimensionsUnit, details?.dimensionsUnit)
    )}`.trim()
  );

  y = addSectionTitle(doc, "Invoice Details", y, margin, contentWidth);
  y = addMetaRow(doc, "Tracking Number", trackingNumber, margin + 10, y);
  y = addMetaRow(doc, "Booking Date", bookingDate, margin + 10, y);
  y = addMetaRow(doc, "Status", status, margin + 10, y);
  y = addMetaRow(doc, "Courier", companyName, margin + 10, y);

  y += 6;
  y = addSectionTitle(doc, "Sender & Receiver", y, margin, contentWidth);
  y = addMetaRow(doc, "Sender", senderName, margin + 10, y);
  y = addMetaRow(doc, "Pickup Address", pickupLocation, margin + 10, y, 175, {
    maxWidth: 330,
    maxLines: 2,
  });
  y = addMetaRow(doc, "Receiver", receiverName, margin + 10, y);
  y = addMetaRow(doc, "Destination", destination, margin + 10, y, 175, {
    maxWidth: 330,
    maxLines: 2,
  });

  y += 6;
  y = addSectionTitle(doc, "Parcel Information", y, margin, contentWidth);
  y = addMetaRow(doc, "Category", packageType, margin + 10, y);
  y = addMetaRow(doc, "Weight", weight, margin + 10, y);
  y = addMetaRow(doc, "Dimensions", dimensions, margin + 10, y);

  y += 6;
  y = addSectionTitle(doc, "Cost Breakdown", y, margin, contentWidth);

  const tableX = margin + 10;
  const tableW = contentWidth - 20;
  const rowH = 26;
  const tableY = y - 12;
  const tablePaddingX = 10;
  const leftColX = tableX + 10;
  const rightColX = tableX + tableW - (tablePaddingX + 60);

  doc.setDrawColor(223, 229, 236);
  doc.roundedRect(tableX, tableY, tableW, rowH * 4, 4, 4);

  const rows: Array<[string, string]> = [
    ["Subtotal", formatAmount(cost?.subTotal)],
    // ["Shipping Fee", formatAmount(cost?.shippingFee)],
    ["Tax", formatAmount(cost?.tax ?? 0)],
    ["Total", formatAmount(cost?.total)],
  ];

  for (let index = 0; index < rows.length; index += 1) {
    const [label, value] = rows[index];
    const rowTop = tableY + index * rowH;
    const rowCenterY = rowTop + rowH / 2 + 4;

    if (index > 0) {
      doc.line(tableX, rowTop, tableX + tableW, rowTop);
    }

    doc.setFont("helvetica", index === rows.length - 1 ? "bold" : "normal");
    doc.setFontSize(10);
    doc.setTextColor(index === rows.length - 1 ? 25 : 69, index === rows.length - 1 ? 33 : 79, index === rows.length - 1 ? 46 : 95);
    doc.text(label, leftColX, rowCenterY);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(25, 33, 46);
    doc.text(value, rightColX, rowCenterY, { align: "right" });

    if (value !== "N/A") {
      const numericWidth = doc.getTextWidth(value);
      const symbolX = rightColX - numericWidth - NAIRA_VALUE_GAP;
      if (PREFER_MANUAL_NAIRA) {
        doc.text("₦", symbolX, rowCenterY, { align: "right" });
      } else {
        // Fallback mode: drawn symbol if manual glyph support is inconsistent.
        drawNairaSymbol(doc, symbolX - 6.4, rowCenterY);
      }
    }
  }

  y = tableY + rowH * rows.length + 18;

  doc.setFont("helvetica", "italic");
  doc.setFontSize(10);
  doc.setTextColor(96, 105, 123);
  doc.text("Thank you for choosing GoSendeet.", margin, y + 4);

  const fileName = `gosendeet-invoice-${fileSafe(firstValue(booking?.trackingNumber, booking?.id))}.pdf`;
  doc.save(fileName);
};
