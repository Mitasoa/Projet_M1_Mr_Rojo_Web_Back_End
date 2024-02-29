module.exports =  mongoose => {
    
    var schema = mongoose.Schema(
      {
        token_registration : {
          type:String,
          required:true
        },
        userId:{
          type:String,
          required:true
        } ,
        auth_token:{
          type: String,
          required:true
        } 
      },
      { timestamps: true }
    );
  
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const Device = mongoose.model("device", schema);
    //enregistrer un appareil
    Device.register = async(userId,token_registration,auth_token) =>{
      const db = require('./');
      const User = db.user;
      const user =await User.findById(userId);
      var response = null;
      if(user){
        const filter = ({
          token_registration: token_registration,
          userId: userId
        })
        const device = await Device.findOne(filter);
        if(device){
            response =await  Device.findByIdAndUpdate(device.id, { $set: {
              token_registration: token_registration,
              userId: userId,
              auth_token: auth_token
          }}, { useFindAndModify: false });
        }
        else{
            const device_data = new Device({
            auth_token: auth_token,  
            token_registration: token_registration,
            userId: userId
            
          });
            response = await device_data.save();
        }
      }
      else{
          throw new Error("L'utilisateur que vous essayez d'enregistrer n'existe pas" );
      }
      return response;
    }
    return Device;
  };