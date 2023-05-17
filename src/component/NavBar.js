import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { auth } from "./Firebase";



const NavBar = (props) => {
  const { user } = props;


  const handleLogout = () => {
    auth.signOut();
  };

  
  return (
    <Navbar style={{ color: "white", borderBottom: "2.5px solid #ccc" }} variant="dark" expand="lg" user={user}>
      <Navbar.Brand href="#" className="pl-3" style={{ font: "Roboto", fontSize: 21 }}>
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
         {user && user.username ? (
          <Nav className="ml-auto">
            <Nav.Link>
              <p className="text-white mb-0 mr-2">Hello, {user.username}!</p>
              <button onClick={handleLogout} className="btn btn-outline-light">
                Logout
              </button>
          </Nav.Link>
          </Nav>
           ) : null}
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavBar;
