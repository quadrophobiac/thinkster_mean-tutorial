/**
 * Created by stephen on 06/03/15.
 */

var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({});

mongoose.model('Comment', CommentSchema);