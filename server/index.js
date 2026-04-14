const express = require("express");
const cors = require("cors");
const db = require("./firebase");
const PDFDocument = require("pdfkit");

const app = express();

/* ================= MIDDLEWARE ================= */
app.use(cors({
  origin: "*"   // you can restrict later
}));
app.use(express.json());

/* ================= TEST ROUTE ================= */
app.get("/", (req, res) => {
  res.send("API working 🚀");
});

/* ================= EMPLOYEE APIs ================= */

// ✅ ADD EMPLOYEE (FIXED - THIS WAS MISSING)
app.post("/employees", async (req, res) => {
  try {
    const { name, role } = req.body;

    const docRef = await db.collection("employees").add({
      name,
      role
    });

    res.json({
      id: docRef.id,
      name,
      role
    });

  } catch (error) {
    console.error("ERROR ADD:", error);
    res.status(500).json({ message: "Error adding employee" });
  }
});

// ✅ GET EMPLOYEES (ONLY ONE - DUPLICATE REMOVED)
app.get("/employees", async (req, res) => {
  try {
    const snapshot = await db.collection("employees").get();

    res.json(snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })));

  } catch (error) {
    console.error("ERROR FETCH:", error);
    res.status(500).json({ message: "Error fetching employees" });
  }
});

/* ================= SALARY ================= */

app.post("/employees/:id/salary", async (req, res) => {
  try {
    const { id } = req.params;
    const { month, salary, advance = 0, presentDays = 30, totalDays = 30 } = req.body;

    const netSalary = (salary / totalDays) * presentDays - advance;

    await db.collection("employees").doc(id)
      .collection("salaryRecords")
      .add({ month, salary, advance, presentDays, totalDays, netSalary });

    res.json({ message: "Salary added" });

  } catch (error) {
    console.error("ERROR SALARY:", error);
    res.status(500).json({ message: "Error adding salary" });
  }
});

/* ================= PAYSLIP PDF ================= */

app.get("/employees/:id/payslip/:salaryId", async (req, res) => {
  try {
    const { id, salaryId } = req.params;

    const emp = (await db.collection("employees").doc(id).get()).data();
    const salary = (await db.collection("employees").doc(id)
      .collection("salaryRecords").doc(salaryId).get()).data();

    const doc = new PDFDocument();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=payslip.pdf");

    doc.pipe(res);

    doc.fontSize(18).text("Salary Payslip", { align: "center" });
    doc.moveDown();

    doc.fontSize(12).text(`Employee: ${emp.name}`);
    doc.text(`Month: ${salary.month}`);
    doc.text(`Salary: ${salary.salary}`);
    doc.text(`Advance: ${salary.advance}`);
    doc.text(`Present Days: ${salary.presentDays}`);
    doc.text(`Net Salary: ${salary.netSalary}`);

    doc.end();

  } catch (error) {
    console.error("ERROR PDF:", error);
    res.status(500).json({ message: "Error generating payslip" });
  }
});

/* ================= LOGIN ================= */

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "admin123") {
    return res.json({ success: true });
  }

  res.status(401).json({ success: false });
});

/* ================= SERVER ================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});