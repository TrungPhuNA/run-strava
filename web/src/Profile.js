import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, ListGroup } from 'react-bootstrap';

const Profile = () => {
    const location = useLocation();
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Lấy thông tin từ query params
        const queryParams = new URLSearchParams(location.search);
        const stravaId = queryParams.get('stravaId');

        // Fetch thông tin người dùng từ backend
        if (stravaId) {
            fetch(`http://localhost:5001/profile`, { credentials: 'include' })
                .then(response => response.json())
                .then(data => setUser(data));
        }
    }, [location]);

    return (
        <div>
            {user ? (
                <Card style={{ width: '18rem' }}>
                    <Card.Img variant="top" src={user.profile.profile} />
                    <Card.Body>
                        <Card.Title>{user.profile.firstname} {user.profile.lastname}</Card.Title>
                        <Card.Text>
                            {user.profile.city}, {user.profile.country}
                        </Card.Text>
                    </Card.Body>
                    <ListGroup className="list-group-flush">
                        <ListGroup.Item>Gender: {user.profile.sex}</ListGroup.Item>
                        <ListGroup.Item>Premium: {user.profile.premium ? 'Yes' : 'No'}</ListGroup.Item>
                    </ListGroup>
                </Card>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default Profile;
