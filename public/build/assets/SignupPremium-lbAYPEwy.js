import{j as e,r as o}from"./Footer-BZchTVqk.js";import{H as ie}from"./Header-CgzZtAfJ.js";import{l as re,E as oe,u as le,a as ce,C as U}from"./sweetalert2.min-d1po1f-I.js";import{S as de}from"./sweetalert2.esm.all-NNS-RXd7.js";const pe=`
:root{
  --brand-blue:#0328aeed; --brand-blue-700:#213bb1; --brand-blue-500:#041b64;
  --ink:#101114; --bg:#fafafa; --border:#e8e8ee; --card:#fff;
  --shadow:0 4px 16px rgba(10,42,107,.06); --footer-bg:#0b1020; --radius:16px
}
html, body { height:100%; }
*{ box-sizing:border-box; margin:0; padding:0; font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif; }
.page{ min-height:100vh; display:flex; flex-direction:column; background:var(--bg); color:var(--ink); }

/* Header (same classes as Header.jsx) */
.header{
  height:80px; background:#fff; border-bottom:1px solid var(--border);
  display:flex; align-items:center; justify-content:space-between; padding:0 24px; position:relative; flex-shrink:0;
}
.brand{ display:flex; align-items:center; gap:10px; color:var(--brand-blue); text-decoration:none; }
.brand svg{ width:26px; height:26px; display:block; }
.brand span{ font-weight:900; font-size:1.3rem; letter-spacing:.2px; color:var(--brand-blue); }
.iconbtn{ background:transparent; border:0; cursor:pointer; padding:6px; border-radius:8px; display:flex; align-items:center; justify-content:center; position:relative; }
.iconbtn:hover{ background:#f2f4ff; }

/* Main & Card */
main{ flex:1; display:flex; align-items:center; justify-content:center; padding:24px; }
.card{
  background:var(--card); border:1px solid var(--border); box-shadow:var(--shadow);
  border-radius:var(--radius); padding:32px 36px; width:100%; max-width:820px;
}
.cardHeader{ display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; }
.cardHeader h1{ font-size:1.9rem; font-weight:900; color:#063122; }
.backBtn{
  background:transparent; border:1px solid #d9e1ff; color:#041b64;
  font-weight:700; border-radius:10px; padding:8px 14px; cursor:pointer; transition:background .25s ease, border-color .25s ease;
}
.backBtn:hover{ background:#eef3ff; border-color:#c9d4ff; }

/* Form */
.row{ display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-top:6px; }
@media (max-width:720px){ .row{ grid-template-columns:1fr; } }
label{ font-weight:700; font-size:.95rem; display:block; margin-top:4px; }
.input{
  width:100%; padding:14px 16px; border:1px solid #063122; border-radius:10px;
  margin:8px 0 16px; font-size:15px; background:#fff;
}
.input:focus{ outline:none; box-shadow:0 0 0 3px rgba(3,40,174,.25); }
.consent{ display:flex; gap:10px; margin:10px 0 16px; }
.consent input{ width:18px; height:18px; margin-top:3px; }

/* Actions */
.actions{ display:flex; gap:12px; align-items:center; margin-top:6px; }
button.cta{
  padding:14px 18px; border:0; border-radius:12px;
  background:linear-gradient(135deg,var(--brand-blue-700),var(--brand-blue-500));
  color:#fff; font-weight:800; font-size:15px; cursor:pointer;
}
button.cta[disabled]{ opacity:.7; cursor:not-allowed; }
button.cta.ghost{ background:#f5f8ff; color:#041b64; border:1px solid #d9e1ff; }

.muted{ color:#475569; margin-bottom:12px; }

/* OTP */
.otpWrap{ margin-top:6px; }
.otpTitle{ font-size:1.25rem; font-weight:900; color:#063122; margin-bottom:6px; }
.otpInputs{ display:flex; gap:10px; justify-content:center; margin:14px 0 10px; }
.otpBox{
  width:46px; height:52px; text-align:center; font-weight:900; font-size:20px;
  border:1px solid #cbd5e1; border-radius:10px; background:#fff;
}
.otpBox:focus{ outline:none; box-shadow:0 0 0 3px rgba(3,40,174,.25); }
.otpMeta{ display:flex; align-items:center; justify-content:space-between; gap:12px; }
.timer{ font-weight:800; }

/* Footer */
.ft{
  background:var(--footer-bg); color:#cbd5e1; font-size:.9rem; padding:12px 24px;
  display:flex; justify-content:space-between; align-items:center; border-top:1px solid #1f2937; flex-shrink:0;
}
.ft a{ color:#cbd5e1; margin-left:14px; text-decoration:none; }
.ft a:hover{ text-decoration:underline; }

@media (max-width:600px){
  .ft{ flex-direction:column; text-align:center; gap:6px; }
  .otpMeta{ flex-direction:column; }
}

/* Password reveal buttons */
.inputWrap{ position:relative; }
.revealBtn{
  position:absolute; right:10px; top:50%; transform:translateY(-50%);
  border:0; background:transparent; cursor:pointer; padding:4px; border-radius:8px;
}
.revealBtn:hover{ background:#eef2ff; }
`,me=`
.modalOverlay{
  position:fixed; inset:0; background:rgba(15,23,42,.55);
  display:flex; align-items:center; justify-content:center; z-index:9999;
}
.modalCard{
  width:min(860px, calc(100% - 28px));
  background:#fff; border-radius:16px; border:1px solid #e8e8ee;
  box-shadow:0 18px 40px rgba(2,6,23,.22);
  overflow:hidden; display:flex; flex-direction:column; max-height:86vh;
}
.modalHead{
  display:flex; align-items:center; justify-content:space-between;
  padding:14px 16px; border-bottom:1px solid #eef0f6; background:#f9fafb;
}
.modalHead h3{ margin:0; font-size:1.05rem; font-weight:800; color:#041b64; }
.modalClose{
  background:transparent; border:0; font-size:22px; line-height:1; cursor:pointer;
  color:#0f172a; border-radius:10px; padding:4px 8px;
}
.modalClose:hover{ background:#eef2ff; }
.modalBody{
  padding:18px; overflow:auto; color:#0f172a; line-height:1.55;
}
.modalBody h4{ margin:16px 0 8px; font-size:1.02rem; color:#041b64; }
.modalBody p{ margin:6px 0 10px; color:#334155; }
.modalBody ul{ padding-left:18px; margin:6px 0 12px; }
.modalBody li{ margin:6px 0; color:#334155; }
.modalFoot{
  padding:12px 16px; border-top:1px solid #eef0f6; display:flex; justify-content:flex-end; gap:10px; background:#fff;
}
.modalFoot .cta.subtle{
  background:#f5f8ff; color:#041b64; border:1px solid #d9e1ff; border-radius:10px; padding:10px 14px; font-weight:700; cursor:pointer;
}
`,ue=`
/* Compact popup base */
.rm-swal {
  width: 360px !important;               /* <= small width */
  max-width: 92vw;
  padding: 14px 16px !important;         /* tighter padding */
  border-radius: 16px !important;        /* smooth corners */
  box-shadow: 0 18px 44px rgba(2,6,23,.22);
  border: 1px solid #e7ebff;
  position: relative;
  overflow: visible;                      /* allow the glow frame */
  backdrop-filter: saturate(140%) blur(0.5px);
}

/* Animated gradient “blob/glow” frame around the box */
.rm-swal::before{
  content:"";
  position:absolute;
  inset:-6px;
  border-radius: 22px;
  background: conic-gradient(from 0deg,
    #5b7cff, #7c5cff, #7e9bff, #5b7cff);
  filter: blur(8px);
  opacity: .35;
  z-index:-1;
  animation: rm-swal-spin 4.5s linear infinite;
}

/* Soft inner highlight */
.rm-swal::after{
  content:"";
  position:absolute;
  inset:0;
  border-radius:16px;
  pointer-events:none;
  box-shadow: inset 0 0 0 1px rgba(3,40,174,.12),
              inset 0 12px 32px rgba(3,40,174,.06);
}

/* Title & text sizing for compact look */
.rm-swal-title {
  font-size: 1.05rem !important;
  font-weight: 800 !important;
  letter-spacing: .2px;
  color: #041b64 !important;
  margin-bottom: 6px !important;
}
.rm-swal-text, .swal2-html-container {
  font-size: .92rem !important;
  color: #334155 !important;
  margin-top: 6px !important;
}

/* Buttons styled to match your brand */
.rm-swal-btn.swal2-confirm{
  background: linear-gradient(135deg, var(--brand-blue-700), var(--brand-blue-500)) !important;
  border: none !important;
  color: #fff !important;
  font-weight: 800 !important;
  border-radius: 10px !important;
  padding: 10px 14px !important;
  box-shadow: 0 4px 14px rgba(4,27,100,.22);
}
.rm-swal-btn.swal2-cancel{
  background: #f5f8ff !important;
  color: #041b64 !important;
  border: 1px solid #d9e1ff !important;
  font-weight: 700 !important;
  border-radius: 10px !important;
  padding: 10px 14px !important;
}

/* Appear / disappear animations */
.rm-swal-in { animation: rm-swal-pop-in .18s ease-out both; }
.rm-swal-out{ animation: rm-swal-pop-out .14s ease-in both; }

@keyframes rm-swal-pop-in {
  0%   { transform: translateY(4px) scale(.96); opacity: 0; }
  100% { transform: translateY(0)   scale(1);    opacity: 1; }
}
@keyframes rm-swal-pop-out {
  0%   { transform: translateY(0)   scale(1);    opacity: 1; }
  100% { transform: translateY(4px) scale(.96);  opacity: 0; }
}
@keyframes rm-swal-spin {
  to { transform: rotate(360deg); }
}
`;function I({title:m,open:c,onClose:d,children:n}){return o.useEffect(()=>{const j=u=>{u.key==="Escape"&&d?.()};return c&&document.addEventListener("keydown",j),()=>document.removeEventListener("keydown",j)},[c,d]),c?e.jsx("div",{className:"modalOverlay",role:"dialog","aria-modal":"true","aria-labelledby":"modal-title",children:e.jsxs("div",{className:"modalCard",children:[e.jsxs("div",{className:"modalHead",children:[e.jsx("h3",{id:"modal-title",children:m}),e.jsx("button",{className:"modalClose","aria-label":"Close",onClick:d,children:"×"})]}),e.jsx("div",{className:"modalBody",children:n}),e.jsx("div",{className:"modalFoot",children:e.jsx("button",{className:"cta subtle",onClick:d,children:"Close"})})]})}):null}const he=re("pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxx"),B=de.mixin({customClass:{popup:"rm-swal",title:"rm-swal-title",confirmButton:"rm-swal-btn",cancelButton:"rm-swal-btn rm-swal-cancel"},buttonsStyling:!1,width:360,showClass:{popup:"swal2-show rm-swal-in"},hideClass:{popup:"swal2-hide rm-swal-out"}}),E=(m,c=1500)=>B.fire({icon:"success",title:m,timer:c,showConfirmButton:!1}),l=m=>B.fire({icon:"error",title:"Oops",text:m,confirmButtonText:"OK"});function xe({routes:m}){const c=m||(typeof window<"u"?window.ROUTES:{}),d=document.querySelector('meta[name="csrf-token"]')?.getAttribute("content")||c.csrf||"",[n,j]=o.useState({name:"",email:"",display_name:"",password:"",confirm_password:"",company_name:"",consent:!1,plan:"premium"}),[u,b]=o.useState(!1),[x,O]=o.useState("form"),[Y,A]=o.useState(!1),[K,W]=o.useState(!1),[v,J]=o.useState(!1),[k,L]=o.useState(!1),[R,C]=o.useState({checking:!1,taken:!1}),[y,S]=o.useState(["","","","","",""]),f=Array.from({length:6}).map(()=>o.useRef(null)),[N,V]=o.useState(null),[P,F]=o.useState(300),[i,z]=o.useState({name:"",email:"",phone:"",address_line1:"",address_line2:"",city:"",state:"",postal_code:"",country:"US"}),h=t=>a=>z(s=>({...s,[t]:a.target.value}));o.useEffect(()=>{x==="pay"&&z(t=>({...t,name:t.name||n.name,email:t.email||n.email}))},[x]);const g=t=>a=>{const s=t==="consent"?a.target.checked:a.target.value;j(r=>({...r,[t]:s}))},X=t=>/^(?=.*[A-Z])(?=.*\d)(?=.*[ !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]).{9,}$/.test(t),$=()=>n.name.trim()?/\S+@\S+\.\S+/.test(n.email.trim())?n.display_name.trim()?!n.password||!X(n.password)?(l("Password must be ≥9 chars, include 1 uppercase, 1 number, 1 special."),!1):n.password!==n.confirm_password?(l("Passwords do not match."),!1):n.company_name.trim()?n.consent?!0:(l("You must agree to the Terms & Privacy."),!1):(l("Enter your company (or N/A)."),!1):(l("Enter a display name."),!1):(l("Enter a valid email."),!1):(l("Enter your full name."),!1),D=async t=>{const a=(t||"").trim();if(!a||!/\S+@\S+\.\S+/.test(a))return!1;C({checking:!0,taken:!1});try{const p=!!(await(await fetch(c.auth?.check_email??"/auth/check-email",{method:"POST",headers:{"X-CSRF-TOKEN":d,Accept:"application/json","Content-Type":"application/json"},credentials:"same-origin",body:JSON.stringify({email:a})})).json().catch(()=>({})))?.taken;return C({checking:!1,taken:p}),p&&await l("This email is already registered. Try signing in or use another email."),p}catch{return C({checking:!1,taken:!1}),!1}};o.useEffect(()=>{let t;if(x==="otp"&&N){const a=()=>{const s=Math.floor(Date.now()/1e3),r=Math.max(0,N-s);F(r),r===0?B.fire({icon:"error",title:"Code expired",text:"Your verification code expired. The page will reload.",timer:1500,showConfirmButton:!1}).then(()=>window.location.reload()):t=setTimeout(a,1e3)};a()}return()=>clearTimeout(t)},[x,N]);const Z=async t=>{if(t.preventDefault(),!(u||!$()||await D(n.email))){b(!0);try{const s=await fetch(c.signup?.premium?.send_otp??"/signup/premium/send-otp",{method:"POST",headers:{"X-CSRF-TOKEN":d,Accept:"application/json","Content-Type":"application/json"},credentials:"same-origin",body:JSON.stringify({...n})}),r=await s.json().catch(()=>({}));if(s.ok&&r.ok){E("Verification code sent to email.");const p=r.expires?Math.floor(new Date(r.expires).getTime()/1e3):Math.floor(Date.now()/1e3)+300;V(p),F(p-Math.floor(Date.now()/1e3)),O("otp"),setTimeout(()=>f[0].current?.focus(),50)}else l(r?.message||"Unable to send code.")}catch{l("Network error.")}finally{b(!1)}}},w=()=>{const t=y.join("");t.length===6&&t.split("").every(a=>a!=="")&&M()},G=t=>a=>{const s=a.target.value.replace(/\D/g,"").slice(0,1),r=[...y];r[t]=s,S(r),s&&t<5&&f[t+1].current?.focus(),t===5&&s&&Promise.resolve().then(()=>w())},Q=t=>a=>{const s=a.key;if(s==="Backspace")if(!y[t]&&t>0)f[t-1].current?.focus();else{const r=[...y];r[t]="",S(r)}else s==="ArrowLeft"&&t>0?(f[t-1].current?.focus(),a.preventDefault()):s==="ArrowRight"&&t<5&&(f[t+1].current?.focus(),a.preventDefault());t===5&&setTimeout(()=>w(),0)},ee=t=>()=>{t===5&&w()},te=t=>{const a=(t.clipboardData.getData("text")||"").replace(/\D/g,"").slice(0,6);if(!a)return;t.preventDefault();const s=a.split("").concat(Array(6).fill("")).slice(0,6);S(s);const r=Math.min(5,a.length-1);setTimeout(()=>f[r].current?.focus(),10),setTimeout(()=>w(),0)},M=async()=>{const t=y.join("");if(t.length!==6)return l("Enter the 6-digit code.");b(!0);try{const a=await fetch(c.signup?.premium?.verify_otp??"/signup/premium/verify-otp",{method:"POST",headers:{"X-CSRF-TOKEN":d,Accept:"application/json","Content-Type":"application/json"},credentials:"same-origin",body:JSON.stringify({code:t,email:n.email.trim()})}),s=await a.json().catch(()=>({}));a.ok&&s.ok?(E("Email verified. Enter card to activate premium."),O("pay")):l(s?.message||"Invalid code.")}catch{l("Network error.")}finally{b(!1)}},T=le(),H=ce(),ae=async()=>{if(!(!T||!H)){if(!i.name||!i.email||!i.postal_code||!i.country)return l("Please complete required billing fields (Name, Email, Postal, Country).");b(!0);try{const t=await fetch(c.payment?.create_payment_intent??"/payment/create-payment-intent",{method:"POST",headers:{"X-CSRF-TOKEN":d,Accept:"application/json","Content-Type":"application/json"},credentials:"same-origin",body:JSON.stringify({amount:900,currency:"usd",receipt_email:i.email,metadata:{plan:"premium",signup_email:n.email}})}),a=await t.json();if(!t.ok||!a.client_secret)throw new Error(a?.message||"Unable to start payment.");const s=H.getElement(U),{error:r,paymentIntent:p}=await T.confirmCardPayment(a.client_secret,{payment_method:{card:s,billing_details:{name:i.name,email:i.email,phone:i.phone||void 0,address:{line1:i.address_line1||void 0,line2:i.address_line2||void 0,city:i.city||void 0,state:i.state||void 0,postal_code:i.postal_code,country:i.country}}}});if(r)throw new Error(r.message||"Card confirmation failed");if(!p||p.status!=="succeeded")throw new Error("Payment not captured.");const q=await fetch(c.signup?.premium?.complete??"/signup/premium/complete",{method:"POST",headers:{"X-CSRF-TOKEN":d,Accept:"application/json","Content-Type":"application/json"},credentials:"same-origin",body:JSON.stringify({name:n.name,email:n.email,display_name:n.display_name,company_name:n.company_name,password:n.password,plan:"premium",stripe_payment_intent:p.id})}),_=await q.json();if(!q.ok||!_.ok)throw new Error(_?.message||"Could not finalize premium account.");await E("Payment received. Premium account activated!",1700),window.location.assign(_.redirect||"/dashboard")}catch(t){l(t.message||"Payment error.")}finally{b(!1)}}},ne=String(Math.floor(P/60)).padStart(2,"0"),se=String(P%60).padStart(2,"0");return e.jsxs(e.Fragment,{children:[e.jsx("style",{children:pe}),e.jsx("style",{children:me}),e.jsx("style",{children:ue}),e.jsx(ie,{routes:c}),e.jsxs("div",{className:"page",children:[e.jsx("main",{children:e.jsxs("section",{className:"card",children:[e.jsxs("div",{className:"cardHeader",children:[e.jsx("h1",{children:"Premium Account"}),e.jsx("button",{type:"button",className:"backBtn",onClick:()=>window.history.back(),children:"← Back"})]}),x==="form"&&e.jsxs("form",{noValidate:!0,onSubmit:Z,children:[e.jsxs("div",{className:"row",children:[e.jsxs("div",{children:[e.jsx("label",{htmlFor:"p-name",children:"Full name"}),e.jsx("div",{className:"inputWrap",children:e.jsx("input",{id:"p-name",className:"input",value:n.name,onChange:g("name"),required:!0})})]}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"p-email",children:"Email"}),e.jsx("div",{className:"inputWrap",children:e.jsx("input",{id:"p-email",className:"input",type:"email",value:n.email,onChange:g("email"),onBlur:()=>D(n.email),required:!0})}),R.checking&&e.jsx("small",{className:"muted",children:"Checking email…"}),R.taken&&e.jsx("small",{style:{color:"#b91c1c",fontWeight:700},children:"Email already registered."})]})]}),e.jsxs("div",{className:"row",children:[e.jsxs("div",{children:[e.jsx("label",{htmlFor:"p-display",children:"Display name"}),e.jsx("div",{className:"inputWrap",children:e.jsx("input",{id:"p-display",className:"input",value:n.display_name,onChange:g("display_name"),required:!0})})]}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"p-company",children:"Company"}),e.jsx("div",{className:"inputWrap",children:e.jsx("input",{id:"p-company",className:"input",value:n.company_name,onChange:g("company_name"),required:!0})})]})]}),e.jsxs("div",{className:"row",children:[e.jsxs("div",{children:[e.jsx("label",{htmlFor:"p-pass",children:"Password"}),e.jsxs("div",{className:"inputWrap",children:[e.jsx("input",{id:"p-pass",className:"input",type:v?"text":"password",value:n.password,onChange:g("password"),required:!0}),e.jsx("button",{type:"button",className:"revealBtn","aria-label":v?"Hide password":"Show password",onClick:()=>J(t=>!t),title:v?"Hide password":"Show password",children:e.jsxs("svg",{width:"22",height:"22",viewBox:"0 0 24 24","aria-hidden":"true",children:[e.jsx("path",{d:"M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z",fill:"none",stroke:"#334155",strokeWidth:"1.5"}),e.jsx("circle",{cx:"12",cy:"12",r:"3",fill:"none",stroke:"#334155",strokeWidth:"1.5"})]})})]})]}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"p-pass2",children:"Confirm password"}),e.jsxs("div",{className:"inputWrap",children:[e.jsx("input",{id:"p-pass2",className:"input",type:k?"text":"password",value:n.confirm_password,onChange:g("confirm_password"),required:!0}),e.jsx("button",{type:"button",className:"revealBtn","aria-label":k?"Hide password":"Show password",onClick:()=>L(t=>!t),title:k?"Hide password":"Show password",children:e.jsxs("svg",{width:"22",height:"22",viewBox:"0 0 24 24","aria-hidden":"true",children:[e.jsx("path",{d:"M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z",fill:"none",stroke:"#334155",strokeWidth:"1.5"}),e.jsx("circle",{cx:"12",cy:"12",r:"3",fill:"none",stroke:"#334155",strokeWidth:"1.5"})]})})]})]})]}),e.jsxs("div",{className:"consent",children:[e.jsx("input",{id:"p-consent",type:"checkbox",checked:n.consent,onChange:g("consent")}),e.jsxs("label",{htmlFor:"p-consent",children:[e.jsx("strong",{children:"I agree"})," to the"," ",e.jsx("a",{href:"#",onClick:t=>{t.preventDefault(),A(!0)},children:"Terms"})," ","and"," ",e.jsx("a",{href:"#",onClick:t=>{t.preventDefault(),W(!0)},children:"Privacy"}),".",e.jsx("br",{}),e.jsx("small",{children:"We’ll use your info to create a premium account and send essential updates."})]})]}),e.jsx("div",{className:"actions",children:e.jsx("button",{className:"cta",disabled:u,children:u?"Sending Code…":"Continue (Send OTP)"})})]}),x==="otp"&&e.jsxs("div",{className:"otpWrap",children:[e.jsx("h2",{className:"otpTitle",children:"Email Verification"}),e.jsxs("p",{className:"muted",children:["Enter the 6-digit code sent to ",e.jsx("strong",{children:n.email}),"."]}),e.jsx("div",{className:"otpInputs",onPaste:te,children:y.map((t,a)=>e.jsx("input",{ref:f[a],className:"otpBox",inputMode:"numeric",type:"text",maxLength:1,value:t,onChange:G(a),onKeyDown:Q(a),onKeyUp:ee(a)},a))}),e.jsxs("div",{className:"otpMeta",children:[e.jsxs("div",{className:"timer",children:["Expires in: ",e.jsxs("strong",{children:[ne,":",se]})]}),e.jsx("button",{type:"button",className:"cta ghost",disabled:u||P===0,onClick:M,children:u?"Verifying…":"Verify Code"})]})]}),x==="pay"&&e.jsxs("div",{style:{marginTop:8},children:[e.jsx("h2",{className:"otpTitle",children:"Card for Premium (one-time $9.00)"}),e.jsx("p",{className:"muted",children:"We’ll charge $9.00 now to activate your premium account."}),e.jsxs("div",{className:"row",children:[e.jsxs("div",{children:[e.jsx("label",{children:"Cardholder name"}),e.jsx("input",{className:"input",value:i.name,onChange:h("name"),required:!0})]}),e.jsxs("div",{children:[e.jsx("label",{children:"Billing email"}),e.jsx("input",{className:"input",type:"email",value:i.email,onChange:h("email"),required:!0})]})]}),e.jsxs("div",{className:"row",children:[e.jsxs("div",{children:[e.jsx("label",{children:"Billing phone (optional)"}),e.jsx("input",{className:"input",value:i.phone,onChange:h("phone")})]}),e.jsxs("div",{children:[e.jsx("label",{children:"Country"}),e.jsx("input",{className:"input",value:i.country,onChange:h("country"),placeholder:"US",required:!0})]})]}),e.jsxs("div",{children:[e.jsx("label",{children:"Address line 1"}),e.jsx("input",{className:"input",value:i.address_line1,onChange:h("address_line1")})]}),e.jsxs("div",{children:[e.jsx("label",{children:"Address line 2"}),e.jsx("input",{className:"input",value:i.address_line2,onChange:h("address_line2")})]}),e.jsxs("div",{className:"row",children:[e.jsxs("div",{children:[e.jsx("label",{children:"City"}),e.jsx("input",{className:"input",value:i.city,onChange:h("city")})]}),e.jsxs("div",{children:[e.jsx("label",{children:"State/Region"}),e.jsx("input",{className:"input",value:i.state,onChange:h("state")})]})]}),e.jsxs("div",{className:"row",children:[e.jsxs("div",{children:[e.jsx("label",{children:"Postal code"}),e.jsx("input",{className:"input",value:i.postal_code,onChange:h("postal_code"),required:!0})]}),e.jsxs("div",{children:[e.jsx("label",{children:"Card"}),e.jsx("div",{className:"input",style:{padding:12},children:e.jsx(U,{options:{hidePostalCode:!0}})})]})]}),e.jsx("div",{className:"actions",style:{marginTop:12},children:e.jsx("button",{type:"button",className:"cta",onClick:ae,disabled:u||!T,children:u?"Processing…":"Pay $9.00 & Activate"})})]})]})}),e.jsxs("footer",{className:"ft",children:[e.jsx("div",{children:"© 2025 Raymoch. All rights reserved."}),e.jsx("div",{children:e.jsx("a",{href:c.signup?.index??"/signup",children:"Signup Options"})})]})]}),e.jsxs(I,{title:"Terms of Service",open:Y,onClose:()=>A(!1),children:[e.jsxs("p",{children:[e.jsx("strong",{children:"Effective:"})," January 1, 2025"]}),e.jsx("h4",{children:"1) Acceptance of Terms"}),e.jsx("p",{children:"By creating an account or using Raymoch, you agree to these Terms of Service. If you do not agree, you may not access or use the platform. We may update these Terms periodically; continued use after updates constitutes acceptance."}),e.jsx("h4",{children:"2) Accounts & Responsibilities"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Provide accurate registration information and keep credentials secure."}),e.jsx("li",{children:"You are responsible for all activity under your account."}),e.jsx("li",{children:"Misuse (e.g., unauthorized access, scraping, abuse) may result in suspension or termination."})]}),e.jsx("h4",{children:"3) Service Availability & Changes"}),e.jsx("p",{children:"We aim for high availability but do not guarantee uninterrupted service. We may modify, suspend, or discontinue features at any time with or without notice."}),e.jsx("h4",{children:"4) Paid Plans, Billing & Taxes"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Premium plans renew automatically until canceled (if you enable subscriptions later)."}),e.jsx("li",{children:"Billing is handled by our payment provider; taxes may apply based on your region."}),e.jsx("li",{children:"Failed or disputed charges may pause or terminate access."})]}),e.jsx("h4",{children:"5) Prohibited Conduct"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Reverse engineering, automated scraping, or attempting to bypass security controls."}),e.jsx("li",{children:"Uploading malicious code or content that violates law or third-party rights."})]}),e.jsx("h4",{children:"6) Intellectual Property"}),e.jsx("p",{children:"The Raymoch name, logos, and platform content are protected by copyright, trademark, and other laws. You receive a limited, non-exclusive, non-transferable license to use the platform as intended."}),e.jsx("h4",{children:"7) Limitation of Liability"}),e.jsx("p",{children:"To the fullest extent permitted by law, Raymoch is not liable for indirect, incidental, special, consequential, or exemplary damages. Your exclusive remedy is to stop using the service."}),e.jsx("h4",{children:"8) Governing Law"}),e.jsx("p",{children:"These Terms are governed by the laws of California, USA, without regard to conflict-of-law rules."})]}),e.jsxs(I,{title:"Privacy Policy",open:K,onClose:()=>W(!1),children:[e.jsxs("p",{children:[e.jsx("strong",{children:"Effective:"})," January 1, 2025"]}),e.jsx("h4",{children:"1) Data We Collect"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Account data: name, email, display name, company; password stored using strong hashing."}),e.jsx("li",{children:"Usage & device data (e.g., browser type, IP, timestamps) to improve reliability and security."}),e.jsx("li",{children:"Payment data is processed by our PCI-compliant provider; we do not store full card numbers."})]}),e.jsx("h4",{children:"2) How We Use Data"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Create and maintain your account, authenticate access, and deliver features."}),e.jsx("li",{children:"Send transactional notices (verifications, receipts, security alerts)."}),e.jsx("li",{children:"Monitor platform health, prevent abuse, and comply with legal obligations."})]}),e.jsx("h4",{children:"3) Sharing"}),e.jsx("p",{children:"We don’t sell or rent personal data. We share with service providers (cloud hosting, email delivery, payments) under contractual safeguards and only as needed to provide the service."}),e.jsx("h4",{children:"4) Security & Retention"}),e.jsx("p",{children:"We apply technical and organizational controls, store passwords using strong hashing, and retain data only as long as necessary for the stated purposes or legal requirements."}),e.jsx("h4",{children:"5) Your Rights"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Access, correct, export, or delete your personal data (subject to applicable law)."}),e.jsxs("li",{children:["Contact: ",e.jsx("a",{href:"mailto:support@raymoch.com",children:"support@raymoch.com"})]})]})]})]})}function je(m){return e.jsx(oe,{stripe:he,children:e.jsx(xe,{...m})})}export{je as S};
