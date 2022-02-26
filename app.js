const dotenv = require('dotenv');
const express = require('express');
const cors = require("cors");
const app = express();

dotenv.config({path:'./config.env'});
require('./conn');
app.use(express.json());
app.use(cors());
const Registration = require('./schema/useSchema');
const AdRs = require('./schema/AddInfoSchema');
const AdRsCls = require('./schema/AddInfoClass');
app.use(require('./route/auth'));

const PORT = process.env.PORT;

app.get('/',(req,res)=>{
    res.send(`Hello wolrd from node`);
});
/*
app.get('/about',(req,res)=>{
    res.cookie("test","raj");
    res.send(`Hello wolrd from node`);
});
*/

app.listen(PORT,()=>{
    console.log(`server running at port: ${PORT}`);
});
