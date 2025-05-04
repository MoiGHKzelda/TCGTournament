import { NavLink } from "react-router-dom";

const Navbar = () => (
  <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
    <NavLink to="/home" className="navbar-brand">TCG Tournament</NavLink>
    <div className="collapse navbar-collapse">
      <ul className="navbar-nav ms-auto">
        <li className="nav-item">
          <NavLink to="/home" className="nav-link">Inicio</NavLink>
        </li>
      </ul>
    </div>
  </nav>
);

export default Navbar;
