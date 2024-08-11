import React, { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import Leaderboard from './Leaderboard';
import { useNavigate } from 'react-router-dom';
const URL_API = process.env.REACT_APP_URL_API;

const Dashboard = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Gọi API để cập nhật dữ liệu hoạt động từ Strava
        fetch(`${URL_API}api/activities/update`, { credentials: 'include' })
            .then(response => {
                if (response.status === 401) {
                    // Nếu người dùng chưa đăng nhập hoặc session đã hết hạn
                    navigate('/login'); // Hoặc điều hướng đến trang đăng nhập
                }
                return response.json();
            })
            .then(data => {
                console.log('Updated activities:', data);
            })
            .catch(error => console.log('Error updating activities:', error));
    }, [navigate]);

    return (
        <Container>
            <h2 className="my-4">Dashboard</h2>
            <Leaderboard />
        </Container>
    );
};

export default Dashboard;
