var models=require('../models')
module.exports={
    getListHoraire:(request,response)=>{
        models.horaire.find().exec()
        .then(res=>{
            response.status(201).send(res);
        })
        .catch(error=>{
            response.status(400).send(error);
        })
    }
}