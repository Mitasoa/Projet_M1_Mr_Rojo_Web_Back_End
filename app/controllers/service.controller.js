
const Service = require('../models/service.model'); 


async function getAllServices(req, res) {
  try {
    const services = await Service.find({etat:5});
    res.json(services);
  } catch (error) {
    res.status(500).json({ "error": error });
  }
}
const fs = require('fs');
const path = require('path');

async function uploadImage(base64image) {
    try {
        const matches = base64image.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
        if (matches.length !== 3) {
            throw new Error('Invalid input string');
        }

        const response = {
            type: matches[1],
            data: Buffer.from(matches[2], 'base64')
        };

        const decodedImg = response;
        const imageBuffer = decodedImg.data;
        const type = decodedImg.type;

        let extension;
        if (type === 'image/jpeg') {
            extension = 'jpg';
        } else if (type === 'image/png') {
            extension = 'png';
        } else {
            throw new Error('Unsupported image type');
        }

        const fileName = `image_${Date.now()}.${extension}`;
        const filePath = path.join(__dirname, '../uploads', fileName);

        await fs.promises.writeFile(filePath, imageBuffer);

        return fileName;
    } catch (error) {
        throw error;
    }
}

async function createService(req, res) {
  try {
    const newServiceData = req.body;
    const newService = new Service(newServiceData);
    if (newServiceData.image) {
      const fileName = await uploadImage(newServiceData.image);
      newService.image = fileName;
    }

    await newService.save()

    res.status(201).json(newService);
  } catch (error) {
    console.log(error)
    res.status(400).json({ "error": error.message });
  }
}

async function updateService(req, res) {
  try {
    const serviceId = req.params.id;
    const updatedService = req.body;
    if(updatedService.image){
      const fileName = await uploadImage(updatedService.image);
      updatedService.image = fileName;
    }
    await Service.findByIdAndUpdate(serviceId, updatedService);

    res.status(200).json({ message: 'Service mis à jour avec succès' });
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: 'Erreur lors de la mise à jour du service' });
  }
}

async function deleteService(req, res) {
  try {
    const serviceId = req.params.id;

    await Service.findByIdAndUpdate(serviceId, {etat: 0});

    res.status(200).json({ message: 'Service supprimé avec succès' });
  } catch (error) {
    res.status(400).json({ erreur: error.message });
  }
}

async function getServiceDetails(req, res) {
  try {
    const serviceId = req.params.id;

    const service = await Service.findById(serviceId);

    if (!service) {
      return res.status(404).json({ error: 'Service non trouvé' });
    }

    res.json(service);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des détails du service' });
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
    res.status(500).json({ error: 'Erreur lors de la recherche des services' });
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
