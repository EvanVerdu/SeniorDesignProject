import React from "react"
import "bootstrap/dist/css/bootstrap.min.css";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { logOut } from "../features/AuthService";


function App() {

    //Logs out the user
    const logout = event => {
        logOut();
        window.location.reload(false);
    }

  return (
    <div className="App" id="nav-barX">
        <Navbar collapseOnSelect expand="lg" bg="lightblue" variant="light">
            <Container>
                <Navbar.Brand className="button-6" href="/" id="TeamKingPinNavBar">Team KingPin</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto"></Nav>
                    <Nav>
                        <Nav.Link className="button-6" onClick={logout} id="LogOutNavBar">Log Out</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    </div>
  );
}

export default App;
