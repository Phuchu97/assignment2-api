const mongoose = require('mongoose');
const {Schema} = mongoose;

const RoomSchema = new Schema({
    title: String,
    hotelId: String,
    rooms: Array,
    price: Number,
    maxPeople: Number,
    description: String,
    startDate: String,
    endDate: String
});

const RoomModel = mongoose.model('rooms', RoomSchema);

module.exports = RoomModel;