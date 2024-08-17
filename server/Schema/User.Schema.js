const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	id: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	bookings: [{
		restaurantId: {
			type: String,
			required: true
		},
		bookingTime: {
			type: Date,
			required: true
		},
		restaurantName: {
			type: String,
			required: true
		},
	}],
	restaurantAdded: [{
		type: String,
		required: true
	}],
});

module.exports = mongoose.model('User', UserSchema);