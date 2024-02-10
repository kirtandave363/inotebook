import React, { useState } from 'react'
import { useNavigate} from "react-router-dom";

const Signup = (props) => {
  const host = "http://127.0.0.1:5000";
  const [credentials, setCredentials] = useState({name: "",email:"",password:"", cpassword : ""});

  const navigate = useNavigate();

  const onchange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  }

  const hanldesubmit = async (e)=>{
    e.preventDefault();
    
    const {name, email, password} = credentials;
    const response = await fetch(`${host}/api/auth/createuser`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({name,email,password})
      })
      const json = await response.json()
      console.log(json);
      if(json.success){
        // store authtoken & redirect
        localStorage.setItem("token", json.authtoken);
        navigate("/");
        props.showAlert("Account created successfully","success");
      }
      else{
        props.showAlert("Invalid Credential","danger");
      }
  }
  return (
    <div className='my-3 container'>
       <h2 className='my-3'>Create an account to use iNotebook</h2>
      <form onSubmit={hanldesubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input type="text" className="form-control" id="name" name='name' aria-describedby="emailHelp" onChange={onchange}/>
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input type="email" className="form-control" id="email" name='email' aria-describedby="emailHelp" onChange={onchange}/>
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" className="form-control" id="password" name='password' onChange={onchange} minLength={5} required/>
        </div>
        <div className="mb-3">
          <label htmlFor="cpassword" className="form-label">Confirm Password</label>
          <input type="password" className="form-control" id="cpassword" name='cpassword' onChange={onchange} minLength={5} required/>
        </div>

        <button type="submit" className="btn btn-primary">Sign UP</button>
      </form>
    </div>
  )
}

export default Signup
