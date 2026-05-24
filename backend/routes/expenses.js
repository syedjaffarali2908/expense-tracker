const express = require("express");
const router = express.Router();
const db = require("../db");
const auth = require("../middleware/authMiddleware");

/* GET EXPENSES */

router.get("/",auth,(req,res)=>{

  db.query(
    "SELECT * FROM expenses WHERE user_id=?",
    [req.user.id],
    (err,result)=>{
      res.json(result);
    }
  );

});

/* ADD EXPENSE */

router.post("/",auth,(req,res)=>{

  const {title,amount,category} = req.body;

  db.query(
    "INSERT INTO expenses (title,amount,category,user_id) VALUES (?,?,?,?)",
    [title,amount,category,req.user.id],
    ()=> res.send("Expense added")
  );

});

/* DELETE */

router.delete("/:id",auth,(req,res)=>{

  db.query(
    "DELETE FROM expenses WHERE id=? AND user_id=?",
    [req.params.id,req.user.id],
    ()=> res.send("Deleted")
  );

});

module.exports = router;