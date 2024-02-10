import React, { useState } from 'react'
import { useNavigate} from "react-router-dom";
 

const Login = (props) => {
    const host = "http://127.0.0.1:5000"
    const [credentials, setCredentials] = useState({email:"",password:""});
    const navigate = useNavigate();

    const onchange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
      }
      const hanldesubmit = async (e)=>{
        e.preventDefault();

        const response = await fetch(`${host}/api/auth/login`,{
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({email:credentials.email, password: credentials.password })
          })
          const json = await response.json()
        //   console.log(json);
        if (json.success){
            //store authtoken & redirect
            localStorage.setItem("token", json.authtoken);
            props.showAlert("Logged in successfully","success");
            navigate("/");
        }else{
            props.showAlert("Invalid Credential","danger");
        }
      }

    return (
        <div className='mt-3'>
            <h2 className='my-1'>Login to continue to iNotebook</h2>
            <form className="my-3"onSubmit={hanldesubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="email" name='email' onChange={onchange} aria-describedby="emailHelp"/>
                        <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" name ="password" onChange={onchange} className="form-control" id="password"/>
                </div> 
                <button type="submit" className="btn btn-primary">Login</button>
            </form>
        </div>
    )
}

export default Login