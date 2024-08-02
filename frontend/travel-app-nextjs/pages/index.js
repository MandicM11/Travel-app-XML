  import Link from 'next/link';
  import { Container, Navbar, Nav } from 'react-bootstrap';
  import 'bootstrap/dist/css/bootstrap.min.css'; // Uvezi Bootstrap stilove

  const Index = () => {
    return (
      <div>
        <Navbar bg="primary" variant="dark" expand="lg">
          <Container>
            <Navbar.Brand href="/">MyApp</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link href="/register">Register</Nav.Link>
                <Nav.Link href="/login">Login</Nav.Link>
                <Nav.Link href="/create">Create a new Blog</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <Container>
          <h1>Welcome to the App</h1>
        </Container>
      </div>
    );
  };

  export default Index;
