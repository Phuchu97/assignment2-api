const mongoose = require('mongoose');
const {Schema} = mongoose;

const HotelSchema = new Schema({
    name: String,
    type: String,
    city: String,
    address: String,
    distance: Number,
    photos: Array,
    rating: Number,
    featured: String,
    room: Array,
    title: String,
    price: String,
});

const HotelModel = mongoose.model('hotels', HotelSchema);

module.exports = HotelModel;