import React from "react";
import { Navbar, Nav } from "react-bootstrap";

const NavBar = () => {
  return (
    <Navbar style={{color: "white" }} variant="dark" expand="lg">
      <Navbar.Brand href="#" className="pl-3">   Connect4</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link href="/Home">Home</Nav.Link>
          <Nav.Link href="/Account">Account</Nav.Link>
          <Nav.Link href="/leaderboard">LeaderBoard</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavBar;
