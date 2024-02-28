module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        nom: String,
        prix: Number,
        delai: Number,
        commission: Number,
        etat: Number
      },
      { timestamps: true }
    );
  
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const Service = mongoose.model("service", schema);
    return Service;
  };