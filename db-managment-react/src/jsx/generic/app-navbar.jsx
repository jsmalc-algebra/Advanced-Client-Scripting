import { Navbar, Nav, Container, Button } from 'react-bootstrap';

function AppNavbar() {
    let username;
    if (localStorage.getItem("user")) {
        username = localStorage.getItem("user");
    } else {username = "anonymous"}

    return (
        <Navbar expand="lg" variant="dark" bg="secondary" className="bg-gradient">
            <Container fluid>
                <Navbar.Brand href="#">DB managment app</Navbar.Brand>

                <Navbar.Toggle aria-controls="navbarContent" />

                <Navbar.Collapse id="navbarContent">
                    <Nav className="ms-auto align-items-lg-center gap-lg-2">
                        <Nav.Link href="/html/customers.html" id="home-btn">
                            Home
                        </Nav.Link>
                        <Nav.Item>
                            <span id="user-display">User: {username}</span>
                        </Nav.Item>
                        <Nav.Item>
                            <Button variant="danger" id="logout-btn" type="button">
                                Logout
                            </Button>
                        </Nav.Item>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default AppNavbar;