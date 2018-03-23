var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var NoteSchema = new Schema({
	title: {
		type: String
	},
	body: {
		type: String
	},
	noteCreated: {
		type: Date,
		default: Date.now
	}
});

var Note = mongoose.model("Note", NoteSchema);

module.exports = Note;