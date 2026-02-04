import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const InvoicePrint = (
  selectedClient,
  nrFatures,
  invoiceDate,
  komenti,
  ingredients,
  kompania,
  totaliKubikazhes = 1,
  pdfSavePath,
  recepturaValue = "1"
) => {
  const fileName = `${nrFatures}.pdf`;
  const currentYear = new Date().getFullYear();

  const handlePrint = async () => {
    const doc = new jsPDF({
      orientation: "l", // ✅ LANDSCAPE
      unit: "mm",
      format: "a5",
    });

    const pageWidth = doc.internal.pageSize.width;   // ~210
    const pageHeight = doc.internal.pageSize.height; // ~148
    const margin = 10;

    /* ================= HEADER ================= */

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(kompania?.emri || "", margin, 14);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(kompania?.adresa || "", margin, 20);
    doc.text(`Tel: ${kompania?.telefoni || ""}`, margin, 25);
    kompania?.nrBiznesit && doc.text(`Nr Biznesit: ${kompania.nrBiznesit}`, margin, 30);
    kompania?.NrFiskal && doc.text(`Nr Fiskal: ${kompania.NrFiskal}`, margin, 35);
    kompania?.nrTvsh && doc.text(`Nr TVSH: ${kompania.nrTvsh}`, margin, 40);

    /* ============ CLIENT BOX ============ */

    const clientBoxWidth = 78;
    const clientBoxX = pageWidth - margin - clientBoxWidth;

    doc.setDrawColor(200);
    doc.setFillColor(245);
    doc.rect(clientBoxX, 10, clientBoxWidth, 30, "FD");

    doc.setFont("helvetica", "bold");
    doc.text(`Klienti: ${selectedClient?.emri || ""}`, clientBoxX + 3, 15);

    doc.setFont("helvetica", "normal");
    doc.text(selectedClient?.adresa || "", clientBoxX + 3, 20);
    doc.text(`Kontakti: ${selectedClient?.nrTelefonit || ""}`, clientBoxX + 3, 25);
    selectedClient?.nrBiznesit && doc.text(`Nr Biznesit: ${selectedClient.nrBiznesit}`, clientBoxX + 3, 30);
    selectedClient?.nrFiskal && doc.text(`Nr Fiskal: ${selectedClient.nrFiskal}`, clientBoxX + 3, 35);

    /* ============ DIVIDERS ============ */

    doc.line(margin, 45, pageWidth - margin, 45);
    doc.line(margin, 55, pageWidth - margin, 55);

    /* ============ INVOICE INFO ============ */

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);

    doc.text(`Data: ${invoiceDate}`, margin, 51);
    doc.text(`Receptura: ${recepturaValue}`, pageWidth / 2, 51, { align: "center" });
    doc.text(`Nr i Fletedergeses: ${nrFatures}`, pageWidth - margin, 51, { align: "right" });

    /* ============ TABLE ============ */

    const tableBody = (Array.isArray(ingredients) ? ingredients : []).map((ing, i) => ({
      nr: String(i + 1).padStart(2, "0"),
      material: `${ing.emertimi}${ing.pershkrimi ? ` ${ing.pershkrimi}` : ""}`,
      sasia_baze: `${ing.sasia} ${ing.njesia}`,
      totali_final:
        (Number(ing.sasia) * Number(totaliKubikazhes || 1)).toFixed(2) +
        ` ${ing.njesia}`,
    }));

    autoTable(doc, {
      startY: 58,
      margin: { left: margin, right: margin },
      head: [["#", "Përbërësi / Materiali", "Sasia Bazë", "Totali Final"]],
      body: tableBody.map(r => [r.nr, r.material, r.sasia_baze, r.totali_final]),
      theme: "grid",
      styles: {
        fontSize: 8,
        cellPadding: 1.5,
        font: "helvetica",
      
      },
      headStyles: {
        fillColor: [245, 245, 245],
        textColor: 20,
        fontStyle: "bold",
      },
      columnStyles: {
        0: { halign: "center", cellWidth: 12 },
        1: { halign: "left" },
        2: { halign: "center", cellWidth: 32 },
        3: { halign: "right", cellWidth: 36 },
      },
    });

    /* ============ TOTAL ============ */

    const finalY = doc.lastAutoTable.finalY + 6;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(
      `Totali: ${totaliKubikazhes.toFixed(2)} m³`,
      pageWidth - margin,
      finalY,
      { align: "right" }
    );

    /* ============ COMMENT ============ */

    if (komenti && komenti.length > 1) {
      doc.setFontSize(8);
      doc.text("Koment:", margin, finalY + 6);
      doc.setFont("helvetica", "normal");
      doc.text(komenti, margin, finalY + 11);
    }

    /* ============ SIGNATURES ============ */

    const signatureY = pageHeight - 18;
    const sigWidth = 45;

    doc.setFontSize(8);
    doc.line(margin, signatureY, margin + sigWidth, signatureY);
    doc.text("Dorëzoi", margin, signatureY + 4);

    doc.line(pageWidth - margin - sigWidth, signatureY, pageWidth - margin, signatureY);
    doc.text("Pranoi", pageWidth - margin - sigWidth, signatureY + 4);

    /* ============ FOOTER ============ */

    doc.setFontSize(7);
    doc.text(
      `${kompania?.emri} © ${currentYear} | Tel: ${kompania?.telefoni} | Adresa: ${kompania?.adresa}`,
      pageWidth / 2,
      pageHeight - 6,
      { align: "center" }
    );

    /* ============ SAVE & OPEN ============ */

    const pdfBase64 = doc.output("datauristring").split(",")[1];
    await window.api.savePDF({ pdfBase64, folderPath: pdfSavePath, fileName });
    await window.api.openFile(`${pdfSavePath}\\${fileName}`);
  };

  handlePrint();
};
