module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        idClient: String,
        idEmploye: String,       
      },
      { timestamps: false }
    );
  
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const PreferenceEmploye = mongoose.model("PreferenceEmploye", schema);
    return PreferenceEmploye;
  };