const jwt = require("jsonwebtoken");
const User = require("../schema/useSchema");


const Authenticate = async (req,res,next) => {

    try{
        const token = req.cookies.jwtoken;
        const verifyToken = jwt.verify(token, process.env.SK);

        const rootUser = await User.findOne({_id:verifyToken._id, "tokens.token":token});
        if(!rootUser) { throw new Error('User not found') }
        req.token = token;
        req.rootUser = rootUser;
        req.userID = rootUser._id;

        next();

    } catch(err) {
        res.status(401).send("Unauthorised");
        console.log(err);
    }

}

module.exports = Authenticate;