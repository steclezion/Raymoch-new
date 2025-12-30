import{r,j as e}from"./Footer-BZchTVqk.js";import{H as Q,F as W}from"./Footer-B-9wwEos.js";import{g as L,a as q,u as J,L as P,b as K,s as X,c as Z,B as ee,r as se,m as ae,d as O,e as f,F as U,I as V,S as A,f as te,h as re,T as oe,C as ie,i as ne}from"./dividerClasses-Dqy5i7in.js";import{c as H}from"./emotion-react.browser.esm-BQbNY9T6.js";import{u as le}from"./Grow-Dr1MH1Lh.js";import"./sweetalert2.esm.all-NNS-RXd7.js";import"./emotion-element-f0de968e.browser.esm-CdL0rxn0.js";const D=L("MuiListItemIcon",["root","alignItemsFlexStart"]),G=L("MuiListItemText",["root","multiline","dense","inset","primary","secondary"]);function ce(s){return q("MuiMenuItem",s)}const j=L("MuiMenuItem",["root","focusVisible","dense","disabled","divider","gutters","selected"]),de=(s,t)=>{const{ownerState:d}=s;return[t.root,d.dense&&t.dense,d.divider&&t.divider,!d.disableGutters&&t.gutters]},pe=s=>{const{disabled:t,dense:d,divider:h,disableGutters:n,selected:v,classes:p}=s,u=Z({root:["root",d&&"dense",t&&"disabled",!n&&"gutters",h&&"divider",v&&"selected"]},ce,p);return{...p,...u}},ue=X(ee,{shouldForwardProp:s=>se(s)||s==="classes",name:"MuiMenuItem",slot:"Root",overridesResolver:de})(ae(({theme:s})=>({...s.typography.body1,display:"flex",justifyContent:"flex-start",alignItems:"center",position:"relative",textDecoration:"none",minHeight:48,paddingTop:6,paddingBottom:6,boxSizing:"border-box",whiteSpace:"nowrap","&:hover":{textDecoration:"none",backgroundColor:(s.vars||s).palette.action.hover,"@media (hover: none)":{backgroundColor:"transparent"}},[`&.${j.selected}`]:{backgroundColor:s.alpha((s.vars||s).palette.primary.main,(s.vars||s).palette.action.selectedOpacity),[`&.${j.focusVisible}`]:{backgroundColor:s.alpha((s.vars||s).palette.primary.main,`${(s.vars||s).palette.action.selectedOpacity} + ${(s.vars||s).palette.action.focusOpacity}`)}},[`&.${j.selected}:hover`]:{backgroundColor:s.alpha((s.vars||s).palette.primary.main,`${(s.vars||s).palette.action.selectedOpacity} + ${(s.vars||s).palette.action.hoverOpacity}`),"@media (hover: none)":{backgroundColor:s.alpha((s.vars||s).palette.primary.main,(s.vars||s).palette.action.selectedOpacity)}},[`&.${j.focusVisible}`]:{backgroundColor:(s.vars||s).palette.action.focus},[`&.${j.disabled}`]:{opacity:(s.vars||s).palette.action.disabledOpacity},[`& + .${O.root}`]:{marginTop:s.spacing(1),marginBottom:s.spacing(1)},[`& + .${O.inset}`]:{marginLeft:52},[`& .${G.root}`]:{marginTop:0,marginBottom:0},[`& .${G.inset}`]:{paddingLeft:36},[`& .${D.root}`]:{minWidth:36},variants:[{props:({ownerState:t})=>!t.disableGutters,style:{paddingLeft:16,paddingRight:16}},{props:({ownerState:t})=>t.divider,style:{borderBottom:`1px solid ${(s.vars||s).palette.divider}`,backgroundClip:"padding-box"}},{props:({ownerState:t})=>!t.dense,style:{[s.breakpoints.up("sm")]:{minHeight:"auto"}}},{props:({ownerState:t})=>t.dense,style:{minHeight:32,paddingTop:4,paddingBottom:4,...s.typography.body2,[`& .${D.root} svg`]:{fontSize:"1.25rem"}}}]}))),I=r.forwardRef(function(t,d){const h=J({props:t,name:"MuiMenuItem"}),{autoFocus:n=!1,component:v="li",dense:p=!1,divider:w=!1,disableGutters:u=!1,focusVisibleClassName:N,role:C="menuitem",tabIndex:S,className:b,...z}=h,i=r.useContext(P),x=r.useMemo(()=>({dense:p||i.dense||!1,disableGutters:u}),[i.dense,p,u]),m=r.useRef(null);K(()=>{n&&m.current&&m.current.focus()},[n]);const R={...h,dense:x.dense,divider:w,disableGutters:u},y=pe(h),k=le(m,d);let M;return h.disabled||(M=S!==void 0?S:-1),e.jsx(P.Provider,{value:x,children:e.jsx(ue,{ref:k,role:C,tabIndex:M,component:v,focusVisibleClassName:H(y.focusVisible,N),className:H(y.root,b),...z,ownerState:R,classes:y})})}),xe=`
:root{
  --brand-blue:#0328aeed;
  --brand-blue-700:#213bb1;
  --brand-blue-500:#041b64;
  --ink:#101114;
  --muted:#3c4b69;
  --bg:#fafafa;
  --border:#e8e8ee;
  --card:#fff;
  --radius:14px;
  --pill:999px;
  --shadow:0 6px 22px rgba(10,42,107,.08);
  --maxw: 1400px;
}

/* Page Shell */
.page{
  background:var(--bg);
  min-height:100vh;
  display:flex;
  flex-direction:column;
}

/* Container */
.container{
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 28px 22px;
}

@media (max-width: 768px){
  .container{
    max-width: 620px;
    padding: 20px 14px;
  }
}

@media (max-width: 480px){
  .container{
    max-width: 100%;
    padding: 16px 12px;
  }
}

/* HERO */
.explore-hero{
  text-align:center;
  padding:30px 12px;
}

.explore-hero h1{
  font-size:40px;
  font-weight:900;
  line-height:1.06;
  color:#0A2A6B;
  margin:0 0 6px;
}

.explore-hero p{
  color:#667085;
  margin:0;
}

/* PANEL */
.panel{
  background:#fff;
  border:1px solid var(--border);
  box-shadow:var(--shadow);
  border-radius:20px;
  padding:14px;
  margin:12px auto 18px;
}

/* Search tier rows */
.tier{
  display:flex;
  align-items:center;
  gap:10px;
}

.tier-1{
  display:flex;
  flex-direction:row;
  align-items:center;
  gap:10px;
  width:100%;
}

/* Mobile wraps selects and controls nicely */
@media (max-width: 680px){
  .tier-1{
    flex-wrap:wrap;
  }
}

/* Elastic Search Bar */
.input-wrap{
  position:relative;
  flex:0 1 240px;
  transition:flex-basis .25s ease;
  display:flex;
  align-items:center;
}

.input-wrap:focus-within{
  flex:1 1 100%;
}

.input{
  width:100%;
  height:44px;
  padding:0 108px 0 36px;
  border:1px solid var(--border);
  border-radius:var(--pill);
  font-size:.98rem;
  background:#fff;
  transition:.25s ease;
}

.input:focus{
  border-color:#97b3ff;
  outline:3px solid #e5edff;
}

.inline-btn{
  position:absolute;
  top:50%;
  right:44px;
  transform:translateY(-50%);
}

.clear-btn{
  position:absolute;
  top:50%;
  right:8px;
  transform:translateY(-50%);
}

/* Verified Label */
.switch-label{
  font-size:.96rem;
  color:#0f1222;
}

/* Heading */
.h3sub{
  font-weight:800;
  text-align:center;
  margin:10px 0;
  color:#0f172a;
}

/* DataTable search row */
.data-search-row{
  display:flex;
  justify-content:flex-end;
  margin: 4px 0 10px;
}

/* GRID */
.grid{
  display:grid;
  grid-template-columns:repeat(auto-fit, minmax(260px,1fr));
  gap:14px;
  margin-top:10px;
}

/* CARD (MUI hover + bounce + pointer) */
.card{
  background:#ffffff;
  border:1px solid var(--border);
  border-radius:16px;
  box-shadow:var(--shadow);
  padding:14px;
  min-height:96px;
  cursor:pointer;
  text-align:left;
  display:block;
  transition:
    transform .16s ease,
    background-color .16s ease,
    border-color .16s ease,
    box-shadow .16s ease,
    color .16s ease;
}

/* Base text/icon colors + smooth transitions */
.card h3,
.card p,
.card .icon{
  color:#0A2A6B;
  transition: color .18s ease;
}

/* HOVER EFFECT (minimal bounce + MUI blue + light-on text/icons) */
.card:hover{
  animation: card-bounce 0.25s ease-out 1;
  background:#1976d2;          /* Material UI primary */
  border-color:#1565c0;
  box-shadow:0 14px 34px rgba(21,101,192,.40);
}

.card:hover h3,
.card:hover p,
.card:hover .icon{
  color:#ffffff !important;    /* light-on color */
}

/* Minimal bounce hover animation */
@keyframes card-bounce {
  0%   { transform: translateY(0) scale(1); }
  30%  { transform: translateY(-3px) scale(1.02); }
  60%  { transform: translateY(1px) scale(1.01); }
  100% { transform: translateY(0) scale(1); }
}

.card .icon{
  font-size:1.3rem;
  margin-bottom:.3rem;
  display:inline-block;
}

.card p{
  font-size:.88rem;
  color:#6b7280;
  margin:0;
}

.grid-loading{
  margin-top:24px;
  display:flex;
  justify-content:center;
  min-height:120px;
}

/* Pagination */
.pagination{
  margin-top:18px;
  display:flex;
  justify-content:center;
  gap:6px;
  flex-wrap:wrap;
}

.page-info{
  margin-top:4px;
  text-align:center;
  font-size:.82rem;
  color:#6b7280;
}

footer{
  margin-top:auto;
}
`;function je(){const[s,t]=r.useState(""),[d,h]=r.useState([]),[n,v]=r.useState([]),[p,w]=r.useState(""),[u,N]=r.useState(""),[C,S]=r.useState(!1),[b,z]=r.useState(""),[i,x]=r.useState(1),m=20,[R,y]=r.useState(!0),k=r.useMemo(()=>({privacy:"/privacy",terms:"/terms",cookies:"/cookies",signup:"/signup",login:"/login",explore:"/explore",services:"/services",insights:"/insights",about:"/about",trial:"/trial",home:"/"}),[]);r.useEffect(()=>{(async()=>{try{const[a,o]=await Promise.all([fetch("/api/countries").then(l=>l.json()).catch(()=>({data:[]})),fetch("/api/business-sectors").then(l=>l.json()).catch(()=>({data:[]}))]);h(a?.data??[]),v(o?.data??[])}finally{y(!1)}})()},[]);const M=a=>{a.preventDefault();const o=new URLSearchParams;s&&o.set("q",s),p&&o.set("country",p),u&&o.set("sector",u),C&&o.set("verified","1"),window.location.assign(`/companies?${o.toString()}`)},Y=r.useMemo(()=>n.map(a=>a.title),[n]),g=r.useMemo(()=>{const a=b.trim().toLowerCase();return a?n.filter(o=>(o.title??"").toLowerCase().includes(a)||(o.description??"").toLowerCase().includes(a)):n},[b,n]);r.useEffect(()=>{x(1)},[b,n.length]);const c=Math.max(1,Math.ceil(g.length/m)),$=(i-1)*m,T=Math.min($+m,g.length),B=g.slice($,T),_=r.useMemo(()=>{const a=[];if(c<=7)for(let l=1;l<=c;l++)a.push(l);else{let l=Math.max(1,i-2),E=Math.min(c,i+2);l===1&&(E=5),E===c&&(l=c-4);for(let F=l;F<=E;F++)a.push(F)}return a},[i,c]);return e.jsxs("div",{className:"page",children:[e.jsx("style",{children:xe}),e.jsx(Q,{routes:k}),e.jsxs("div",{className:"container",children:[e.jsxs("header",{className:"explore-hero",children:[e.jsx("h1",{children:"Explore Businesses"}),e.jsx("p",{children:"This is the front door. Pick a sector or search; we’ll show the right companies."})]}),e.jsxs("form",{className:"panel",onSubmit:M,children:[e.jsxs("div",{className:"tier tier-1",children:[e.jsxs("div",{className:"input-wrap",children:[e.jsx("input",{className:"input",type:"search",placeholder:"Search businesses…",value:s,onChange:a=>t(a.target.value)}),e.jsx(f,{variant:"contained",size:"small",color:"primary",type:"submit",className:"inline-btn",children:"Search"}),e.jsx(f,{variant:"outlined",size:"small",className:"clear-btn",type:"button",onClick:()=>t(""),children:"✕"})]}),e.jsxs(U,{fullWidth:!0,size:"small",children:[e.jsx(V,{children:"Country"}),e.jsxs(A,{value:p,label:"Country",onChange:a=>w(a.target.value),children:[e.jsx(I,{value:"",children:e.jsx("em",{children:"Country"})}),d.map(a=>e.jsxs(I,{value:a.country_name,children:[a.flag_icon?`${a.flag_icon} `:"",a.country_name]},a.id))]})]}),e.jsxs(U,{fullWidth:!0,size:"small",children:[e.jsx(V,{children:"Sector"}),e.jsxs(A,{value:u,label:"Sector",onChange:a=>N(a.target.value),children:[e.jsx(I,{value:"",children:e.jsx("em",{children:"Sector"})}),Y.map((a,o)=>e.jsx(I,{value:a,children:a},o))]})]}),e.jsx(te,{control:e.jsx(re,{checked:C,onChange:a=>S(a.target.checked),color:"primary"}),label:"Verified only",className:"switch-label"}),e.jsx(f,{variant:"contained",color:"primary",type:"submit",children:"Search"})]}),e.jsx("div",{className:"tier",style:{justifyContent:"center",marginTop:6},children:e.jsx(f,{variant:"outlined",color:"primary",href:"/companies",children:"All Companies"})})]}),e.jsx("div",{className:"h3sub",children:"All Companies"}),e.jsx("div",{className:"data-search-row",children:e.jsx(oe,{size:"small",variant:"outlined",label:"Filter sectors",placeholder:"Type to filter by title or description…",value:b,onChange:a=>z(a.target.value)})}),R?e.jsx("div",{className:"grid-loading",children:e.jsx(ie,{})}):e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"grid",children:[B.map(a=>e.jsx(ne,{title:a.title,arrow:!0,placement:"top",children:e.jsxs("a",{className:"card",href:`/companies?sector=${encodeURIComponent(a.title)}&from=explore`,children:[e.jsx("span",{className:"icon",children:a.icon??"🧩"}),e.jsx("h3",{children:a.title}),e.jsx("p",{children:a.description??""})]})},a.id)),B.length===0&&e.jsx("div",{style:{textAlign:"center",gridColumn:"1 / -1",padding:"30px 0"},children:"No sectors match your filter."})]}),g.length>m&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"pagination",children:[e.jsx(f,{size:"small",onClick:()=>x(1),disabled:i===1,children:"«"}),e.jsx(f,{size:"small",onClick:()=>x(a=>Math.max(1,a-1)),disabled:i===1,children:"‹"}),_.map(a=>e.jsx(f,{size:"small",variant:a===i?"contained":"outlined",onClick:()=>x(a),children:a},a)),e.jsx(f,{size:"small",onClick:()=>x(a=>Math.min(c,a+1)),disabled:i===c,children:"›"}),e.jsx(f,{size:"small",onClick:()=>x(c),disabled:i===c,children:"»"})]}),e.jsxs("div",{className:"page-info",children:["Showing ",$+1,"–",T," of ",g.length," sectors"]})]}),g.length>0&&g.length<=m&&e.jsxs("div",{className:"page-info",children:["Showing ",g.length," of ",g.length," sectors"]})]})]}),e.jsx(W,{routes:k})]})}export{je as E};
