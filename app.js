require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser')
const app = express()
const path = require('path')

app.use(bodyParser.urlencoded({extended: true}))

let Sent = require('sentiment')
let sentiment = new Sent()
//
// set up and connect to our remote database
let mongoose = require('mongoose')
let mongoDB = process.env.MONGO_DB
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true})
let db = mongoose.connection
//
// get our models
const Post = require('./models/Post.js')
const Comment = require('./models/Comment.js')

// set up handlebars view engine
var handlebars = require('express-handlebars').create({
    defaultLayout:'main'
});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');


app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + '/public'));

// middleware to add list data to context
app.use(function(req, res, next){
	if(!res.locals.partials) res.locals.partials = {};
  // 	res.locals.partials.listOfWorks = listOfWorks;
 	next();
});



app.get('/', function(req, res){
  res.render('messages');
})



function sentimentToEmoji(message) {
  message.sentiment = sentiment.analyze(message.text)
  if (message.sentiment.score > 0) {
    message.emoji = "😊"
  } else if (message.sentiment.score == 0) {
    message.emoji = "😐"
  } else {
    message.emoji = "☹️"
  }

}

app.get('/messages', function(req,res) {
  res.render('messages')
})

function combineMessagesAndComments(messages, comments) {
  let output = messages.map(message => {
    let matchedComments = comments.filter(comment => {
      console.log('comment id: ', comment.postId)
      console.log('message id: ', message.postId)
      console.log(comment.postId == message.postId)
      return comment.postId == message.postId
    })
    console.log('matchedComments: ', matchedComments)
    return { message: message, comments: matchedComments }
  })
  return output
}

app.get('/data/messages', function(req, res) {
  Post.find()
    .then(messages => {
      // just show messages first, then show comments
      Comment.find().then(comments => {
        let json = combineMessagesAndComments(messages, comments)
        res.json({messages: json})
      })

    })
})

app.post('/message', function(req, res) {
  sentimentToEmoji(req.body)
  let newPost = new Post(req.body)
  newPost.postId = newPost._id.toString()
  newPost.save((err, doc) => {
    console.log('data: ', doc)
    res.send({success: true})
  })
})

app.put('/message', function(req, res) {
  sentimentToEmoji(req.body)
  Post.findOneAndUpdate({postId: req.body.postId}, req.body).then(data => {
    res.send({success: true})
  })
})

app.post('/comment', function(req, res) {
  console.log('foo')
  let newComment = new Comment(req.body)
  newComment.save((err, doc) => {
    res.send({success:true})
  })
})

app.get('/edit-messages', function(req,res) {
  res.render('edit-messages')
})

app.delete('/message', function(req, res) {
  Post.deleteOne({ postId: req.body.postId}, function(err, doc) {
    res.send({success:true})
  })
})

// 404 catch-all handler (middleware)
app.use(function(req, res, next){
	res.status(404);
	res.render('404');
});

// 500 error handler (middleware)
app.use(function(err, req, res, next){
	console.error(err.stack);
	res.status(500);
	res.render('500');
});

app.listen(app.get('port'), function(){
  console.log( 'Express started on http://localhost:' +
    app.get('port') + '; press Ctrl-C to terminate.' );
});
