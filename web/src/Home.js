import React from 'react';
const URL_API = process.env.REACT_APP_URL_API;
function Home({ user }) {
    return (
        <div>
            {user ? (
                <h1>Welcome back, {user.profile.firstname}!</h1>
            ) : (
                <div>
                    <h1>Welcome to the Strava App</h1>
                    <p>Click <a href={`${URL_API}auth/strava`}>here</a> to authenticate with Strava.</p>
                </div>
            )}
        </div>
    );
}

export default Home;
