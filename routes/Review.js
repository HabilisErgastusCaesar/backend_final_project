import { Router } from "express";

import createReview from "../services/review/createReview.js";
import deleteReviewById from "../services/review/deleteReviewById.js";
import getReview from "../services/review/getReview.js";
import getReviewById from "../services/review/getReviewById.js";
import updateReviewById from "../services/review/updateReviewById.js";

import auth from "../middleware/auth.js";

const router = Router();

router.get('/', async (req, res) => {
    try {
        const review = await getReview();
        if (review.length === 0) {
            res.status(404).json({ message: 'No review found' });
        } else {
            res.status(200).json(review);
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/:id' , async (req, res) => {
    const { id } = req.params
    try {
        const review = await getReviewById(id);
        if (!review) {
        res.status(404).json({ message: `Review with id ${id} not found` });
        } else {
        res.status(200).json(review);
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post('/',auth , async (req ,res) => {
    const { id,  userId, propertyId, rating, comment } = req.body
    try {
        const review = await createReview({ id , userId, propertyId, rating, comment });
        res.status(201).json(review);
    } catch (error) {
        if (error.message.includes('Validation error')) {
            res.status(400).json({ error: error.message });
        } else if (error.message === 'A review with this ID already exists.') {
            res.status(409).json({ error: error.message });
        } else if (error.message === 'Foreign key constraint failed.') {
            res.status(400).json({ error: error.message });
        } else if (error.message === 'Record to update not found.') {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: "Error creating review", details: error.message });
        }
    }
});

router.put('/:id',auth , async (req, res) => {
    const { id } = req.params
    const { userId, propertyId, rating, comment } = req.body
    try {
        const review = await updateReviewById(id, { userId, propertyId, rating, comment });
        res.status(200).json(review);
    } catch(error){
        if (error.message === 'A review with this ID already exists.') {
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
        const review = await deleteReviewById(id)
        res.status(200).json({ message: `Amenity with id ${id} deleted successfully`, review });
    } catch(error) {
        if (error.message === 'Record to delete not found.') {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).send(error);
        }
    }
});

export default router