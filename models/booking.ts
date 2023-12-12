import mongoose  from "mongoose";

const bookingSchema = new mongoose.Schema({
  car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: Boolean,required:true, default:false },
});

export const Booking = mongoose.model('Booking', bookingSchema);
export const addBooking = (values:Record<string,string>) => new Booking(values).save().then((book) => book.toObject());
export const existBook = (car:mongoose.Schema.Types.ObjectId) => Booking.findOne({car:car});
export const getTheBooking = (id:string) => Booking.findById({_id:id});

