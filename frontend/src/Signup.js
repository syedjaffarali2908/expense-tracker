import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./App.css";

function Signup(){

const [email,setEmail] = useState("");
const [password,setPassword] = useState("");

const navigate = useNavigate();

const signup = async ()=>{

try{

await axios.post(
"http://localhost:5000/signup",
{email,password}
);

alert("Account created");

navigate("/");

}catch(err){

alert("Signup failed");

}

};

return(

<div className="auth-container">

<div className="auth-card">

<h2>Create Account</h2>

<input
placeholder="Email"
onChange={(e)=>setEmail(e.target.value)}
/>

<input
type="password"
placeholder="Password"
onChange={(e)=>setPassword(e.target.value)}
/>

<button onClick={signup}>
Signup
</button>

<p>
Already have an account? <Link to="/">Login</Link>
</p>

</div>

</div>

);

}

export default Signup;