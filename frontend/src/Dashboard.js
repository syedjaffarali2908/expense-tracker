import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useNavigate } from "react-router-dom";

ChartJS.register(ArcElement, Tooltip, Legend);

function Dashboard() {

  const navigate = useNavigate();

  const [title,setTitle] = useState("");
  const [amount,setAmount] = useState("");
  const [category,setCategory] = useState("");
  const [expenses,setExpenses] = useState([]);
  const [dark,setDark] = useState(false);
  const [aiInsight,setAiInsight] = useState("");

  const API = "http://localhost:5000";
  const token = localStorage.getItem("token");

  /* redirect if not logged in */

  useEffect(()=>{
    if(!token){
      navigate("/");
    }
  },[token,navigate]);

  /* fetch expenses */

  const fetchExpenses = async()=>{

    try{

      const res = await axios.get(`${API}/expenses`,{
        headers:{ authorization: token }
      });

      setExpenses(res.data);

    }catch(err){
      console.error(err);
    }

  };

  useEffect(()=>{
    fetchExpenses();
  },[]);

  /* add expense */

  const addExpense = async()=>{

    if(!title || !amount || !category){
      alert("Fill all fields");
      return;
    }

    try{

      await axios.post(
        `${API}/expenses`,
        {title,amount,category},
        {
          headers:{ authorization: token }
        }
      );

      setTitle("");
      setAmount("");
      setCategory("");

      fetchExpenses();

    }catch(err){
      console.error(err);
    }

  };

  /* delete expense */

  const deleteExpense = async(id)=>{

    try{

      await axios.delete(`${API}/expenses/${id}`,{
        headers:{ authorization: token }
      });

      fetchExpenses();

    }catch(err){
      console.error(err);
    }

  };

  /* logout */

  const logout = ()=>{
    localStorage.removeItem("token");
    navigate("/");
  };

  /* download CSV */

  const downloadCSV = ()=>{

    if(expenses.length === 0){
      alert("No expenses to download");
      return;
    }

    const headers = ["Title","Amount","Category"];

    const rows = expenses.map(exp=>[
      exp.title,
      exp.amount,
      exp.category
    ]);

    let csvContent = headers.join(",") + "\n";

    rows.forEach(row=>{
      csvContent += row.join(",") + "\n";
    });

    const blob = new Blob([csvContent],{
      type:"text/csv;charset=utf-8;"
    });

    const link = document.createElement("a");

    const url = URL.createObjectURL(blob);

    link.setAttribute("href",url);
    link.setAttribute("download","expenses.csv");

    document.body.appendChild(link);

    link.click();

  };

  /* AI spending analysis */

  const analyzeSpending = async()=>{

    try{

      const res = await axios.post(
        `${API}/ai-insight`,
        {expenses},
        {
          headers:{ authorization: token }
        }
      );

      setAiInsight(res.data.insight);

    }catch(err){
      console.error(err);
      alert("AI analysis failed");
    }

  };

  /* totals */

  const total = expenses.reduce(
    (sum,e)=>sum + Number(e.amount),
    0
  );

  /* pie chart */

  const categoryData = {};

  expenses.forEach(e=>{
    const cat = e.category || "Other";

    categoryData[cat] =
      (categoryData[cat] || 0) + Number(e.amount);
  });

  const chartData = {
    labels:Object.keys(categoryData),
    datasets:[
      {
        data:Object.values(categoryData),
        backgroundColor:[
          "#ff6384",
          "#36a2eb",
          "#ffce56",
          "#4caf50",
          "#9c27b0"
        ]
      }
    ]
  };

  return(

    <div className={`container ${dark ? "dark":""}`}>

      {/* HEADER */}

      <div className="header">

        <h1>💰 Expense Dashboard</h1>

        <div>

          <button
            className="dark-btn"
            onClick={()=>setDark(!dark)}
          >
            {dark ? "☀ Light Mode":"🌙 Dark Mode"}
          </button>

          <button
            style={{marginLeft:"10px"}}
            onClick={downloadCSV}
          >
            Download CSV
          </button>

          <button
            style={{marginLeft:"10px"}}
            onClick={analyzeSpending}
          >
            🤖 Analyze Spending
          </button>

          <button
            style={{marginLeft:"10px"}}
            onClick={logout}
          >
            Logout
          </button>

        </div>

      </div>

      {/* AI INSIGHT */}

      {aiInsight && (

        <div className="card">

          <h3>AI Financial Advice</h3>

          <p>{aiInsight}</p>

        </div>

      )}

      {/* SUMMARY */}

      <div className="summary">

        <div className="card total">
          Total Expenses
          <h2>₹{total}</h2>
        </div>

        <div className="card">
          Transactions
          <h2>{expenses.length}</h2>
        </div>

      </div>

      {/* ADD FORM */}

      <div className="form">

        <input
          placeholder="Title"
          value={title}
          onChange={(e)=>setTitle(e.target.value)}
        />

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e)=>setAmount(e.target.value)}
        />

        <select
          value={category}
          onChange={(e)=>setCategory(e.target.value)}
        >

          <option value="">Category</option>
          <option>Food</option>
          <option>Travel</option>
          <option>Shopping</option>
          <option>Other</option>

        </select>

        <button onClick={addExpense}>
          Add
        </button>

      </div>

      {/* CHART */}

      <div className="chart">

        {expenses.length>0 ? (
          <Pie data={chartData}/>
        ):(
          <p style={{textAlign:"center"}}>
            No chart data
          </p>
        )}

      </div>

      {/* TABLE */}

      <div className="table">

        <h2>Recent Expenses</h2>

        {expenses.length===0 &&
          <p>No expenses yet</p>
        }

        {expenses.map(exp=>(

          <div className="row" key={exp.id}>

            <span>{exp.title}</span>
            <span>{exp.category}</span>
            <span>₹{exp.amount}</span>

            <button
              className="delete"
              onClick={()=>deleteExpense(exp.id)}
            >
              Delete
            </button>

          </div>

        ))}

      </div>

    </div>

  );

}

export default Dashboard;