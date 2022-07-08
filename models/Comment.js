const mongoose = require('mongoose')
const commentSchema =mongoose.Schema({
    postId: {type:String, default:''},
    text: {type:String, default:''},
    dateString: {type:String, default:''},
	schema: {type:String, default:'comment', immutable:true},
	timestamp: {type:Date, default: new Date(), immutable:true}
})


const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment

