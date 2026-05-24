import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./App.css";

function Login(){

const [email,setEmail] = useState("");
const [password,setPassword] = useState("");

const navigate = useNavigate();

const login = async ()=>{

try{

const res = await axios.post(
"http://localhost:5000/login",
{email,password}
);

localStorage.setItem("token",res.data.token);

navigate("/dashboard");

}catch(err){

alert("Login failed");

}

};

return(

<div className="auth-container">

<div className="auth-card">

<h2>Welcome Back 👋</h2>

<input
placeholder="Email"
onChange={(e)=>setEmail(e.target.value)}
/>

<input
type="password"
placeholder="Password"
onChange={(e)=>setPassword(e.target.value)}
/>

<button onClick={login}>
Login
</button>

<p>
Don't have an account? <Link to="/signup">Signup</Link>
</p>

</div>

</div>

);

}

export default Login;