module.exports = (mongoose) => {
  const rdvSchema = mongoose.Schema(
    {
      idService: {
        type: String,
        required: false,
      },
      idEmploye: {
        type: String,
        required: true,
      },
      idClient: {
        type: String,
        required: false,
      },
      dateheuredebut: {
        type: Date
      },
      dateheurefin: {
        type: Date
      },
      status: {
        type: Number,
        required: true,
        //-10 indisponibilité 10 rdv
        enum: [-10, 10, 0],
        default: 10,
      },
      etat: {
        type: Number,
        //-10 annnulé  1 en cours 10 terminé
        enum: [-10, 1, 10],
        default: 1,
      },
      prix: {
        type: Number,
        require: true
      }
    },
    { timestamps: true }
  );

  rdvSchema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Rdv = mongoose.model("rdv", rdvSchema);
  return Rdv;
};