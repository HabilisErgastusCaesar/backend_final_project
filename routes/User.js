import { Router } from "express";
import { PrismaClient } from "@prisma/client";

import createUser from "../services/user/createUser.js";
import deleteUserById from "../services/user/deleteUserbyId.js";
import getUser from "../services/user/getUser.js";
import getUserById from "../services/user/getUserbyId.js";
import updateUserById from "../services/user/updateUserbyId.js";

import auth from "../middleware/auth.js";

const router = Router();

router.get('/', async (req, res) => {
    const { username, email } = req.query;
    const query = {};

    if (username) query.username = username;
    if (email) query.email = email;
    
    try {
        const user = await getUser(query)
        if (user.length === 0) {
            res.status(404).json({ message: 'No user found' });
        } else {
            res.status(200).json(user);
        }
    } catch (error) {
        res.status(500).send(500)
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params
    try {
        const user = await getUserById(id);
        if (!user) {
            res.status(404).json({ message: `Event with id ${id} not found` });
        } else {
            res.status(200).json(user);
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post('/',auth ,async (req, res) => {
    const { id , username, password, name, email, phoneNumber, profilePicture } = req.body
    try {
        const user = await createUser({ id , username, password, name, email, phoneNumber, profilePicture });
        res.status(201).json(user);
    } catch (error) {
        if (error.message.includes('Validation error')) {
            res.status(400).json({ error: error.message });
        } else if (error.message === 'A user with this username already exists.') {
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
    const { username, password, name, email, phoneNumber, profilePicture } = req.body
    try {
        const user = await updateUserById(id, { username, password, name, email, phoneNumber, profilePicture });
        res.status(200).json(user);
    } catch(error){
        if (error.message === 'A user with this username already exists.') {
            res.status(409).json({ error: error.message });
        } else if (error.message === 'Foreign key constraint failed.') {
            res.status(400).json({ error: error.message });
        } else if (error.message === 'Record to update not found.') {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).send(error);
        }
    }
});

router.delete('/:id', auth , async (req, res) => {
    const { id } = req.params
    try {
        const user = await deleteUserById(id);
        res.status(200).json({ message: `Amenity with id ${id} deleted successfully`, user });
    } catch(error) {
        if (error.message === 'Record to delete not found.') {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).send(error);
        }
    }
});

export default router