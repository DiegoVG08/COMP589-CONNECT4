import React from "react";
import { Nav, NavLink, NavMenu } 
    from "./NavbarElement";


//navbar displays  menu that can be use for leaderBoard and login that will pop up a option to create a new account 
const Navbar = () => {
    return (    <>
            <Nav>
              <NavMenu>
              <NavLink to="/Home" activeStyle>
                  Home
                </NavLink>
                <NavLink to="/Account" activeStyle>
                  Account
                </NavLink>
                <NavLink to="/leaderboard" activeStyle>
                  Leader Board
                  </NavLink>
              </NavMenu>
            </Nav>
          </>
       
    );
}
// this allow you to use in another classes 

export default Navbar;

