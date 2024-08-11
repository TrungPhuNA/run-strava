const express = require('express');
const session = require('express-session');
const axios = require('axios');
const mongoose = require('mongoose');
const moment = require('moment');
const cors = require('cors');
require('dotenv').config();

const User = require('./models/User');

const PORT = process.env.PORT || 5012;

const app = express();
const URL_WEB = process.env.URL_WEB;

// Cấu hình CORS để cho phép các yêu cầu từ frontend
app.use(cors({
    origin: `${URL_WEB}`, // Cho phép frontend ở cổng 3000
    credentials: true
}));

mongoose.connect(`${process.env.URL_DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000, // Tăng thời gian chờ kết nối
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

mongoose.connection.on('error', err => {
    console.error('MongoDB connection error:', err);
});


// Cấu hình session
app.use(session({
    secret: process.env.SESSION_SECRET || 'your_session_secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

// Route để bắt đầu quá trình xác thực với Strava
app.get('/auth/strava', (req, res) => {
    const authUrl = `https://www.strava.com/oauth/authorize?client_id=${process.env.STRAVA_CLIENT_ID}&response_type=code&redirect_uri=${process.env.REDIRECT_URI}&scope=read,activity:read_all&approval_prompt=auto`;
    res.redirect(authUrl);
});

// Callback từ Strava sau khi người dùng xác thực
app.get('/auth/strava/callback', async (req, res) => {
    const { code } = req.query;

    try {
        const tokenResponse = await axios.post('https://www.strava.com/oauth/token', {
            client_id: process.env.STRAVA_CLIENT_ID,
            client_secret: process.env.STRAVA_CLIENT_SECRET,
            code,
            grant_type: 'authorization_code',
        });

        const { access_token, refresh_token, athlete } = tokenResponse.data;

        const user = {
            stravaId: athlete.id,
            accessToken: access_token,
            refreshToken: refresh_token,
            profile: athlete
        };

        req.session.user = user;  // Lưu thông tin người dùng vào session
        console.log('User saved to session:', req.session.user);

        // Điều hướng tới Dashboard thay vì Profile
        res.redirect(`${URL_WEB}/dashboard`);
    } catch (error) {
        console.error('Error exchanging token:', error.response.data);
        res.redirect('/');
    }
});

// Route profile để hiển thị thông tin người dùng
app.get('/profile', (req, res) => {
    if (!req.session.user) {
        return res.status(403).send('Unauthorized');
    }
    console.log('Authenticated user from session:', req.session.user);
    res.json(req.session.user);
});

// Thêm route để xử lý việc đăng xuất
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Failed to logout');
        }
        res.clearCookie('connect.sid'); // Xóa cookie session
        res.redirect('/'); // Redirect về trang chủ sau khi logout
    });
});


const refreshTokenIfNeeded = async (user) => {
    const tokenExpired = moment().isAfter(moment(user.tokenExpiry));

    if (tokenExpired) {
        try {
            const response = await axios.post('https://www.strava.com/oauth/token', {
                client_id: process.env.STRAVA_CLIENT_ID,
                client_secret: process.env.STRAVA_CLIENT_SECRET,
                grant_type: 'refresh_token',
                refresh_token: user.refreshToken,
            });

            const { access_token, refresh_token, expires_at } = response.data;

            // Cập nhật access token, refresh token và thời hạn mới
            user.accessToken = access_token;
            user.refreshToken = refresh_token;
            user.tokenExpiry = moment.unix(expires_at).toDate();

            await User.findOneAndUpdate(
                { stravaId: user.stravaId },
                {
                    accessToken: access_token,
                    refreshToken: refresh_token,
                    tokenExpiry: user.tokenExpiry
                }
            );
            return access_token;
        } catch (error) {
            console.error('Failed to refresh access token:', error);
            throw error;
        }
    }

    return user.accessToken;
};

app.get('/api/activities/update', async (req, res) => {
    if (!req.session.user || !req.session.user.accessToken) {
        return res.status(401).json({ error: 'User not authenticated or session expired' });
    }

    try {
        const accessToken = await refreshTokenIfNeeded(req.session.user);

        const response = await axios.get('https://www.strava.com/api/v3/athlete/activities', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            params: {
                per_page: 200
            }
        });

        const activities = response.data;
        const totalDistance = activities.reduce((total, activity) => total + activity.distance, 0);

        await User.findOneAndUpdate(
            { stravaId: req.session.user.stravaId },
            { totalDistance, lastUpdated: new Date() },
            { new: true }
        );

        res.json({ totalDistance });
    } catch (error) {
        console.error('Error updating activities:', error);
        res.status(500).json({ error: 'Failed to update activities' });
    }
});

const calculateTotalDistance = (activities) => {
    return activities.reduce((total, activity) => total + activity.distance, 0);
};

app.get('/api/leaderboard', async (req, res) => {
    try {
        const { timeFrame } = req.query;

        let startDate;
        switch (timeFrame) {
            case 'This Week':
                startDate = moment().startOf('week').toDate();
                break;
            case 'This Month':
                startDate = moment().startOf('month').toDate();
                break;
            case 'This Year':
                startDate = moment().startOf('year').toDate();
                break;
            default:
                startDate = null; // Trả về tổng thể nếu không có timeFrame
        }

        let users;
        if (startDate) {
            users = await User.find({ lastUpdated: { $gte: startDate } }).sort({ totalDistance: -1 });
        } else {
            users = await User.find().sort({ totalDistance: -1 });
        }

        res.json(users);
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({ error: 'Failed to fetch leaderboard' });
    }
});


// Khởi động server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
