/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import Link from 'next/link';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { signOut, signIn } from '../utils/authentication';
import { useAuth } from '../utils/context/authContext';

export default function NavBar() {
  const { user } = useAuth();

  return (
    <Navbar collapseOnSelect expand="lg" bg="light" variant="light">
      <Container>
        <Link passHref href="/" className="navbar-brand brand-cute">
          Tress Relief
        </Link>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            {/* CLOSE NAVBAR ON LINK SELECTION: https://stackoverflow.com/questions/72813635/collapse-on-select-react-bootstrap-navbar-with-nextjs-not-working */}
            <Link className="nav-link" href="/" style={{ color: 'black' }}>
              Services
            </Link>

            <Link className="nav-link" href="/stylists" style={{ color: 'black' }}>
              Meet the Stylists
            </Link>
          </Nav>
          {user ? (
            <Button variant="danger" onClick={signOut}>
              Sign Out
            </Button>
          ) : (
            <Button variant="primary" onClick={signIn}>
              Sign In
            </Button>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
