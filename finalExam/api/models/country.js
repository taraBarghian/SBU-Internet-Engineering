const mongoose = require('mongoose');

const countrySchema = mongoose.Schema({
    _id: mongoose.Schema.ObjectId,
    name: { type: String, required: true, unique: true},
    todayCases: Number, 
    todayDeaths: Number,
    todayRecovered: Number,
    critical: Number,
});


module.exports = mongoose.model('Country', countrySchema);