import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import Profile from './Profile';
import Dashboard from './Dashboard';
import Home from './Home';

function App() {
    const [user, setUser] = useState(null);
    const URL_API = process.env.REACT_APP_URL_API;
    useEffect(() => {
        fetch(`${URL_API}profile`, { credentials: 'include' })
            .then(response => response.json())
            .then(data => setUser(data))
            .catch(error => console.log('Error fetching user:', error));
    }, []);

    const handleLogout = () => {
        fetch(`${URL_API}logout`, { credentials: 'include' })
            .then(() => {
                setUser(null);
                window.location.href = '/'; // Điều hướng về trang chủ sau khi logout
            })
            .catch(error => console.log('Error logging out:', error));
    };

    return (
        <Router>
            <Navbar bg="dark" variant="dark" expand="lg">
                <Container>
                    <Navbar.Brand href="/">Strava App</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="/">Home</Nav.Link>
                            <Nav.Link href="/dashboard">Dashboard</Nav.Link>
                            <Nav.Link href="/profile">Profile</Nav.Link>
                        </Nav>
                        <Nav>
                            {user ? (
                                <>
                                    <Navbar.Text className="me-3">
                                        Signed in as: <a href="/profile">{user.profile.firstname} {user.profile.lastname}</a>
                                    </Navbar.Text>
                                    <Button variant="outline-light" onClick={handleLogout}>Logout</Button>
                                </>
                            ) : (
                                <Button variant="outline-light" href="http://localhost:5001/auth/strava">Login with Strava</Button>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Container className="mt-4">
                <Routes>
                    <Route path="/" element={<Home user={user} />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/profile" element={<Profile />} />
                </Routes>
            </Container>
        </Router>
    );
}

export default App;
