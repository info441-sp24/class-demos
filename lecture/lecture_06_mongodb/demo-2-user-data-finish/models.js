import mongoose from 'mongoose'

let models = {}

console.log("connecting to mongodb")
//TODO: Add your mongoDB connection string (mongodb+srv://...)
await mongoose.connect("mongodb://localhost:27017/userDemo")

console.log("successfully connected to mongodb")

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    favorite_ice_cream: String
})

models.User = mongoose.model('User', userSchema)

console.log("mongoose models created")

export default models