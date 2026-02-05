import { Router } from "express";

import createAmenity from "../services/amesties/createAmenity.js";
import deleteAmenityById from "../services/amesties/deleteAmenityById.js";
import getAmenity from "../services/amesties/getAmenity.js";
import getAmenityById from "../services/amesties/getAmenityById.js";
import updateAmenityById from "../services/amesties/updateAmenityById.js";
import auth from "../middleware/auth.js";

const router = Router();

router.get('/', async (req, res) => {
    const { name } = req.query;
    const query = {}
    if (name) query.name = name

    try {
        const amenity = await getAmenity(query);
        if (amenity.length === 0) {
            res.status(404).json({ message: 'No amenities found' });
        } else {
            res.status(200).json(amenity);
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get("/:id", async (req, res) => {
    const { id } = req.params
    try {
        const amenity = await getAmenityById(id);
        if (!amenity) {
            res.status(404).json({ message: `amenity with id ${id} not found` });
        } else {
            res.status(200).json(amenity);
        }
    } catch (error) {
        res.status(500).send(error)
    }
});

router.post("/",auth , async (req, res) => {
    const { id , name } = req.body
    try {
        const amenity = await createAmenity({ id , name });
        res.status(201).json(amenity);
    } catch (error) {
        if (error.message.includes('Validation error')) {
            res.status(400).json({ error: error.message });
        } else if (error.message === 'An amenity with this name already exists.') {
            res.status(409).json({ error: error.message });
        } else if (error.message === 'Foreign key constraint failed.') {
            res.status(400).json({ error: error.message });
        } else if (error.message === 'Record to update not found.') {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

router.put('/:id',auth , async (req, res) => {
    const { id } = req.params
    const { name } = req.body
    try {
        const amenity = await updateAmenityById(id, { name });
        res.status(200).json(amenity);
    } catch(error){
        if (error.message === 'An amenity with this name already exists.') {
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
        const amenity = await deleteAmenityById(id)
        res.status(200).json({ message: `Amenity with id ${id} deleted successfully`, amenity });
    } catch(error) {
        if (error.message === 'Record to delete not found.') {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).send(error);
        }
    }
});

export default router