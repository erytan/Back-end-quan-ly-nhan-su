const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const { string } = require('joi');
const userSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
        unique: true,
    },
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: [1, 2, 3],
        default: "2",
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    base_salary:{
        type: Number,
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other']
    },
    birthday: {
        type: Date
    },
    join_date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'probation'],
        default: 'probation'
    },
    manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users' // Tham chiếu đến chính Model này
    },
    bank_info: {
        bank_name: String,
        account_number: String,
        account_holder: String
    },
    avatar: {
        type: String,
        default: 'https://bit.ly/default-avatar'
    },
    department: {
        type: String,
    },
    isOnline:{
        type:Boolean,
    },
    mobile: {
        type: String,
        sparse: true,
        unique: true,
    },
    deviceSessions: [
        {
            deviceId: { type: String },
            lastLogout: { type: Date, default: null }
        }
    ],
    password: {
        type: String,
        required: true,
    },
    passwordResetOTP: {
        type: String,
    },
    passwordResetExpires: {
        type: Date,
    },
}, {
    timestamps: true
});
// Middleware để mã hóa mật khẩu trước khi lưu
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
       return next();
    }
 try {
        // Tạo salt bất đồng bộ (không chặn luồng)
        const salt = await bcrypt.genSalt(10);
        // Hash mật khẩu bất đồng bộ
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
})
// Phương thức để so sánh mật khẩu
userSchema.methods = {
    isCorrectPassword: async function (password) {
        return await bcrypt.compare(password, this.password);
    }
}
module.exports = mongoose.model('users', userSchema);