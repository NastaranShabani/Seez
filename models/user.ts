import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String,unique: true, required:true },
  email: { type: String, unique: true,required:true },
  password: { type: String , required:true , select:false },
  superuser:{type: Boolean , required:true },
  salt:{type:String, select:false},
  sessionToken:{type:String , select:false}
},
{timestamps:true}
);

export const User = mongoose.model('User', userSchema);

export const getUser = () => User.find();
export const getUserByEmail = (email:string) => User.findOne({email});
export const getUserBysessionToken = (sessionToken:string) => User.findOne({"sessionToken":sessionToken});
export const getUserById = (id:string) => User.findById(id);
export const createUser = (values:Record<string,string>) => new User(values).save().then((user) => user.toObject());
export const deleteUserbyId = (id:string) => User.findByIdAndDelete({_id:id});
export const updateUser = (id:string,values:Record<string,string>) => User.findByIdAndUpdate({_id:id})
