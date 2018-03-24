var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
	burntorange: {
		type: Boolean,
		default: false
	},
	hookem: {
		type: Boolean,
		default: false
	},
	texasdiehards: {
		type: Boolean,
		default: false
	},
	title: {
		type: String
	}, 
	summary: {
		type: String
	},
	author: {
		type: String
	},
	imageLink: {
		type: String
	},
	link: {
		type: String
	},
	saved: {
		type: Boolean,
		default: false
	},
	articleAdded: {
		type: Date,
		default: Date.now
	},
	notes: [
		{
			type: Schema.Types.ObjectId, 
			ref: "Note"
		}
	]
});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;