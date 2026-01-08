const mongoose = require("mongoose")

const attendanceSchema = new mongoose.Schema({

    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required:true,
    },
    date:{
        type:String,
        required:true
    },
    checkIn:{
        time:{type:Date},
        location: {type:String},
        device: {type:String},
    },
    checkOut:{
        time:{type:Date},
        location:{type:String},
        device:{type:String},
    },
    status:{
        type:String,
        enum:['present','absent','late','early_leave'],
        default:'present'
    },  
    workHours:{
        type:Number,
        default:0,
    },
    notes:{
        type:String,
    }
},{
    timestamp:true
});
attendanceSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);