import express from "express"
import { addCar, filterCars, getCars, seachCarByModel } from "../models/car";
import { getUserBysessionToken } from "../models/user";

interface FilterType {
    model?:string,
    make?:string
    price?:number
}

export const getAllCar = async(req:express.Request,res:express.Response) => {
    try{
        const cars = await getCars();
        return res.status(200).json(cars);
    }
    catch(error) {
        console.log(error);
        return res.sendStatus(400)
    }
}

export const createCar = async(req:express.Request,res:express.Response) => {
    try {
        const { type, model, make, vehicle,mileage,price } = req.body;
        const sessionToken = req.cookies["AUTH_COOKIE"];
        if (!type || !model || !make || !vehicle || !mileage || !price) {
          res.status(400).send("All input is required");
        }
        const existingUser = await getUserBysessionToken(sessionToken);
        if (!existingUser?.superuser) {
          return res.status(409).send("Just super user can create car");
        }
         const car = await addCar({
          type,
          model,
          make,
          vehicle,
          mileage,
          price
        });
        res.status(201).json(car).end();
    } catch (err) {
    console.log(err);
    return res.sendStatus(400);
    }
}

export const searchCar = async(req:express.Request,res:express.Response) => {
    try {
        const query = req.params.model;
        if (!query) {
          res.status(400).send("model is require. please send model");
        }
         const car = await seachCarByModel(query);
        res.status(201).json(car).end();
    } catch (err) {
    console.log(err);
    return res.sendStatus(400);
    }
}

export const filterCarByParameters = async(req:express.Request,res:express.Response) => {
  try {
    const { price, make, model } = req.query;

    const filter:FilterType | any = {};
    if (model) filter.model = model;
    if (make) filter.make = make;
    if (price) filter.price = { $lte: parseInt(price as string, 10) };
    const cars = await filterCars(filter);
    res.json(cars);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}