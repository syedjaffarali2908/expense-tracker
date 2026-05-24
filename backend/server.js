const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Groq = require("groq-sdk");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const SECRET = "mysecretkey";

/* ========================= */
/*       GROQ AI SETUP       */
/* ========================= */

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

/* ========================= */
/*     DATABASE CONNECTION   */
/* ========================= */

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12345",
  database: "expense_tracker"
});

db.connect(err => {
  if (err) {
    console.log("MySQL Error:", err);
  } else {
    console.log("MySQL connected");
  }
});

/* ========================= */
/*    JWT AUTH MIDDLEWARE    */
/* ========================= */

const verifyToken = (req, res, next) => {

  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).send("Access denied");
  }

  try {

    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;

    next();

  } catch (err) {

    return res.status(400).send("Invalid token");

  }

};

/* ========================= */
/*        AUTH ROUTES        */
/* ========================= */

/* SIGNUP */

app.post("/signup", async (req, res) => {

  const { email, password } = req.body;

  try {

    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO users (email,password) VALUES (?,?)",
      [email, hashedPassword],
      (err, result) => {

        if (err) {
          return res.status(500).send(err);
        }

        res.send("User created");

      }
    );

  } catch (err) {
    res.status(500).send("Signup failed");
  }

});

/* LOGIN */

app.post("/login", (req, res) => {

  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email=?",
    [email],
    async (err, result) => {

      if (err) return res.status(500).send(err);

      if (result.length === 0) {
        return res.status(404).send("User not found");
      }

      const user = result[0];

      const valid = await bcrypt.compare(password, user.password);

      if (!valid) {
        return res.status(401).send("Wrong password");
      }

      const token = jwt.sign(
        { id: user.id },
        SECRET
      );

      res.json({ token });

    }
  );

});

/* ========================= */
/*      EXPENSE ROUTES       */
/* ========================= */

/* GET USER EXPENSES */

app.get("/expenses", verifyToken, (req, res) => {

  db.query(
    "SELECT * FROM expenses WHERE user_id=?",
    [req.user.id],
    (err, result) => {

      if (err) return res.status(500).send(err);

      res.json(result);

    }
  );

});

/* ADD EXPENSE */

app.post("/expenses", verifyToken, (req, res) => {

  const { title, amount, category } = req.body;

  db.query(
    "INSERT INTO expenses (title,amount,category,user_id) VALUES (?,?,?,?)",
    [title, amount, category, req.user.id],
    (err, result) => {

      if (err) return res.status(500).send(err);

      res.send("Expense added");

    }
  );

});

/* DELETE EXPENSE */

app.delete("/expenses/:id", verifyToken, (req, res) => {

  const id = req.params.id;

  db.query(
    "DELETE FROM expenses WHERE id=? AND user_id=?",
    [id, req.user.id],
    (err, result) => {

      if (err) return res.status(500).send(err);

      res.send("Expense deleted");

    }
  );

});

/* ========================= */
/*        AI INSIGHTS        */
/* ========================= */

app.post("/ai-insight", verifyToken, async (req, res) => {

  try {

    const expenses = req.body.expenses;

    const prompt = `
You are a financial advisor.

Analyze this expense data and give financial advice.

Expenses:
${JSON.stringify(expenses)}

Provide 3 short insights about spending habits and saving tips.
`;

    const response = await groq.chat.completions.create({

      messages: [
        {
          role: "user",
          content: prompt
        }
      ],

      model: "llama-3.3-70b-versatile"

    });

    res.json({
      insight: response.choices[0].message.content
    });

  } catch (error) {

    console.log("AI Error:", error);
    res.status(500).json({ error: "AI failed" });

  }

});

/* ========================= */
/*          SERVER           */
/* ========================= */

app.listen(5000, () => {
  console.log("Server running on port 5000");
});