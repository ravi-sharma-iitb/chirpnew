var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    username: String,
    password: String, //hash created from password
    created_at: {type: Date, default: Date.now}
});

var postSchema = new mongoose.Schema({
    created_by: String,
    created_at: {type: Date, default: Date.now},
    text: String
});
//{ type: mongoose.Schema.ObjectId, ref: 'User' }

mongoose.model('Post', postSchema);
mongoose.model('User', userSchema);

var Post = mongoose.model('Post', postSchema);
var User = mongoose.model('User', userSchema);