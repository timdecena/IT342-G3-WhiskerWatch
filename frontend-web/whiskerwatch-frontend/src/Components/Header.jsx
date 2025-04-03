import { Link, useNavigate } from 'react-router-dom';
import '../assets/header.css';

function Header({ setIsAuthenticated }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    navigate("/");
  };

  return (
    <header className="header">
      <h1 className="logo">WhiskerWatch</h1>
      <nav className="nav-links">
        <Link to="/homepage">Home</Link>
        <Link to="/post-pets">Post a Pet</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
      </nav>
    </header>
  );
}

export default Header;
