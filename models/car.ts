import mongoose from "mongoose";

const carSchema = new mongoose.Schema({
  type: { type: String, required:true, default: null },
  model: { type: String, unique: true },
  make: { type: String , required:true},
  vehicle: { type: String , required:true},
  mileage:{type:Number},
  price:{type:Number},
},
{timestamps:true}
);

export const Car = mongoose.model('Car', carSchema);
export const getCars = () => Car.aggregate([
  {
    $lookup: {
      from: 'bookings',
      localField: '_id',
      foreignField: 'car',
      as: 'bookings',
    },
  },
  {
    $match: {
      $or: [
        { bookings: { $size: 0 } },
        {
          'bookings.status': {$eq: false},
        },
        {
          'bookings.endDate': { $gt: new Date().toISOString()},
        },
      ],
    },
  },
]);
export const addCar = (values:Record<string,string>) => new Car(values).save().then((car) => car.toObject());
export const seachCarByModel = (value:string) => Car.aggregate(
  [
    {
      $match: { model: {   $regex: new RegExp(value, 'i') } },
    },
    {
      $lookup: {
        from: 'bookings',
        localField: '_id',
        foreignField: 'car',
        as: 'bookings',
      },
    },
    {
      $match: {
        $or: [
          { bookings: { $size: 0 } },
          {
            'bookings.status': {$eq: false},
          },
          {
            'bookings.endDate': { $gt: new Date().toISOString()},
          },
        ],
      },
    },
  ]);

  export const filterCars = (filter:Record<string,string>) => Car.find(filter);