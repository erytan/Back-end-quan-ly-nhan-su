const express = require('express');
require('dotenv').config({ debug: false });
const dbConnect = require('./config/dbConnect');
const app = express();
const port = process.env.PORT || 8080;

dbConnect();
app.listen(port, '0.0.0.0', () => {
    console.log(`Backend chạy tại port ${port} - Mày phải cố lên!!!!`);
});