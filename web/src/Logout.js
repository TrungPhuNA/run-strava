import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Logout({ setUser }) {
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:5001/logout', { credentials: 'include' })
            .then(() => {
                setUser(null);
                navigate('/'); // Điều hướng về trang chủ sau khi logout
            })
            .catch(error => console.log('Error logging out:', error));
    }, [navigate, setUser]);

    return <p>Logging out...</p>;
}

export default Logout;
