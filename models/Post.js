const mongoose = require('mongoose')
const PostSchema = mongoose.Schema({
  _id: {type: mongoose.Schema.ObjectId, auto: true},
	postId: {type:String },
	text: {type:String, default:''},
	name: {type:String, default:''},
  emoji: {type:String, default: ''},
  sentiment: {type: mongoose.Schema.Types.Mixed, default: {}},
	schema: {type:String, default:'post', immutable:true},
  timestamp: {type:Date, default: new Date(), immutable:true},
})

const Post = mongoose.model('Post', PostSchema)

module.exports = Post
