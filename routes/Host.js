import { Router } from "express";

import createHost from "../services/host/createHost.js";
import deleteHostById from "../services/host/deleteHostById.js";
import getHost from "../services/host/getHost.js";
import getHostById from "../services/host/getHostById.js";
import updateHostById from "../services/host/updateHostById.js";

import auth from "../middleware/auth.js";

const router = Router();

router.get('/', async (req, res) => {
    const { name } = req.query;
    const query = {};

    if (name) query.name = name;

    try {
        const host = await getHost(query);
        if (host.length === 0) {
            res.status(404).json({ message: 'No host found' });
        } else {
            res.status(200).json(host);
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params
    try {
        const host = await getHostById(id);
        if (!host) {
            res.status(404).json({ message: `Host with id ${id} not found` });
        } else {
            res.status(200).json(host);
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post('/', auth , async (req, res) => {
    const { id , username, password, name, email, phoneNumber, profilePicture, aboutMe } = req.body
    try {
        const host = await createHost({ id , username, password, name, email, phoneNumber, profilePicture, aboutMe });
        res.status(201).json(host);
    } catch (error) {
        if (error.message.includes('Validation error')) {
            res.status(400).json({ error: error.message });
        } else if (error.message === 'A host with this email or username already exists.') {
            res.status(409).json({ error: error.message });
        } else if (error.message === 'Foreign key constraint failed.') {
            res.status(400).json({ error: error.message });
        } else if (error.message === 'Host to update not found.') {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

router.put('/:id',auth , async (req, res) => {
    const { id } = req.params
    const { username, password, name, email, phoneNumber, profilePicture, aboutMe, listings } = req.body
    try {
        const host = await updateHostById(id, { username, password, name, email, phoneNumber, profilePicture, aboutMe, listings });
        res.status(200).json(host);
    } catch(error){
        if (error.message === 'A host with this username already exists.') {
            res.status(409).json({ error: error.message });
        } else if (error.message === 'Foreign key constraint failed.') {
            res.status(400).json({ error: error.message });
        } else if (error.message === 'Host to update not found.') {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).send(error);
        }
    }
});

router.delete('/:id',auth , async (req, res) => {
    const { id } = req.params;
    const { newHostId } = req.body;
    try {
        const host = await deleteHostById(id, newHostId)
        res.status(200).json({ message: `Amenity with id ${id} deleted successfully`, host });
    } catch(error) {
        console.error("Error deleting host:", error);
        if (error.message === 'Record to delete not found.') {
            res.status(404).json({ error: error.message });
        } else if (error.message === 'Cannot delete host as it is referenced by other records.') {
            res.status(409).json({ error: error.message });
        } else {
            res.status(500).send(error);
        }
    }
});

export default router