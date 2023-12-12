import express from "express";
import authentication from "./authentication";
import cars from "./cars";
import booking from "./booking";

const router = express.Router();
export default (): express.Router => {
       authentication(router);
       cars(router);
       booking(router)
       return router;
}