var mongoose = require('mongoose');

async function connect() {
    await mongoose.connect("YOUR_MONGODB_CONNECTION_STRING");
}

module.exports = connect;