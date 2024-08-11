import React, { useEffect, useState } from 'react';
import { ListGroup, Container, Row, Col, Image, DropdownButton, Dropdown, Form, Button } from 'react-bootstrap';

const Leaderboard = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [timeFrame, setTimeFrame] = useState('Overall');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

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

    const handleDateFilter = () => {
        // Gọi API với thông tin startDate và endDate
        fetch(`${URL_API}api/leaderboard?startDate=${startDate}&endDate=${endDate}`, { credentials: 'include' })
            .then(response => response.json())
            .then(data => {
                setLeaderboard(data);
            })
            .catch(error => console.log('Error fetching leaderboard:', error));
    };

    return (
        <>
            <h3 className="my-4">Challenge Leaderboard</h3>
            <DropdownButton id="dropdown-basic-button" title={`Timeframe: ${timeFrame}`}>
                <Dropdown.Item onClick={() => handleTimeFrameChange('Overall')}>Overall</Dropdown.Item>
                <Dropdown.Item onClick={() => handleTimeFrameChange('This Week')}>This Week</Dropdown.Item>
                <Dropdown.Item onClick={() => handleTimeFrameChange('This Month')}>This Month</Dropdown.Item>
                <Dropdown.Item onClick={() => handleTimeFrameChange('This Year')}>This Year</Dropdown.Item>
            </DropdownButton>

            <Form className="my-4">
                <Row>
                    <Col xs={5}>
                        <Form.Group controlId="startDate">
                            <Form.Label>Start Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                    <Col xs={5}>
                        <Form.Group controlId="endDate">
                            <Form.Label>End Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                    <Col xs={2} className="align-self-end">
                        <Button variant="primary" onClick={handleDateFilter}>Filter</Button>
                    </Col>
                </Row>
            </Form>

            <ListGroup variant="flush">
                {leaderboard.map((user, index) => (
                    <ListGroup.Item key={user.stravaId} className="d-flex align-items-center justify-content-between">
                        <Col xs={2}>
                            <Row className="align-items-center">
                                <Col xs={5}>
                                    <span className="h5 mb-0">{index + 1}</span>
                                    <Image className={'ms-2'} src={user.profile.photos[0]?.value} roundedCircle width={40} height={40}
                                           borderRadius="50%"/>
                                </Col>
                                <Col xs={7}>
                                    <span className="h5">{user.profile.displayName}</span>
                                </Col>
                            </Row>
                        </Col>
                        <Col xs={3} className="text-end">
                            <span className="h5">{isNaN(user.totalDistance) ? '0 km' : (user.totalDistance / 1000).toFixed(2) + ' km'}</span>
                        </Col>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </>
    );
};

export default Leaderboard;
