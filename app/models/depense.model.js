module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        date: {
          type:Date,
          required: true
        },
        libelle:{
          type: String,
          require: true
        },
        depense:{
          type:Number,
          require: true,
          validate: function(value){
              return value > 0;
          },
          message: "Depense doit être supérieur à 0"
        }
      },
      { timestamps: true }
    );
  
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const Depense = mongoose.model("depense", schema);
    return Depense;
  };