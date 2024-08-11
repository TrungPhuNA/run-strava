import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Logout({ setUser }) {
    const navigate = useNavigate();
    const URL_API = process.env.REACT_APP_URL_API;
    useEffect(() => {
        fetch(`${URL_API}logout`, { credentials: 'include' })
            .then(() => {
                setUser(null);
                navigate('/'); // Điều hướng về trang chủ sau khi logout
            })
            .catch(error => console.log('Error logging out:', error));
    }, [navigate, setUser]);

    return <p>Logging out...</p>;
}

export default Logout;
