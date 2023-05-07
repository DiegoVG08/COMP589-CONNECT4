import React from "react";
import { Navbar, Nav } from "react-bootstrap";

const NavBar = ({ user, handleLogout }) => {
  return (
    <Navbar
      style={{ color: "white", borderBottom: "px solid #ccc" }}
      variant="dark"
      expand="lg"
      user={user}
    >
      <Navbar.Brand
        href="#"
        className="pl-3"
        style={{ font: "Roboto", fontSize: 21 }}
      >
        <strong> Connect4 </strong>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link href="/Home" style={{ font: " Roboto" }}>
            Home
          </Nav.Link>
          <Nav.Link href="/Account" style={{ font: "Roboto" }}>
            Account
          </Nav.Link>
          <Nav.Link href="/leaderboard" style={{ font: "Roboto" }}>
            Leaderboard
          </Nav.Link>
          <Nav.Link href="/Game" style={{ font: "Roboto" }}>
            Game
          </Nav.Link>
        </Nav>
        {user && user.username && (
          <Nav.Link>
            <p>Hello, {user.username}!</p>
            <Nav.Link onClick={handleLogout} className="nav-link">
              Logout
            </Nav.Link>
          </Nav.Link>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavBar;