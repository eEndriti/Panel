import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const InvoicePrint = (selectedClient,nrFatures,invoiceDate,komenti,invoiceData) => {
   // company data,klient data,nr fatures,data fatures,komenti,produktet,totalet
   console.log('data qe e qojm',selectedClient,nrFatures,invoiceDate,komenti,invoiceData)
  const fileName = `${invoiceData?.nrFatures}.pdf`;
  const currentDate = getCurrentDateInAlbanian();
  const currentYear = new Date().getFullYear();

  const handlePrint = async (selectedClient,nrFatures,invoiceDate,komenti,invoiceData) => {
    console.log('klienti',selectedClient)
    const doc = new jsPDF({
      orientation: "p",
      unit: "mm",
      format: "letter",
      putOnlyUsedFonts: true,
      floatPrecision: 16,
    });

    const pageWidth = doc.internal.pageSize.width;
    const margin = 15;

    // ----- Header: Company & Client Info -----
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text('emriBiznesit', margin, 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Tel: ${'currentParametrat.telefoni'}`, margin, 26);
    doc.text(`Adresa: ${'currentParametrat.adresa'}`, margin, 31);

    // Client Info Box
    doc.setDrawColor(200);
    doc.setFillColor(245);
    doc.rect(pageWidth - 95, 15, 80, 25, "FD"); // Filled rectangle for client info

    doc.setFont("helvetica", "bold");
    doc.text(`Klienti: ${selectedClient?.emri}`, pageWidth - 92, 20);
    doc.setFont("helvetica", "normal");
    doc.text(`${selectedClient?.adresa}`, pageWidth - 92, 25);
    doc.text(`Kontakti: ${selectedClient?.nrTelefonit}`, pageWidth - 92, 30);

    // ----- Invoice Info -----
   
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Fatura Nr: ${nrFatures}`, margin, 57);
    doc.text(`Data: ${invoiceDate}`, margin, 64);

    doc.line(margin, 75, pageWidth - margin, 75); // Divider


    // ----- Products Table -----
    const tableStartY = 65;
    const columns = [
      { header: "Nr", dataKey: "nr" },
      { header: "Emërtimi", dataKey: "emertimiProduktit" },
      { header: "Përshkrimi", dataKey: "pershkrimiProduktit" },
      { header: "Cmimi/Cope", dataKey: "cmimiPerCope" },
      { header: "Sasia", dataKey: "sasiaShitjes" },
      { header: "TVSH %", dataKey: "tvsh" },
      { header: "Vlera Totale", dataKey: "vleraTotaleProduktit" },
    ];

    autoTable(doc, {
      columns,
      body: invoiceData?.rows,
      startY: tableStartY,
      theme: "grid",
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [230, 230, 230] },
      columnStyles: {
        pershkrimi: { cellWidth: 50 },
        emertimi: { cellWidth: "wrap" },
      },
    });

    // ----- Totals Section -----
    const finalY = doc.lastAutoTable.finalY + 10;
    const totals = [
      `Totali për Pagesë: ${'invoiceData?.totaliPerPagese'}`,
      `Totali i Pagesës: ${'234234'}`,
      `Mbetja për Pagesë: ${'23423'}`,
    ];

    doc.setFont("helvetica", "bold");
    totals.forEach((text, i) => {
      doc.text(text, pageWidth - margin, finalY + i * 7, { align: "right" });
    });

    // ----- Comment Section -----
    const commentY = finalY + totals.length * 7 + 5;
    doc.setFont("helvetica", "bold");
    doc.text("Koment:", margin, commentY);
    doc.setFont("helvetica", "normal");
    doc.rect(margin, commentY + 2, pageWidth - margin * 2, 20); // Empty box for comment

    // ----- Signatures -----
    const signatureY = commentY + 30;
    const sigWidth = 60;

    doc.line(margin, signatureY, margin + sigWidth, signatureY);
    doc.text("Dorëzoi", margin, signatureY + 4);

    doc.line(pageWidth - margin - sigWidth, signatureY, pageWidth - margin, signatureY);
    doc.text("Pranoi", pageWidth - margin - sigWidth, signatureY + 4);

    // ----- Footer Branding -----
    const footerY = doc.internal.pageSize.height - 10;
    doc.setFontSize(8);
    const footerText = `${'emriBiznesit'} © 2016-${currentYear} | Tel: ${'currentParametrat.telefoni'} | Adresa: ${'currentParametrat.adresa'}`;
    doc.text(footerText, pageWidth / 2, footerY, { align: "center" });

    // Save & Open PDF
    const pdfBase64 = doc.output("datauristring").split(",")[1];
    await window.api.savePDF({ pdfBase64, folderPath: 'C:\\Users\\Berdyna Tech\\Documents', fileName });
    const filePath = 'C:\\Users\\Berdyna Tech\\Documents' + "\\" + fileName;
    await window.api.openFile(filePath);
  };

  handlePrint(selectedClient,nrFatures,invoiceDate,komenti,invoiceData);
};

function getCurrentDateInAlbanian() {
  const months = ["Janar","Shkurt","Mars","Prill","Maj","Qershor","Korrik","Gusht","Shtator","Tetor","Nëntor","Dhjetor"];
  const albaniaTime = new Date(new Date().toLocaleString("en-US", { timeZone: "Europe/Tirane" }));
  const day = String(albaniaTime.getDate()).padStart(2, "0");
  const month = months[albaniaTime.getMonth()];
  const year = albaniaTime.getFullYear();
  return `${day}-${month}-${year}`;
}
