import React from "react";
import { Navbar, Nav } from "react-bootstrap";

const NavBar = () => {
  return (
    <Navbar style={{ color: "white", borderBottom: "px solid #ccc" }} variant="dark" expand="lg">
      <Navbar.Brand href="#" className="pl-3" style={{ font: "Roboto", fontSize: 21 }}>
       <strong> Connect4 </strong>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link href="/Home" style={{ font:  " Roboto" }}>
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
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavBar;

