import React, { useEffect, useState } from 'react';
import { ListGroup, Container, Row, Col, Image, DropdownButton, Dropdown } from 'react-bootstrap';

const Leaderboard = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [timeFrame, setTimeFrame] = useState('Overall');

    const URL_API = process.env.REACT_APP_URL_API;
    useEffect(() => {
        fetch(`${URL_API}api/leaderboard`, { credentials: 'include' })
            .then(response => response.json())
            .then(data => {
                console.info("===========[] ===========[] : ",data);
                setLeaderboard(data);
            })
            .catch(error => console.log('Error fetching leaderboard:', error));
    }, [timeFrame]);

    const handleTimeFrameChange = (selectedTimeFrame) => {
        setTimeFrame(selectedTimeFrame);
        fetch(`${URL_API}api/leaderboard?timeFrame=${selectedTimeFrame}`, { credentials: 'include' })
            .then(response => response.json())
            .then(data => {
                setLeaderboard(data);
            })
            .catch(error => console.log('Error fetching leaderboard:', error));
    };

    return (
        <Container>
            <h3 className="my-4">Challenge Leaderboard</h3>
            <DropdownButton id="dropdown-basic-button" title={`Timeframe: ${timeFrame}`}>
                <Dropdown.Item onClick={() => handleTimeFrameChange('Overall')}>Overall</Dropdown.Item>
                <Dropdown.Item onClick={() => handleTimeFrameChange('This Week')}>This Week</Dropdown.Item>
                <Dropdown.Item onClick={() => handleTimeFrameChange('This Month')}>This Month</Dropdown.Item>
                <Dropdown.Item onClick={() => handleTimeFrameChange('This Year')}>This Year</Dropdown.Item>
            </DropdownButton>
            <ListGroup variant="flush">
                {leaderboard.map((user, index) => (
                    <ListGroup.Item key={user.stravaId} className="d-flex align-items-center justify-content-between">
                        <Row className="align-items-center">
                            <Col xs={1}>
                                <span className="h5 mb-0">{index + 1}</span>
                            </Col>
                            <Col xs={2}>
                                <Image src={user.profile.photos[0]?.value} roundedCircle width={40} />
                            </Col>
                            <Col xs={6}>
                                <span className="h5">{user.profile.displayName}</span>
                            </Col>
                        </Row>
                        <Col xs={3} className="text-end">
                            <span className="h5">{isNaN(user.totalDistance) ? '0 km' : (user.totalDistance / 1000).toFixed(2) + ' km'}</span>
                        </Col>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </Container>
    );
};

export default Leaderboard;
