import { Router } from "express";

import createBooking from "../services/booking/createBooking.js";
import deleteBookingById from "../services/booking/deleteBookingById.js";
import getBooking from "../services/booking/getBooking.js";
import getBookingById from "../services/booking/getBookingById.js";
import updateBookingById from "../services/booking/updateBookingById.js";
import auth from "../middleware/auth.js";

const router = Router();

router.get('/', async (req, res) => {
    const { userId } = req.query;
    const query = {}
    if (userId) query.userId = userId

    try {
        const booking = await getBooking(query);
        if (booking.length === 0) {
            res.status(404).json({ message: 'No bookings found' });
          } else {
            res.status(200).json(booking);
          }
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get("/:id", async (req, res) => {
    const { id } = req.params
    try {
        const booking = await getBookingById(id);
        if (!booking) {
            res.status(404).json({ message: `booking with id ${id} not found` });
        } else {
            res.status(200).json(booking);
        }
    } catch (error) {
        res.status(500).send(error)
    }
});

router.post("/",auth , async (req, res) => {
    const { id , userId, propertyId, checkinDate, checkoutDate, numberOfGuests, totalPrice, bookingStatus } = req.body
    try {
        const booking = await createBooking({ id , userId, propertyId, checkinDate, checkoutDate, numberOfGuests, totalPrice, bookingStatus });
        res.status(201).json(booking);
    } catch (error) {
        if (error.message.includes('Validation error')) {
            res.status(400).json({ error: error.message });
        } else if (error.message === 'A booking with this ID already exists.') {
            res.status(409).json({ error: error.message });
        } else if (error.message === 'Foreign key constraint failed.') {
            res.status(400).json({ error: error.message });
        } else if (error.message === 'Record to update not found.') {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: "Error creating booking", details: error.message });
        }
    }
});

router.put('/:id',auth , async (req, res) => {
    const { id } = req.params
    const { userId, propertyId, checkinDate, checkoutDate, numberOfGuests, totalPrice, bookingStatus } = req.body
    try {
        const booking = await updateBookingById(id, { userId, propertyId, checkinDate, checkoutDate, numberOfGuests, totalPrice, bookingStatus });
        res.status(200).json(booking);
    } catch(error){
        if (error.message === 'A booking with this ID already exists.') {
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
        const booking = await deleteBookingById(id)
        res.status(200).json({ message: `Amenity with id ${id} deleted successfully`, booking });
    } catch(error) {
        if (error.message === 'Record to delete not found.') {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).send(error);
        }
    }
});

export default router