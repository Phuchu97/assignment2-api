const mongoose = require('mongoose');
const {Schema} = mongoose;

const TransactionSchema = new Schema({
    userId: String,
    hotelId: String,
    rooms: Array,
    startDate: String,
    endDate: String,
    price: Number,
    payment: String,
    status: String,
    email: String,
    name: String,
    phone: Number,
    card: Number
});

const TransactionModel = mongoose.model('transaction', TransactionSchema);

module.exports = TransactionModel;