const mongoose = require('mongoose');

const Schema = mongoose.Schema;
// Object with timestamp: true is for ad createdAt & updatedAt to my document
const menuSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    ingredients: {
        type: String
    },
    // count: {
    //     type: Number,
    //     // required: true
    // },
    resturantId: {
        type: Schema.Types.ObjectId,
        ref: 'Resturant',
        required: true
    }
}
);

module.exports = mongoose.model('Menu', menuSchema);