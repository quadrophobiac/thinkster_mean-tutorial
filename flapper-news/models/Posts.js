/**
 * Created by stephen on 06/03/15.
 */

var mongoose = require('mongoose');

var PostSchema = new mongoose.Schema({
    title: String,
    link: String,
    upvotes: {type: Number, default: 0},
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}]
});

mongoose.model('Post', PostSchema);