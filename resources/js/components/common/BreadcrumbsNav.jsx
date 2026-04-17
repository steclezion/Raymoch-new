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
