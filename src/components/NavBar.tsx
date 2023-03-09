import React from 'react';
import './NavBar.css';

interface NavBarProps {
  title: string;
}

const NavBar: React.FC<NavBarProps> = ({ title }) => {
  return (
    <nav className="navbar">
      <div className="navbar-title">{title}</div>
      <ul className="nav-links">
        <li><a href="/">Home</a></li>
        <li><a href="/leaderboard">Leaderboard</a></li>
      </ul>
    </nav>
  );
};

export default NavBar;
