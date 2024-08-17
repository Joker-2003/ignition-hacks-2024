const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RestaurantSchema = new Schema({
	id: {
		type: String,
		required: true,
		unique : true
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
		open : {
			type : String,
			required : true
		},
		close : {
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