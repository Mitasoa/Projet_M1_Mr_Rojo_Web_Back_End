
const Service = require('../models/service.model'); 


async function getAllServices(req, res) {
  try {
    const services = await Service.find({etat:5});
    res.json(services);
  } catch (error) {
    res.status(500).send({message: error.message });
  }
}

async function createService(req, res) {
  try {
    const newService = new Service(req.body); 

    await newService.save();

    res.json(newService);
  } catch (error) {
    res.status(400).send({message: error.message });
  }
}

async function updateService(req, res) {
  try {
    const serviceId = req.params.id;
    const updatedService = req.body;

    await Service.findByIdAndUpdate(serviceId, updatedService);

    res.json({ message: 'Service mis à jour avec succès' });
  } catch (error) {
    res.status(400).send({message: error.message });
  }
}

async function deleteService(req, res) {
  try {
    const serviceId = req.params.id;

    await Service.findByIdAndUpdate(serviceId, {etat: 0});

    res.json({ message: 'Service supprimé avec succès' });
  } catch (error) {
    res.status(400).send({message: error.message });
  }
}

async function getServiceDetails(req, res) {
  try {
    const serviceId = req.params.id;

    const service = await Service.findById(serviceId);

    if (!service) {
      return res.status(404).send({ message: 'Service non trouvé' });
    }

    res.json(service);
  } catch (error) {
    res.status(500).send({message: error.message });
  }
}

async function searchService(req, res) {
  try {
    const { nom, prix, delai, commission } = req.query;

    const filter = {};

    if (nom) {
      filter.nom = { $regex: nom, $options: 'i' };
    }

    if (prix) {
      const [minPrice, maxPrice] = prix.split('..');
      filter.prix = {};
      if (minPrice) {
        filter.prix.$gte = Number(minPrice);
      }
      if (maxPrice) {
        filter.prix.$lte = Number(maxPrice);
      }
    }

    if (delai) {
      const [minDelay, maxDelay] = delai.split(':');
      filter.delai = {};
      if (minDelay) {
        filter.delai.$gte = Number(minDelay);
      }
      if (maxDelay) {
        filter.delai.$lte = Number(maxDelay);
      }
    }

    if (commission) {
      filter.commision = Number(commission);
    }
    console.log(filter)

    const services = await Service.find(filter);

    res.json(services);
  } catch (error) {
    res.status(500).send({message: error.message });
  }
}


module.exports = {
  getAllServices,
  createService,
  updateService,
  deleteService,
  getServiceDetails,
  searchService  
};