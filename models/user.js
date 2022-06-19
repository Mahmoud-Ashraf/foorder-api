const mongoose = require('mongoose');
// const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;
// Object with timestamp: true is for ad createdAt & updatedAt to my document
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    voted: {
        type: Boolean,
    },
    orders: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Order'
        }
    ],
    todayOrder: {
        type: Schema.Types.ObjectId,
        ref: 'Order'
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    lastVoteDate: {
        type: String
    },
    wallet: {
        type: Number,
        default: 0
    }
}
);
// it validate for a uniqe email
// userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);