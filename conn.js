const mongoose = require('mongoose');

const DB = process.env.DATABASE;

mongoose.connect(DB,{
    useNewUrlParser: true,
}).then(()=>{
    console.log(`connection successful`);
}).catch((err)=>console.log(`Error in connection`));