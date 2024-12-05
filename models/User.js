const mongoose = require('mongoose');


const userSchema  = new mongoose.Schema ({
    email: {type: String, unique: true, required:true },
    phone: {type:   String, unique: true },
    otp: {type: String },
    otpExpiration: {type: Date }
});

const User = mongoose.model('User', userSchema);

mongoose.model.exports = User;


