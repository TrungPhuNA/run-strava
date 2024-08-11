import React from 'react';

function Home({ user }) {
    return (
        <div>
            {user ? (
                <h1>Welcome back, {user.profile.firstname}!</h1>
            ) : (
                <div>
                    <h1>Welcome to the Strava App</h1>
                    <p>Click <a href="http://localhost:5001/auth/strava">here</a> to authenticate with Strava.</p>
                </div>
            )}
        </div>
    );
}

export default Home;
