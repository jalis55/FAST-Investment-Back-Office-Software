export  const reportHeader = (doc) => {
    // FAST LOGO Text (Left Side)
    doc.setFontSize(12);
    doc.text("FAST LOGO", 20, 8); // Placed right next to the logo

    // Centered Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor('#99a32f'); // Dark Blue
    doc.text("FAST INVESTMENT LIMITED", 105, 10, { align: "center" });
}