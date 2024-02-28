module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        idService: String,
        reduction: Number,
        dateDebut: Date,
        dateFin: Date
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