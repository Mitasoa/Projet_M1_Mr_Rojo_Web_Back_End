const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    nom: {
      type: String,
      unique: true,
      required: true,
    },
    prix: {
      type: Number,
      min: 0,
    },
    delai: {
      type: Number, 
      validate: {
        validator: function (value) {
          return value > 0;
        },
        message: 'Le délai doit être au supérieur à 0',
      },
    },
    commission: Number,
    etat: {
        type: Number,
        default: 5
    }
  });

  serviceSchema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;