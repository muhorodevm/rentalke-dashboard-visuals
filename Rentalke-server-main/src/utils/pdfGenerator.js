const PDFDocument = require("pdfkit");
const fs = require("fs");

module.exports = function generateRentalUnitsPDF(building, createdUnits) {
  return new Promise((resolve, reject) => {
    const pdfPath = `./rental_units_${Date.now()}.pdf`;
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(pdfPath);

    doc.pipe(stream);

    doc.fontSize(18).text("Rental Units Added", { align: "center" });
    doc.fontSize(12).text(`Estate: ${building.estate.name}`);
    doc.text(`Building: ${building.name}`);
    doc.moveDown();

    doc.fontSize(10).text("Unit Details:", { underline: true });
    createdUnits.forEach(unit => {
      doc.text(`- ${unit.name} (${unit.unitSize})`);
      doc.text(`  Type: ${unit.unitType}`);
      doc.text(`  Features: ${unit.interiorFeatures.join(", ")}`);
      doc.text(`  Price: ${unit.unitPrice} KES`);
      doc.text(`  Availability: ${unit.availability}`);
      doc.text(`  Date Created: ${unit.createdAt.toLocaleString()}`);
      doc.moveDown();
    });

    doc.end();

    stream.on("finish", () => {
      console.log("PDF successfully written:", pdfPath);
      resolve(pdfPath);
    });

    stream.on("error", (err) => {
      console.error("PDF generation error:", err);
      reject(err);
    });
  });
};
