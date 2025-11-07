import React, { useState } from "react";
import http from "./http";

export default function Signup() {
    
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErr("");
        try {
            const { data } = await http.post("/auth/register", {
                name,
                email,
                password,
                password_confirmation: confirm,
            });
            if (data?.redirect) location.href = data.redirect;
        } catch (ex) {
            // collect validation errors
            const res = ex?.response?.data;
            if (res?.errors) {
                const firstKey = Object.keys(res.errors)[0];
                setErr(res.errors[firstKey][0]);
            } else {
                setErr(res?.message || "Signup failed");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card" role="form" aria-label="Sign up">
            <div className="logo">
                <span className="sparkle" aria-hidden="true"></span>
                <span>justdone</span>
            </div>
            <div className="title">Create your account</div>

            {err ? <div className="error">{err}</div> : null}

            <label className="label" htmlFor="name">
                Full name
            </label>
            <input
                id="name"
                className="input"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <label className="label" htmlFor="email">
                Email
            </label>
            <input
                id="email"
                className="input"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <label className="label" htmlFor="password">
                Password
            </label>
            <div className="pass-wrap">
                <input
                    id="password"
                    className="input"
                    type={show ? "text" : "password"}
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    type="button"
                    className="eye"
                    onClick={() => setShow(!show)}
                    aria-label="Toggle password"
                >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z"
                            stroke="#6b7280"
                            strokeWidth="1.8"
                        />
                        <circle
                            cx="12"
                            cy="12"
                            r="3"
                            stroke="#6b7280"
                            strokeWidth="1.8"
                        />
                    </svg>
                </button>
                
            </div>

            <label className="label" htmlFor="confirm">
                Confirm Password
            </label>
            <input
                id="confirm"
                className="input"
                type={show ? "text" : "password"}
                placeholder="Re-enter password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
            />

            <button className="btn" disabled={loading} onClick={submit}>
                {loading ? "Creating…" : "Continue"}
            </button>

            <div className="small">
                Already have an account?{" "}
                <a className="link" href="/login">
                    Log in
                </a>
            </div>

    <div className="helper">
    For assistance, please contact our support team at{" "}
    <a className="link" href="mailto:support@justdone.ai">
    support@justdone.ai
                </a>
    </div>

    
    </div>

    );
}
