const db = require("../models");
const Device = db.device;
exports.create = async(req,res) => {
    const auth_token = req.token;
    if(!req.body.token_registration || !req.decoded.userId || !auth_token){
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }
    try{
        const device = await Device.register(req.decoded.userId,req.body.token_registration,auth_token);
        res.send(device);
    }
    catch(error){
        res.status(500).send({message:error.message})
    }
    
}