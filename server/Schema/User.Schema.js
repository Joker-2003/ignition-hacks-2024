const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	id: {
		type: String,
		required: true,
		unique : true
	},
	email: {
		type: String,
		required: true
	},
	bookings: [{
		type: String,
		required: true
	}],
	restaurantAdded: [{
		type: String,
		required: true
	}],
});

module.exports = mongoose.model('User', UserSchema);