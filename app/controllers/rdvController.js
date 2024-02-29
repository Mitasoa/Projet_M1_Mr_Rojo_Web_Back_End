const models= require('../models');
const rdv = models.rdv;
const moment=require('moment');

const { ObjectId } = require('mongodb');
const { ERROR_STATUS_CODE } = require('../constant/Error.constant');
module.exports={
    getListRDV:(request,response)=>{
        const idClient=request.decoded.userId;
        models.rdv.find({idClient:idClient})
        .then(data=>{
            response.status(201).json({'data':data});
        })
        .catch(error=>{
            response.status(400).json({"message":error})
        })
    },
    
    getListAvailableEmploye:async(request,response)=>{
        try{
            const dateString = request.body.timechoosed; 
            const date = moment.utc(dateString, "YYYY-MM-DD HH:mm");
            const isoDateString = date.toISOString();
            console.log(isoDateString); 
            const filter = {
            'dateHeureFin': {
                '$gte': isoDateString
            }, 
            'dateHeureDebut': {
                '$lte': isoDateString
            }
            };
            
            const projection = { 'idEmploye': 1 };
            const result = await rdv.find(filter,projection); 
            if(result.length>0){            
                    const query={
                        _id: { $nin: result.map(id => mongoose.Types.ObjectId(id)) },
                        role:20,
                        etat:1
                    }
                    models.user.find(query)
                    .exec()
                    .then(res=>{
                        response.status(201).json({res})
                    })
                    .catch(err=>{
                        response.status(400).json({"message":err})
                    })
                } else {
                
                    models.user.find({role:20,etat:1})
                    .exec()
                    .then(res=>{
                        response.status(201).json({res})
                    })
                    .catch(err=>{
                        response.status(400).json({"message":err})
                    })
                }
        }
        catch(error){
            console.error(error);
            response.status(ERROR_STATUS_CODE.INTERNAL_SERVER_ERROR).json({"message":"Une erreur s'est produite"});
        }
        
    },
    setRdv(request,response){
        const rdvfinal=request.body.rdv;
        const rdv=new models.rdv({
            idClient: request.decoded.userId,
            idEmploye: rdvfinal.idEmploye,
            dateheuredebut: rdvfinal.dateHeureDebut,
            dateheurefin: rdvfinal.dateHeureFin,
            prix: rdvfinal.prix,
            idService:rdvfinal.idService
        })

        rdv.save()
        .then(res=>{
            response.status(201).json({res})
        })
        .catch(err=>{
            response.status(400).json({err})
        })
    },


    getListOffreSpecial(request,response){
        models.offreSpecial.find().exec()
        .then(res=>{
            response.status(201).json({'data':res});
        })
        .catch(err=>{
            response.status(400).json({err})
        })
    },


    deleteRdv(request,response){
        const idRdv=request.query.idRdv;
        const objectId = new ObjectId(idRdv);  
        models.rdv.deleteOne({_id:objectId}).exec()
        .then(res=>{
            response.status(201).json({'data':res});
        })
        .catch(err=>{
            response.status(400).json({err})
        })
    }
}