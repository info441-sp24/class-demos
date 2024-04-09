const mongoose = require('mongoose');

async function connect() {
    await mongoose.connect("mongodb+srv://weifan:info441@info441.wfotfpj.mongodb.net/");
}

module.exports = connect;