module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        date: Date,
        libelle: String,
        depense: Number
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