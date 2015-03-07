/**
 * Created by stephen on 06/03/15.
 */

var mongoose = require('mongoose');
// require  registers that model with with the global mongoose object
// it can be used to interact with the database anywhere else mongoose is imported
var PostSchema = new mongoose.Schema({
    title: String,
    link: String,
    upvotes: {type: Number, default: 0},
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}]
    //  we've set our comments field to an array of Comment references
});

mongoose.model('Post', PostSchema);