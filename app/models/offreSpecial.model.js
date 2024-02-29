module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        idService: {
          type:String,
          required: true
        },
        reduction: {
          type : Number,
          required : true,
          validate: {
            validator: function(value) {
                return value > 0;
            },
            message: "La reduction doit être supérieur à 0"
          }
        },
        dateDebut:{
          type: Date,
          required: true,
          validate: {
            validator : function(value) {
              return value < this.dateFin;
            },
            message: "La date de debut doit être inferieur à la date fin"
          }
        } ,
        dateFin:{
          type:Date,
          required: true,
          validate: {
              validator: function(value) {
                  return value > this.dateDebut;
              },
              message: "La date de fin doit être supérieur à la date debut"
          }
        } 
      },
      { timestamps: true }
    );
  
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const OffreSpecial = mongoose.model("offreSpecial", schema);
    return OffreSpecial;
  };