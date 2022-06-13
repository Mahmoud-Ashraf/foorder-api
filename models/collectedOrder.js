const mongoose = require('mongoose');

const Schema = mongoose.Schema;
// Object with timestamp: true is for ad createdAt & updatedAt to my document
const opts = {
    // Make Mongoose use Unix time (seconds since Jan 1, 1970)
    timestamps: { currentTime: () => Date.now().toISOString().split('T')[0] },
};
const collectedOrderSchema = new Schema(
    {
        resturantId: {
            type: Schema.Types.ObjectId,
            ref: 'Resturant',
            required: true
        },
        subtotalOrderPrice: {
            type: Number,
            required: true
        },
        deliveryFees: {
            type: Number,
            default: 0
        },
        taxFees: {
            type: Number,
            default: 0
        },
        discount: {
            type: Number,
            default: 0
        },
        usersCount: {
            type: Number
        },
        status: {
            type: String,
            default: 'PENDING'
        },
        total: {
            type: Number,
            default: 0
        },
        createdOn: {
            type: String,
            default: new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate()
        },
        items: [
            {
                count: {
                    type: Number,
                    required: true
                },
                item: {
                    type: Schema.Types.ObjectId,
                    ref: 'Menu',
                    required: true
                }
            }
        ],
        users: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true
            }
        ]
    },
    { timestamps: true }
);

module.exports = mongoose.model('CollectedOrder', collectedOrderSchema);