// // components/common/BreadcrumbsNav.jsx
// import { Link, useLocation } from "react-router-dom";

// export default function BreadcrumbsNav() {
//   const location = useLocation();
//   const paths = location.pathname.split("/").filter(Boolean);

  

//   return (
//     <nav className="breadcrumb">
//       <Link to="/">Home</Link>
//       {paths.map((p, i) => {
//         const url = "/" + paths.slice(0, i + 1).join("/");
//         return (
//           <span key={i}>
//             {" / "}
//             <Link to={url}>{p.replace("-", " ")}</Link>
//           </span>
//         );
//       })}
//     </nav>
//   );
// }

export default function BreadcrumbsNav() {
  const pathname = window.location.pathname; // ✅ no Router needed
  const paths = pathname.split("/").filter(Boolean);

  return (
    
    <nav className="breadcrumb">
      <a href="/">Home</a>
      {paths.map((p, i) => {
        const url = "/" + paths.slice(0, i + 1).join("/");
        return (
          <span key={i}>
            {" / "}
            <a href={url}>{p.replace("-", " ")}</a>
          </span>
        );
      })}
    </nav>
  );
}

const style = `.breadcrumb{
  display:flex;
  align-items:center;
  flex-wrap:wrap;
  gap:8px;
  margin:0 0 18px;
  padding:12px 16px;
  background:#fff;
  border:1px solid #e5e7eb;
  border-radius:14px;
  box-shadow:0 4px 14px rgba(15,23,42,.06);
  font-size:13px;
  text-transform: uppercase;
  letter-spacing: .6px;
}
.breadcrumb a{
  color:#2d4fbf;
  text-decoration:none;
  font-weight:600;
  transition:color .18s ease;
}
.breadcrumb a:hover{
  color:#0A2A6B;
  text-decoration:underline;
}
.breadcrumb .sep{
  color:#94a3b8;
  font-weight:700;
}
.breadcrumb .current{
  color:#0f172a;
  font-weight:800;
}`;
