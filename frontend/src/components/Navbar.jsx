// import { Link } from "react-router-dom";

// const Navbar = () => {
//   return (
//     <nav>
//       <Link to={"/"}>Home</Link>
//       <Link to={"/apply"}>Apply</Link>
//       <Link to={"/login"}>Login</Link>
//       <Link to={"/register"}>Register</Link>
//       <Link to={"/dashboard-executive"}>Executive</Link>
//       <Link to={"/dashboard-expert"}>Expert</Link>
//     </nav>
//   );
// };

// export default Navbar;
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav
      style={{
        padding: "1rem",
        backgroundColor: "#222",
        color: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {!user ? (
        <div>
          <Link to="/" style={{ marginRight: "1rem", color: "#fff" }}>
            Home
          </Link>
          <Link to="/login" style={{ marginRight: "1rem", color: "#fff" }}>
            Login
          </Link>
          <Link to="/register" style={{ color: "#fff" }}>
            Register
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{ marginRight: "1rem" }}>
            {user.firstName || user.name?.split(" ")[0]}{" "}
            {user.lastName || user.name?.split(" ")[1] || ""}
          </span>
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: "#f44336",
              color: "#fff",
              border: "none",
              padding: "0.4rem 1rem",
              cursor: "pointer",
              borderRadius: "4px",
            }}
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
