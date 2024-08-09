import Link from 'next/link';
import { Navbar, Nav } from 'react-bootstrap';
import { useSession, signOut } from 'next-auth/react';
import TestSession from './TestSession';

const NavigationBar = () => {
  const { data: session, status } = useSession();

  console.log('NavigationBar - session:', session);
  console.log('NavigationBar - status:', status);

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      // Ako želiš da preusmeriš korisnika nakon odjave, možeš koristiti router.push
      // const router = useRouter();
      // router.push('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Navbar.Brand href="/">MyApp</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link as={Link} href="/" passHref key="home">Home</Nav.Link>
          {!session ? (
            <>
              <Nav.Link as={Link} href="/register" passHref key="register">Register</Nav.Link>
              <Nav.Link as={Link} href="/login" passHref key="login">Login</Nav.Link>
            </>
          ) : (
            <>
              <Nav.Link as={Link} href="/create" passHref key="create-blog">Create Blog</Nav.Link>
              <Nav.Link as={Link} href="/blogs" passHref key="blogs">Blogs</Nav.Link>
              <Nav.Link as={Link} href="/profile" passHref key="profile">Profile</Nav.Link>
              <Nav.Link as={Link} href="/follow" passHref key="follow">Follow Users</Nav.Link>
              <Nav.Link as={Link} href="/create-keypoint" passHref key="create-keypoint">Create Key Point</Nav.Link>
              <Nav.Link as={Link} href="/keypoints" passHref key="keypoints">Key Points</Nav.Link>
              <Nav.Link as={Link} href="/create-tour" passHref key="create-tour">Create Tour</Nav.Link>
              <Nav.Link as={Link} href="/tours" passHref key="tours">Tours</Nav.Link>
              <Nav.Link as={Link} href="/published" passHref key="published-tours">Published Tours</Nav.Link>
              <Nav.Link onClick={handleLogout} style={{ cursor: 'pointer' }} key="logout">Logout</Nav.Link>
            </>
          )}
        </Nav>
      </Navbar.Collapse>
      <TestSession />
    </Navbar>
  );
};

export default NavigationBar;
