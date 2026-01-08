const jwt = require('jsonwebtoken');
const Joi = require('joi');
const asyncHandler = require('express-async-handler');
const User = require('../models/user');

const verifyAccessToken = asyncHandler(async (req, res, next) => {
    // 1. Rút gọn điều kiện bằng Optional Chaining (?.)
    if (req?.headers?.authorization?.startsWith('Bearer')) {
        const token = req.headers.authorization.split('')[1];

        // Dùng try-catch với jwt.verify để xử lý bất đồng bộ tốt hơn
        try{
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // 2. Lỗ hỏng bảo mật được khắc phục:
            // kiểm tra xem người dùng từ token có thực sự tồn tại trong DB không
            const user = await User.findById(decoded._id).select('role firstname lastname user_id');
            if(!user){
                return res.status(401).json({
                    success:false,
                    mes:"User not found, token is invalid."
                })
            }

            req.user = user; // Gán đối tượng user từ DB vào req
            next();
        }
        catch(error){
            return res.status(401).json({
                success:false,
                mes:"Invalid or expired access token."
            })
        }
    }else{
        return res.status(401).json({
            success:false,
            mes:"Authentication required!"
        });
    };
});

const isAdmin = asyncHandler(async(req,res,next)=>{
    // 3. Khắc phục lỗi crash: Luôn kiểm tra sự tồn tại của req.user
    if(!req.user){
        return res.status(401).json({
            success:false,
            mes:'Authentication required'
        });
    }
    // 4. Tránh Magic Number: giả sử role admin là 'Admin' thay vì '1'
    // Điều này cần đồng bộ với dữ liệu trong database 
    const {role} = req.user;
    if(role !=='1'){
        // 5. Dùng đúng Status Code: 403 Forbidden cho lỗi phân quyền
        return res.status(403).json({
            success:false,
            mes:'Access denied. Admin role required.'
        })
    }
    next();
});
module.exports={
    verifyAccessToken,
    isAdmin,
}