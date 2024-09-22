import "./Navbar.css";
import nav_logo from "../../assets/nav-logo.svg";
import navProfile from "../../assets/nav-profile.svg";

// eslint-disable-next-line react/prop-types
const Navbar = ({isAdmin, onLogout}) => {
  return (
    <div className="navbar">
      <img src={nav_logo} alt="" className="nav-logo" />
      {isAdmin ? (
        <>
          <span className="nav-welcome">Welcome, Admin!</span>
          <button className="nav-logout" onClick={onLogout}>
            Logout
          </button>
        </>
      ) : (
        <img src={navProfile} alt="" className="nav-profile" />
      )}
    </div>
  );
};

export default Navbar;
