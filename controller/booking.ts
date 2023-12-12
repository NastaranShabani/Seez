import express from "express"
import { addBooking, existBook, getTheBooking } from "../models/booking";
import { differenceTime } from "../helper/differenceTime";
import { getUserBysessionToken } from "../models/user";
import { get} from "lodash";
export const createBooking = async (req:express.Request, res:express.Response) => {
    try {
      const { car, user, startDate, endDate } = req.body;
      if (!car || !user || !startDate || !endDate) {
        res.status(400).send("All input is required");
      }
        const existingBooking = await existBook(car);
        if (existingBooking) {
        return res.status(409).send("Car Already Booked");
      }    
      const newBooking = await addBooking({
        car,
        user,
        startDate,
        endDate,
        status: "true",
      });
      res.status(201).json(newBooking).end();
  } catch (err) {
  console.log(err);
  return res.sendStatus(400);
  }
  }

  export const cancelBooking = async(req:express.Request, res:express.Response) => {
    try{
      const {id} = req.params;
      const booked_car = await getTheBooking(id);
    const currentUserId = get(req, "identity._id");
    if(!booked_car) {return res.sendStatus(400).send("booked car does not exist")}
    if(!booked_car?.status) {
      return res.status(403).json("this car is already cancel")
  }
    if(currentUserId !== undefined && booked_car?.user.toString() !== String(currentUserId)) {
        return res.status(403).json("this car is not booked by this user")
    }

      if(differenceTime(booked_car.endDate)) {
        return res.status(201).json("you are not able to cancel a booking in less than 24 hours")
    }
      booked_car.status = false;
      await booked_car.save();
      return res.status(201).json(booked_car)
    }
    catch (err) {
        console.log(err);
        return res.sendStatus(400);
        }
  }