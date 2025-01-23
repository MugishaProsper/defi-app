import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  fullName : { type : String, required : true },
  email : { type : String, required : true, unique : true },
  username : { type : String, required : true },
  password : { type : String, required : true },
});


const User = mongoose.model('User', userSchema);

export default User;