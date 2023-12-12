import express from "express";
import { createCar, filterCarByParameters, getAllCar, searchCar } from "../controller";
import { isAuthentcated } from "../middlewares";

export default (router:express.Router):express.Router => {
    router.get("/cars", isAuthentcated,  getAllCar);
    router.post("/cars/add_car", isAuthentcated, createCar);
    router.get("/cars/search/:model", isAuthentcated, searchCar);
    router.get("/cars/filter", isAuthentcated, filterCarByParameters);
    return router;
}