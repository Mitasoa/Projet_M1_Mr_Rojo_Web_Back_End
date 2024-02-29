var models=require('../models')
module.exports={
    SetPrefernceEmp:(request,response)=>{
        if(request.decoded.userId!==''&& request.body.idEmploye!==''){
            const pref= new models.preferenceEmploye({
                idClient: request.decoded.userId,
                idEmploye: request.body.idEmploye,    
            });
            pref.save()
            .then(pref=>{
                response.status(201).json({"message":"success"});
            })
            .catch(error=>{
                response.status(400).json({"message":error});
            })
        }else{
            response.status(400).json({"message":'missing idClient or idEmploye'});
        }     
    },
    RemovePreferenceEmp:(request,response)=>{
        console.log(request.query)
        if(request.decoded.userId!==''&& request.query.idEmploye!==''){
           models.preferenceEmploye.deleteOne({
                idClient:request.decoded.userId,
                idEmploye:request.query.idEmploye
            })
            .then(resp=>{
                response.status(201).json({"message":"success "+resp})
            })
            .catch(err=>{
                response.status(400).json({"message":error});
            })
            ;
            
        }
        else {
            response.status(400).json({"message":'missing idClient or idEmploye'});
        }
    },
    GetListPreferenceEmp(request,response){
        const idClient=request.decoded.userId;
      
        models.preferenceEmploye.find({idClient:idClient}).exec()
        .then(res=>{
           
            response.status(201).json({'data':res})
        })
        .catch(err=>{
            response.status(400).json({err});
        })
    }
}