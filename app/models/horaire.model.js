module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        heureMatinDebut: String,
        heureMatinFin: String,
        heureMidiDebut: String,
        heureMidiFin: String,
        dow: Number
      },
      { timestamps: true }
    );
  
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const Horaire = mongoose.model("horaire", schema);
    return Horaire;
  };