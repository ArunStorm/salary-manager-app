

const express = require("express");
const cors = require("cors");
const db = require("./firebase");
const PDFDocument = require("pdfkit");

const app = express();
app.use(cors({
  origin: "https://salary-manager-app.vercel.app"
}));
app.use(express.json());

app.get("/employees", async (req, res) => {
  try {
    const snapshot = await db.collection("employees").get();

    res.json(snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })));

  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ message: "Error fetching employees" });
  }
});

app.get("/employees", async (req, res) => {
  const snapshot = await db.collection("employees").get();
  res.json(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
});

app.post("/employees/:id/salary", async (req, res) => {
  const { id } = req.params;
  const { month, salary, advance = 0, presentDays = 30, totalDays = 30 } = req.body;

  const netSalary = (salary / totalDays) * presentDays - advance;

  await db.collection("employees").doc(id)
    .collection("salaryRecords")
    .add({ month, salary, advance, presentDays, totalDays, netSalary });

  res.json({ message: "Salary added" });
});

app.get("/employees/:id/payslip/:salaryId", async (req, res) => {
  const { id, salaryId } = req.params;

  const emp = (await db.collection("employees").doc(id).get()).data();
  const salary = (await db.collection("employees").doc(id)
    .collection("salaryRecords").doc(salaryId).get()).data();

  const doc = new PDFDocument();
  res.setHeader("Content-Type", "application/pdf");
  doc.pipe(res);

  doc.text("Salary Payslip");
  doc.text(emp.name);
  doc.text(salary.month);
  doc.text("Net Salary: " + salary.netSalary);

  doc.end();
});

/* ================= LOGIN ================= */


app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "admin123") {
    return res.json({ success: true });
  }

  res.status(401).json({ success: false });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});