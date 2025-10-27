import React, { useState } from "react";
import http from "./http";

export default function Login(){
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [show,setShow] = useState(false);
  const [loading,setLoading] = useState(false);
  const [err,setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setErr("");
    try{
      const {data} = await http.post("/auth/login", {email,password});
      if (data?.redirect) location.href = data.redirect;
    }catch(ex){
      setErr(ex?.response?.data?.message || "Login failed");
    }finally{
      setLoading(false);
    }
  };

  return (
    <div className="card" role="form" aria-label="Login">
      <div className="logo">
        <span className="sparkle" aria-hidden="true"></span>
        <span>justdone</span>
      </div>
      <div className="title">Welcome Back!</div>

      {err ? <div className="error">{err}</div> : null}

      <label className="label" htmlFor="email">Email</label>
      <input id="email" className="input" type="email" placeholder="Enter your email"
             value={email} onChange={e=>setEmail(e.target.value)} />

      <label className="label" htmlFor="password">Password</label>
      <div className="pass-wrap">
        <input id="password" className="input" type={show?"text":"password"} placeholder="Enter your password"
               value={password} onChange={e=>setPassword(e.target.value)} />
        <button type="button" className="eye" onClick={()=>setShow(!show)} aria-label="Toggle password">
          {/* simple SVG eye */}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" stroke="#6b7280" strokeWidth="1.8"/>
            <circle cx="12" cy="12" r="3" stroke="#6b7280" strokeWidth="1.8"/>
          </svg>
        </button>
      </div>

      <div className="row-end"><a href="#" className="link">Forgot password?</a></div>

      <button className="btn" disabled={loading} onClick={submit}>
        {loading ? "Please wait…" : "Continue"}
      </button>

      <div className="small">
        Don’t Have An Account? <a className="link" href="/signup">Sign Up</a>
      </div>

      <div className="helper">
        For assistance, please contact our support team at <a className="link" href="mailto:support@justdone.ai">support@justdone.ai</a>.
      </div>
    </div>
  );
}
