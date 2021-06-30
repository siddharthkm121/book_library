const mongoose= require("mongoose");

//Author schema
const AuthorSchema= mongoose.Schema({
    id:Number,
    name: String,
    books: [String],
});

//Author model
const AuthorModel = mongoose.model(AuthorSchema);

module.exports= AuthorModel;