const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* SIGNUP */

router.post("/signup", async(req,res)=>{

  const {email,password} = req.body;

  const hashed = await bcrypt.hash(password,10);

  db.query(
    "INSERT INTO users (email,password) VALUES (?,?)",
    [email,hashed],
    (err,result)=>{
      if(err) return res.status(500).send(err);
      res.send("User created");
    }
  );

});

/* LOGIN */

router.post("/login",(req,res)=>{

  const {email,password} = req.body;

  db.query(
    "SELECT * FROM users WHERE email=?",
    [email],
    async(err,result)=>{

      if(result.length===0)
        return res.status(404).send("User not found");

      const user = result[0];

      const valid = await bcrypt.compare(password,user.password);

      if(!valid)
        return res.status(401).send("Wrong password");

      const token = jwt.sign(
        {id:user.id},
        "secretkey"
      );

      res.json({token});

    }
  );

});

module.exports = router;