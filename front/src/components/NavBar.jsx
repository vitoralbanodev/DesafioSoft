import "../css/NavBar.css";
import { Link, useMatch, useResolvedPath } from "react-router-dom";
import logo from "../assets/logo.png";
 
const NavBar = () => (
  <>
    <nav>
      <Link to="/">
        <img id="logo" src={logo} alt="logo" />
      </Link>
      <ul>
        <CustomLink to="/products">Products</CustomLink>
        <CustomLink to="/categories">Categories</CustomLink>
        <CustomLink to="/history">History</CustomLink>
      </ul>
    </nav>
  </>
);

function CustomLink({ to, children, ...props }) {
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvedPath.pathname, end: true });
  return (
    <li className={isActive ? "active" : ""}>
      <Link to={to} {...props}>
        {children}
      </Link>
    </li>
  );
}

export default NavBar;
