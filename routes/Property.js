import { Router } from "express";

import createProperty from "../services/property/createProperty.js";
import deletePropertyById from "../services/property/deletePropertyById.js";
import getProperty from "../services/property/getProperty.js";
import getPropertyById from "../services/property/getPropertyById.js";
import updatePropertyById from "../services/property/updatePropertyById.js";

import auth from "../middleware/auth.js";

const router = Router();

router.get('/', async (req, res) => {
    const { location, pricePerNight, amenities } = req.query;
    
    try {
        const properties = await getProperty({ location, pricePerNight, amenities });
        if (properties.length === 0) {
            res.status(404).json({ message: 'No properties found' });
        } else {
            res.status(200).json(properties);
        }

    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params
    try {
        const property = await getPropertyById(id);
        if (!property) {
          res.status(404).json({ message: `Properties with id ${id} not found` });
        } else {
          res.status(200).json(property);
        }
    } catch (error) {
        console.error("Error fetching property by ID:", error);
        res.status(500).send(error);
    }
});

router.post('/',auth , async (req, res) => {
    const { id, title, description, location, pricePerNight, bedroomCount, bathRoomCount, maxGuestCount, hostId, rating } = req.body
    try {
        const property = await createProperty({ id , title, description, location, pricePerNight, bedroomCount, bathRoomCount, maxGuestCount, hostId, rating });
        res.status(201).json(property);
    } catch (error) {
        console.error("Error creating property:", error);
        if (error.message.includes('Validation error')) {
            res.status(400).json({ error: error.message });
        } else if (error.message === 'A property with this ID already exists.') {
            res.status(409).json({ error: error.message });
        } else if (error.message === 'Foreign key constraint failed.') {
            res.status(400).json({ error: error.message });
        } else if (error.message === 'Record to update not found.') {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: "Error creating property", details: error.message });
        }
    }
});

router.put('/:id',auth , async (req, res) => {
    const { id } = req.params
    const { title, description, location, pricePerNight, bedroomCount, bathRoomCount, maxGuestCount, hostId, rating } = req.body
    try {
        const property = await updatePropertyById(id, { title, description, location, pricePerNight, bedroomCount, bathRoomCount, maxGuestCount, hostId, rating });
        res.status(200).json(property);
    } catch(error){
        console.error("Error updating property:", error);
        if (error.message === 'A property with this ID already exists.') {
            res.status(409).json({ error: error.message });
        } else if (error.message === 'Foreign key constraint failed.') {
            res.status(400).json({ error: error.message });
        } else if (error.message === 'Record to update not found.') {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json(error);
        }
    }
});

router.delete('/:id',auth , async (req, res) => {
    const { id } = req.params
    try {
        const property = await deletePropertyById(id)
        res.status(200).json({ message: `Amenity with id ${id} deleted successfully`, property });
    } catch(error) {
        console.error("Error deleting property:", error);
        if (error.message === 'Record to delete not found.') {
            res.status(404).json({ error: error.message });
        } else if (error.message === 'Cannot delete property as it is referenced by other records.') {
            res.status(409).json({ error: error.message });
        } else {
            res.status(500).send(error);
        }
    }
});

export default router