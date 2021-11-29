// db.js
const mongoose = require('mongoose');

// User Schema
const User = new mongoose.Schema({
    username: String,
    password: String,
    willPlay: String,
    havePlayed: Number,
    playing: String, 
    reviews: Object,
    authority: String,
    email: String,
    password: String,
    avatar: String,
    description: String,
    favoriteGame: String,
  });

// Admin Schema
  const Admin = new mongoose.Schema({
    username: String,
    password: String,
    willPlay: String,
    havePlayed: String,
    playing: String, 
    reviews: Object,
    authority: String,
    email: String,
    password: String,
    avatar: String,
    description: String,
  });
// Review Schema
const Review = new mongoose.Schema({
    reviewer: String,
    gameName: String,
    text: String,
    rating: Number,
    title: String,
    platform: String,
    gameImage: String,
});
// Possible Game Object Schema???
const Game = new mongoose.Schema({
        gameName: String,
        gameGenre: String,
        gamePlatform: String,
        gameRating: Object,
        gameReviews: Object,
        gameImage: String,
        gameDescription: String,
        gameReleaseDate: String,
    });

mongoose.model('User', User);
mongoose.model('Admin', Admin);
mongoose.model('Review', Review);
mongoose.model('Game', Game);

//Uncomment Below for Live Database
const uri = process.env.MONGODB_URI;
mongoose.connect(uri);

// Uncomment below for local development

//mongoose.connect('mongodb://localhost:27017/final_project');

////////////////////////////////////


//mongodb+srv://AIT:grant206@ocluster.xeea1.mongodb.net/OCluster?retryWrites=true&w=majority

/*
Navigate to Project Directory in Terminal
git add .
git commit -m "message"
git push origin master
git push heroku master
*/