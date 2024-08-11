const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    stravaId: String,
    accessToken: String,
    refreshToken: String,
    profile: {
        id: String,
        firstname: String,
        lastname: String,
        profile_medium: String, // Avatar (hình ảnh kích thước trung bình)
    },
    totalDistance: Number,
    lastUpdated: Date
});

const User = mongoose.model('User', userSchema);

module.exports = User;
