var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PostSchema = new Schema(
    {
        identification: {type: String},
        description: {type: String, max: 1000},
        username: {type: String, max: 100},
        date_posted: {type: Date},
        time_posted: {type: String},
        image: {type: String},
        location: [{type: String,type: String}]
    }
);

PostSchema.set('toObject', {getters: true, virtuals: true});

var Post = mongoose.model('Post', PostSchema);


module.exports = Post;