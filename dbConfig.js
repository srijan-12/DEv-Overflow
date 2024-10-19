const mongoose = require("mongoose");

const connectionString = 'mongodb+srv://srijan122001:xtK4oshl7cpIQyKU@srijan.6nhyh.mongodb.net/DEv-Overflow'

async function ConnectToDB(){
    await mongoose.connect(connectionString);
}

module.exports = ConnectToDB;