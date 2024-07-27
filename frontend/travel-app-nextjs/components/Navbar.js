import Link from 'next/link';
import { Navbar, Nav } from 'react-bootstrap';

const NavigationBar = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Navbar.Brand href="/">MyApp</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link as={Link} href="/" passHref>Home</Nav.Link>
          <Nav.Link as={Link} href="/register" passHref>Register</Nav.Link>
          <Nav.Link as={Link} href="/login" passHref>Login</Nav.Link>
          <Nav.Link as={Link} href="/create" passHref>Create Blog</Nav.Link>
          <Nav.Link as={Link} href="/blogs" passHref>Blogs</Nav.Link> 
          <Nav.Link as={Link} href="/profile" passHref>Profile</Nav.Link>
          <Nav.Link as={Link} href="/follow" passHref>Follow Users</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavigationBar;
