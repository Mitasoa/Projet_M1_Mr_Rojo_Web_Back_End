module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        idClient: String,
        idService: String,       
      },
      { timestamps: false }
    );
  
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const PreferenceService = mongoose.model("PreferenceService", schema);
    return PreferenceService;
  };