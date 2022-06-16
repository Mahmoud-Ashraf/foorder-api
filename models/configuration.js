const mongoose = require('mongoose');

const Schema = mongoose.Schema;
// Object with timestamp: true is for ad createdAt & updatedAt to my document
const configSchema = new Schema({
    voteEndTime: {
        type: Array,
        default: [23,59,59]
    },
    orderEndTime: {
        type: Array,
        default: [23,59,59]
    }
}
);

module.exports = mongoose.model('Config', configSchema);