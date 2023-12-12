import express from "express";
import { isAuthentcated } from "../middlewares";
import { createBooking, cancelBooking } from "../controller/booking";

export default (router:express.Router):express.Router => {
    router.post("/booking", isAuthentcated, createBooking);
    router.get("/booking/cancel/:id", isAuthentcated, cancelBooking);
    return router;
}