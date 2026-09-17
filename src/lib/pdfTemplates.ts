import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import fs from 'fs';
import path from 'path';

// ─── Colors ───────────────────────────────────────────────────
const C = {
  navy: rgb(0.118, 0.161, 0.235),
  gold: rgb(0.831, 0.686, 0.216),
  goldLight: rgb(0.996, 0.992, 0.937),
  cyan: rgb(0.024, 0.714, 0.831),
  cyanDark: rgb(0.012, 0.502, 0.588),
  white: rgb(1, 1, 1),
  slate50: rgb(0.972, 0.976, 0.988),
  slate100: rgb(0.945, 0.953, 0.969),
  slate200: rgb(0.878, 0.902, 0.929),
  slate400: rgb(0.569, 0.627, 0.706),
  slate500: rgb(0.392, 0.455, 0.545),
  slate600: rgb(0.271, 0.337, 0.416),
  slate700: rgb(0.204, 0.255, 0.333),
  slate900: rgb(0.059, 0.090, 0.153),
};

async function tryEmbedLogo(pdfDoc: PDFDocument) {
  try {
    const p = path.join(process.cwd(), 'public', 'logo.png');
    if (fs.existsSync(p)) return await pdfDoc.embedPng(fs.readFileSync(p));
  } catch (e) { console.error("Logo embedding failed:", e); }
  return null;
}

async function tryEmbedSignature(pdfDoc: PDFDocument) {
  try {
    const p = path.join(process.cwd(), 'public', 'signature.png');
    if (fs.existsSync(p)) return await pdfDoc.embedPng(fs.readFileSync(p));
  } catch (e) { console.error("Signature embedding failed:", e); }
  return null;
}

function wrapText(text: string, maxW: number, size: number, f: { widthOfTextAtSize: (t: string, s: number) => number }): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (f.widthOfTextAtSize(test, size) <= maxW) { line = test; }
    else { if (line) lines.push(line); line = word; }
  }
  if (line) lines.push(line);
  return lines;
}

// ════════════════════════════════════════════════════════════════
//  OFFER LETTER  (A4 portrait 595.28 × 841.89)
// ════════════════════════════════════════════════════════════════
interface OfferLetterProps { fullName: string; rollNumber: string; track: string; date: string; }

export const generateOfferLetterPDF = async ({ fullName, rollNumber, track, date }: OfferLetterProps): Promise<Buffer> => {
  const pdfDoc = await PDFDocument.create();
  const W = 595.28;
  const H = 841.89;
  const page = pdfDoc.addPage([W, H]);

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const obli = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  pdfDoc.registerFontkit(fontkit);
  const fontPath = path.join(process.cwd(), 'public', 'GreatVibes-Regular.ttf');
  let signatureFont;
  try {
    signatureFont = await pdfDoc.embedFont(fs.readFileSync(fontPath));
  } catch {
    signatureFont = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);
  }

  page.drawRectangle({ x: 0, y: 0, width: W, height: H, color: C.white });

  const marginX = 50;
  const usableW = W - (marginX * 2);

  let currentY = H - 50;

  // FIX: Dynamic Logo Sizing based on fixed height boundary
  const logoImg = await tryEmbedLogo(pdfDoc);
  if (logoImg) {
    const targetHeight = 55;
    const imgDims = logoImg.scale(1);
    const targetWidth = (imgDims.width / imgDims.height) * targetHeight;
    page.drawImage(logoImg, { x: marginX, y: currentY - targetHeight, width: targetWidth, height: targetHeight });
  }

  const rightTextX = W - marginX;
  page.drawText('SAMSTACK TECH', { x: rightTextX - bold.widthOfTextAtSize('SAMSTACK TECH', 18), y: currentY - 14, size: 18, font: bold, color: C.navy });
  page.drawText('Software Engineering Systems', { x: rightTextX - font.widthOfTextAtSize('Software Engineering Systems', 9), y: currentY - 28, size: 9, font, color: C.slate500 });
  page.drawText('samstacktechs@gmail.com | samstack-tech.vercel.app', { x: rightTextX - font.widthOfTextAtSize('samstacktechs@gmail.com | samstack-tech.vercel.app', 8), y: currentY - 42, size: 8, font, color: C.slate400 });
  page.drawText('Lahore, Pakistan', { x: rightTextX - font.widthOfTextAtSize('Lahore, Pakistan', 8), y: currentY - 54, size: 8, font, color: C.slate400 });

  currentY -= 75;

  page.drawLine({ start: { x: marginX, y: currentY }, end: { x: W - marginX, y: currentY }, color: C.slate200, thickness: 1 });
  page.drawRectangle({ x: marginX, y: currentY, width: 60, height: 2, color: C.gold });

  currentY -= 40;

  page.drawText('INTERNSHIP OFFER LETTER', { x: marginX, y: currentY, size: 14, font: bold, color: C.navy });
  page.drawText(`Date: ${date}`, { x: rightTextX - font.widthOfTextAtSize(`Date: ${date}`, 9), y: currentY, size: 9, font, color: C.slate600 });

  currentY -= 15;
  page.drawText(`Ref: ${rollNumber}`, { x: rightTextX - font.widthOfTextAtSize(`Ref: ${rollNumber}`, 9), y: currentY, size: 9, font, color: C.slate600 });

  currentY -= 40;

  page.drawText(`Dear ${fullName},`, { x: marginX, y: currentY, size: 12, font: bold, color: C.slate900 });
  currentY -= 25;

  const drawPara = (text: string, yPos: number, size = 10, lineH = 16): number => {
    const lines = wrapText(text, usableW, size, font);
    lines.forEach((l, i) => page.drawText(l, { x: marginX, y: yPos - (i * lineH), size, font, color: C.slate700 }));
    return yPos - (lines.length * lineH);
  };

  const p1 = 'We are absolutely thrilled to formally offer you an internship position at SAMStack Tech. After carefully reviewing your application and evaluating your technical aptitude, we were deeply impressed by your enthusiasm and dedication. We firmly believe you will be a remarkable addition to our engineering team.';
  currentY = drawPara(p1, currentY) - 15;

  const p2 = 'You have been selected for the following specialization track. This programme provides intensive hands-on experience, mentorship from senior engineers, and an opportunity to architect and build real-world systems.';
  currentY = drawPara(p2, currentY) - 25;

  const boxHeight = 75;
  currentY -= boxHeight;

  page.drawRectangle({ x: marginX, y: currentY, width: usableW, height: boxHeight, color: C.slate50, borderColor: C.slate200, borderWidth: 1 });
  page.drawRectangle({ x: marginX, y: currentY, width: 4, height: boxHeight, color: C.gold });

  page.drawText('SPECIALIZATION TRACK', { x: marginX + 20, y: currentY + 50, size: 8, font: bold, color: C.slate500 });
  page.drawText(track, { x: marginX + 20, y: currentY + 34, size: 12, font: bold, color: C.navy });

  page.drawText('CANDIDATE ROLL NUMBER', { x: marginX + 300, y: currentY + 50, size: 8, font: bold, color: C.slate500 });
  page.drawText(rollNumber, { x: marginX + 300, y: currentY + 34, size: 12, font: bold, color: C.navy });

  currentY -= 25;

  const p3 = 'Please keep this roll number safe — it is required for all future correspondence, task submissions, and certificate issuance at the conclusion of the programme.';
  currentY = drawPara(p3, currentY) - 15;

  const p4 = 'During your internship, you will complete assigned engineering tasks, participate in rigorous code reviews, and engage directly with your assigned mentor. We are confident this experience will serve as a significant milestone in your professional journey.';
  currentY = drawPara(p4, currentY) - 25;

  page.drawText('Congratulations once again, and a very warm welcome to Team SAMStack!', { x: marginX, y: currentY, size: 11, font: obli, color: C.navy });

  // FIX: Signature layout & spacing
  const sigY = 160;
  const sigImg = await tryEmbedSignature(pdfDoc);
  if (sigImg) {
    const targetHeight = 45;
    const imgDims = sigImg.scale(1);
    const targetWidth = (imgDims.width / imgDims.height) * targetHeight;
    // Adjusted Y coordinate so the ink sits beautifully just barely above the line
    page.drawImage(sigImg, { x: marginX, y: sigY - 8, width: targetWidth, height: targetHeight });
  } else {
    // Escaped the line overlap entirely
    page.drawText('Suleman', { x: marginX, y: sigY + 15, size: 36, font: signatureFont, color: C.navy });
  }

  // Divider Line at strict anchor
  page.drawLine({ start: { x: marginX, y: sigY }, end: { x: marginX + 180, y: sigY }, color: C.slate400, thickness: 1 });

  // Details shifted strictly below the line
  page.drawText('Suleman Zaheer', { x: marginX, y: sigY - 18, size: 11, font: bold, color: C.slate900 });
  page.drawText('Founder & Lead Engineer', { x: marginX, y: sigY - 32, size: 9, font, color: C.slate500 });
  page.drawText('SAMStack Tech', { x: marginX, y: sigY - 44, size: 9, font: bold, color: C.navy });

  // FIX: Professional Solid Seal
  const sealX = W - marginX - 45;
  const sealY = sigY + 15;

  page.drawCircle({ x: sealX, y: sealY, size: 36, color: C.navy }); // Solid background
  page.drawCircle({ x: sealX, y: sealY, size: 32, borderColor: C.gold, borderWidth: 1.5 }); // Accent ring
  page.drawCircle({ x: sealX, y: sealY, size: 28, color: C.slate900 }); // Inner core

  page.drawText('SAM', { x: sealX - bold.widthOfTextAtSize('SAM', 8) / 2, y: sealY + 6, size: 8, font: bold, color: C.white });
  page.drawText('STACK', { x: sealX - bold.widthOfTextAtSize('STACK', 7) / 2, y: sealY - 4, size: 7, font: bold, color: C.gold });
  page.drawText('2026', { x: sealX - bold.widthOfTextAtSize('2026', 6) / 2, y: sealY - 14, size: 6, font: bold, color: C.slate400 });

  const footY = 40;
  page.drawLine({ start: { x: marginX, y: footY + 15 }, end: { x: W - marginX, y: footY + 15 }, color: C.slate200, thickness: 1 });
  page.drawText('This is a highly confidential and officially auto-generated document issued by SAMStack Tech.', { x: marginX, y: footY, size: 8, font, color: C.slate400 });
  page.drawText('samstack-tech.vercel.app', { x: rightTextX - font.widthOfTextAtSize('samstack-tech.vercel.app', 8), y: footY, size: 8, font, color: C.slate400 });

  return Buffer.from(await pdfDoc.save());
};

// ════════════════════════════════════════════════════════════════
//  CERTIFICATE  (A4 landscape 841.89 × 595.28)
// ════════════════════════════════════════════════════════════════
interface CertificateProps { fullName: string; certificateNumber: string; track: string; date: string; }

export const generateCertificatePDF = async ({ fullName, certificateNumber, track, date }: CertificateProps): Promise<Buffer> => {
  const pdfDoc = await PDFDocument.create();
  const W = 841.89, H = 595.28;
  const page = pdfDoc.addPage([W, H]);

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const obli = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  pdfDoc.registerFontkit(fontkit);
  const fontPath = path.join(process.cwd(), 'public', 'GreatVibes-Regular.ttf');
  let signatureFont;
  try {
    signatureFont = await pdfDoc.embedFont(fs.readFileSync(fontPath));
  } catch {
    signatureFont = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);
  }

  const CX = W / 2;

  const colorBg = rgb(0.984, 0.988, 0.996);
  const colorNavy = rgb(0.06, 0.16, 0.28);
  const colorBlue = rgb(0.12, 0.35, 0.58);
  const colorBlack = rgb(0.1, 0.1, 0.1);
  const colorGray = rgb(0.4, 0.45, 0.5);

  page.drawRectangle({ x: 0, y: 0, width: W, height: H, color: colorBg });
  page.drawRectangle({ x: 30, y: 30, width: W - 60, height: H - 60, borderColor: colorNavy, borderWidth: 6 });
  page.drawRectangle({ x: 38, y: 38, width: W - 76, height: H - 76, borderColor: colorNavy, borderWidth: 1 });

  // FIX: Dynamic Logo Sizing on Certificate
  const logoImg = await tryEmbedLogo(pdfDoc);
  if (logoImg) {
    const wmHeight = 250;
    const wmDims = logoImg.scale(1);
    const wmWidth = (wmDims.width / wmDims.height) * wmHeight;
    page.drawImage(logoImg, { x: CX - wmWidth / 2, y: (H - wmHeight) / 2, width: wmWidth, height: wmHeight, opacity: 0.04 });

    const headerHeight = 60;
    const headerWidth = (wmDims.width / wmDims.height) * headerHeight;
    page.drawImage(logoImg, { x: CX - headerWidth / 2, y: 465, width: headerWidth, height: headerHeight });
  }

  const cname = 'SAMStack Tech';
  page.drawText(cname, { x: CX - bold.widthOfTextAtSize(cname, 16) / 2, y: 445, size: 16, font: bold, color: colorBlack });
  const ctag = 'SOFTWARE SYSTEMS STUDIO';
  page.drawText(ctag, { x: CX - font.widthOfTextAtSize(ctag, 7) / 2, y: 432, size: 7, font, color: colorGray });

  const title = 'CERTIFICATE OF COMPLETION';
  page.drawText(title, { x: CX - bold.widthOfTextAtSize(title, 26) / 2, y: 380, size: 26, font: bold, color: colorNavy });

  const subtitle = 'This certificate is proudly presented to';
  page.drawText(subtitle, { x: CX - obli.widthOfTextAtSize(subtitle, 14) / 2, y: 335, size: 14, font: obli, color: colorGray });

  const maxNameW = W - 200;
  let nameSize = 46;
  let nameW = bold.widthOfTextAtSize(fullName, nameSize);
  if (nameW > maxNameW) {
    nameSize = Math.floor(nameSize * (maxNameW / nameW));
    nameW = bold.widthOfTextAtSize(fullName, nameSize);
  }
  page.drawText(fullName, { x: CX - nameW / 2, y: 275, size: nameSize, font: bold, color: colorBlack });

  const ulW = Math.max(nameW + 60, 400);
  page.drawRectangle({ x: CX - ulW / 2, y: 258, width: ulW, height: 2, color: colorBlue });

  const body1 = 'for successfully completing the rigorous architectural and engineering requirements of the';
  page.drawText(body1, { x: CX - font.widthOfTextAtSize(body1, 12) / 2, y: 220, size: 12, font, color: colorGray });

  const tW = bold.widthOfTextAtSize(track, 22);
  page.drawText(track, { x: CX - tW / 2, y: 180, size: 22, font: bold, color: colorBlue });

  const FC = 90;
  const LX = 80;
  page.drawText('DATE ISSUED', { x: LX, y: FC + 35, size: 8, font: bold, color: colorGray });
  page.drawText(date, { x: LX, y: FC + 18, size: 12, font: bold, color: colorBlack });
  page.drawLine({ start: { x: LX, y: FC + 8 }, end: { x: LX + 160, y: FC + 8 }, color: colorGray, thickness: 0.5 });

  page.drawText('CREDENTIAL ID', { x: LX, y: FC - 6, size: 8, font: bold, color: colorGray });
  const displayId = certificateNumber.length > 22 ? certificateNumber.substring(0, 20) + '...' : certificateNumber;
  page.drawText(displayId, { x: LX, y: FC - 20, size: 10, font: bold, color: colorBlack });
  page.drawText('Verify at: samstack-tech.vercel.app/verify', { x: LX, y: FC - 35, size: 8, font, color: colorBlue });

  // FIX: Premium Certificate Seal Base
  const SR = 48;
  const sealCY = FC + 15;
  page.drawCircle({ x: CX, y: sealCY, size: SR, color: colorNavy });
  page.drawCircle({ x: CX, y: sealCY, size: SR - 4, borderColor: rgb(0.83, 0.69, 0.22), borderWidth: 2 });
  page.drawCircle({ x: CX, y: sealCY, size: SR - 8, color: rgb(0.04, 0.12, 0.20) });

  const sealText1 = 'OFFICIAL';
  const sealText2 = 'CERTIFIED';
  page.drawText(sealText1, { x: CX - bold.widthOfTextAtSize(sealText1, 10) / 2, y: sealCY + 4, size: 10, font: bold, color: rgb(1, 1, 1) });
  page.drawText(sealText2, { x: CX - bold.widthOfTextAtSize(sealText2, 9) / 2, y: sealCY - 10, size: 9, font: bold, color: rgb(0.83, 0.69, 0.22) });

  // FIX: Certificate Signature Layout
  const RX_END = W - 80;
  const SIG_LINE_WIDTH = 180;
  const RX_START = RX_END - SIG_LINE_WIDTH;
  const RX_CENTER = RX_START + (SIG_LINE_WIDTH / 2);

  const sigImg = await tryEmbedSignature(pdfDoc);
  if (sigImg) {
    const targetHeight = 55;
    const imgDims = sigImg.scale(1);
    const targetWidth = (imgDims.width / imgDims.height) * targetHeight;
    // Adjusted Y coordinate so the ink sits beautifully just barely above the line
    page.drawImage(sigImg, { x: RX_CENTER - (targetWidth / 2), y: FC - 10, width: targetWidth, height: targetHeight });
  } else {
    const sigText = 'Suleman';
    const sigSize = 46;
    const sigW = signatureFont.widthOfTextAtSize(sigText, sigSize);
    page.drawText(sigText, { x: RX_CENTER - (sigW / 2), y: FC + 18, size: sigSize, font: signatureFont, color: colorNavy });
  }

  // True anchor point
  page.drawLine({ start: { x: RX_START, y: FC }, end: { x: RX_END, y: FC }, color: colorGray, thickness: 1 });

  const printName = 'Suleman Zaheer';
  const nameW2 = bold.widthOfTextAtSize(printName, 12);
  page.drawText(printName, { x: RX_CENTER - (nameW2 / 2), y: FC - 18, size: 12, font: bold, color: colorBlack });

  const printTitle = 'Founder & Lead Engineer';
  const titleW = font.widthOfTextAtSize(printTitle, 9);
  page.drawText(printTitle, { x: RX_CENTER - (titleW / 2), y: FC - 32, size: 9, font, color: colorGray });

  const printOrg = 'SAMStack Tech';
  const orgW = bold.widthOfTextAtSize(printOrg, 9);
  page.drawText(printOrg, { x: RX_CENTER - (orgW / 2), y: FC - 45, size: 9, font: bold, color: colorBlue });

  return Buffer.from(await pdfDoc.save());
}