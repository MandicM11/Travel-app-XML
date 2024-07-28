import Link from 'next/link';
import { Navbar, Nav } from 'react-bootstrap';
import { useSession, signOut } from 'next-auth/react';
import TestSession from './TestSession';

const NavigationBar = () => {
  const { data: session, status } = useSession();
  console.log('NavigationBar - session:', session); // Dodaj log ovde
  console.log('NavigationBar - status:', status); // Dodaj log ovde

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Navbar.Brand href="/">MyApp</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link as={Link} href="/" passHref>Home</Nav.Link>
          {!session ? (
            <>
              <Nav.Link as={Link} href="/register" passHref>Register</Nav.Link>
              <Nav.Link as={Link} href="/login" passHref>Login</Nav.Link>
            </>
          ) : (
            <>
              <Nav.Link as={Link} href="/create" passHref>Create Blog</Nav.Link>
              <Nav.Link as={Link} href="/blogs" passHref>Blogs</Nav.Link>
              <Nav.Link as={Link} href="/profile" passHref>Profile</Nav.Link>
              <Nav.Link as={Link} href="/follow" passHref>Follow Users</Nav.Link>
              <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
            </>
          )}
        </Nav>
      </Navbar.Collapse>
      <TestSession />
    </Navbar>
  );
};

export default NavigationBar;
