const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RestaurantSchema = new Schema({
	id: {
		type: String,
		required: true,
		unique : true
	},
	address : {
		type : String,
		required : true
	},
	userid: {
		type: String,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	location: {
		longitude: {
			type: String,
			required: true
		},
		latitude: {
			type: String,
			required: true
		}
	},
	cuisine: {
		type: String,
		required: true
	},
	phone: {
		type: String,
		required: true
	},
	bookingCount : {
		type : Number,
		required : true
	},
	dietaryOptions : {
		isHalal : {
			type : Boolean,
			required : true
		},
		isVegetarian : {
			type : Boolean,
			required : true
		},
	},
	quantity : {
		type : Number,
		required : true
	},
	hours : {
		start : {
			type : String,
			required : true
		},
		end : {
			type : String,
			required : true
		}
	},
	menu : [{
		name : {
			type : String,
			required : true
		}
	}]

});

module.exports = mongoose.model('Restaurant', RestaurantSchema);