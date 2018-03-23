var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
	source: {
		type: String
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