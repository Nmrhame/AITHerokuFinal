// app.js Dependencies
require('./db.js');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Admin = mongoose.model('Admin');
const Game = mongoose.model('Game');
const Review = mongoose.model('Review');
const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcrypt');

//Handlebars Helpers
var hbs = require('hbs');
hbs.registerHelper('ifEquals', function(arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});
hbs.registerHelper('reverse', function (arr) {
    arr.reverse();
});
hbs.registerHelper('average', function (arr) {
    //average the array
    var sum = 0;
    for(var i = 0; i < arr.length; i++){
        sum += arr[i];
    }
    return sum/arr.length;
});
hbs.registerHelper('averagereview', function (arr) {
    //average the array
    console.log(arr);
    var sum = 0;
    for(var i = 0; i < arr.length; i++){
        sum += arr[i].rating;
    }
    return sum/arr.length;
});

//MULTER CONFIG
const multer = require('multer');
var storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'public/images/');
    },
    filename: function(req, file, cb){
        cb(null, Date.now()+file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg'){
        cb(null, true);
    }
    else{
        cb(null, false);
    }
}
var upload = multer({storage: storage}, {fileFilter: fileFilter});
//Registration validation
function registration(username, password, email, errorCb, successCb) {
    if(password.length < 8) {
        const errObj = {message: "Password must be at least 8 characters"};
        console.log(errObj);
        errorCb(errObj);
    }
    else{
        User.findOne({username: username}, (err, result) => {
            if(err){
                console.log(err);
            }
            else if(result){
                const errObj = {message: "Username already exists"};
                console.log(errObj);
                errorCb(errObj);
            }
            else{
                User.findOne({email: email}, (err, result) => {
                    if(err){
                        console.log(err);
                    }
                    else if(result){
                        const errObj = {message: "Email already exists"};
                        console.log(errObj);
                        errorCb(errObj);
                    }
                    else{
                        bcrypt.hash(password, 10, (err, hash) => {
                            if(err){
                                console.log(err);
                            }
                            const user = new User({
                                username: username,
                                password: hash,
                                authority: "user",
                                email: email,
                                willPlay: 0,
                                havePlayed: 0,
                                playing: "None", 
                                reviews: [],
                                description: "I am a new User. I have not created a personal description yet!",
                                favoriteGame: "None",
                                avatar: "https://www.shareicon.net/data/512x512/2016/09/01/822711_user_512x512.png"
                            });
                            user.save(err => {
                                if(err){
                                    const errObj = {message: "Did not register"};
                                    console.log(errObj);
                                    console.log(err);
                                    errorCb(errObj);
                                }
                                else{
                                    successCb(user);
                                }
                            })
                        })
                    }
                });
            }
        })
    }
}
function authenticated(req, user, cb){
    req.session.regenerate((err) => {
        if(!err){
            req.session.user = user;
            req.session.username = user.username;
            console.log(req.session);
            cb();
        }
        else{
            console.log(cb);
        }
    });
}
function adminAuthenticated(req, user, cb){
    req.session.regenerate((err) => {
        if(!err){
            req.session.user = user;
            req.session.username = user.username;
            req.session.admin = true;
            console.log(req.session);
            cb();
        }
        else{
            console.log(cb);
        }
    });
}

//HBS SETUP
app.set('view engine', 'hbs');
app.set('views', __dirname + "/views");
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, './')));
const sessionOptions = {
    secret: 'Big Red Dog',
    saveUninitialized: false,
    resave: false
  };
app.use(session(sessionOptions));

//MAINFEED
app.get('/', function (req, res){
    res.redirect('mainfeed');
});
app.get('/mainfeed', function (req, res){
    Review.find({}, function (err, reviews){
        if (err) {
            console.log("Error");
        } 
        else {
            //find the game that the review is about
            Game.find({}, function (err, games){
                if (err) {
                    console.log("Error");
                }
                else {
                    User.findOne({username: req.session.username}, function (err, user){
                        if (err) {
                            console.log("Error");
                            res.render('mainfeed', {games:games, reviews: reviews, filtered: false});
                        }
                        else {
                            res.render('mainfeed', {games:games, reviews: reviews, filtered: false, user: user});
                        }
                    });
                }
            }); 
        }
    });
});

//LOGIN
app.get('/login', function (req, res){
    res.render('login');
});
//Login Validation
app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({username: username}, (err, result) => {
        if(err){
            console.log(err);
            Admin.findOne({username: username}, (err, result) => {
                if(err){
                    console.log(err);
                }
                else if(result){
                    bcrypt.compare(password, result.password, (err, result) => {
                        if(err){
                            console.log(err);
                        }
                        else if(result){
                            adminAuthenticated(req, result, () => {
                                res.redirect('/mainfeed');
                            });
                        }
                        else{
                            res.render('login', {message: "Incorrect Password"});
                        }
                    })
                }
                else{
                    res.render('login', {message: "Incorrect Username"});
                }
            })
        }
        else if(result){
            bcrypt.compare(password, result.password, (err, result) => {
                if(err){
                    console.log(err);
                }
                else if(result){
                    console.log(result);
                    const user = new User({
                        username: username,
                    });
                    authenticated(req, user, () => {
                        res.redirect('/');
                    });
                }
                else{
                    const errObj = {message: "Incorrect password"};
                    console.log(errObj);
                    res.render('login', {message: errObj.message});
                }
            })
        }
        else{
            const errObj = {message: "Username does not exist"};
            console.log(errObj);
            res.render('login', {message: errObj.message});
        }
    })
});

//SIGNUP
app.get('/signup', function (req, res){
    res.render('signup');
});
app.post('/signup', (req, res) => {
    registration(req.body.username, req.body.password, req.body.email, function error(errObj){
        res.render('signup', {message: errObj.message});
    }, 
    function success(user){
        authenticated(req, user, function callback(){res.redirect('/mainfeed')});
    });
});

//USER PROFILE PAGE
app.get('/profile', function (req, res){
    //if profile parameter exists, render profile page for that user
    if(req.query.profile){
        User.findOne({username: req.query.profile}, function (err, otherUser){
            if(err){
                console.log(err);
            }
            else if(otherUser){      
                Game.find({}, function (err, games){
                    if (err) {
                        console.log("Error");
                    } 
                    else {
                        User.findOne({username: otherUser.username}, function (err, user){
                            if(err){
                                console.log(err);
                            }
                            else{
                                res.render('profile', {user:user, games: games, filtered: true});
                            }
                        });
                    } 
                });
            }
        });
    }
    else if(req.session.user === undefined){
        res.redirect('/login');
    }
    else{
        Game.find({}, function (err, games){
            if (err) {
                console.log("Error");
            } 
            else {
                User.findOne({username: req.session.username}, function (err, user){
                    if(err){
                        console.log(err);
                    }
                    else{
                        res.render('profile', {user:user, games: games, filtered: false});
                    }
                });
            } 
        });
    }

});

app.get('/profile/:page', function (req, res){
    const page = req.params.page;
    Game.find({}, function (err, games){
        if (err) {
            console.log("Error");
        } 
        else {
            User.findOne({username: page}, function (err, user){
                if(err){
                    console.log(err);
                }
                else{
                    res.render('profile', {user:user, games: games, filtered: false});
                }
            });
        } 
    });
});
app.post('/reviews/create', function (req, res){
    //find game image using req.body.game
    Game.findOne({gameName: req.body.game}, function (err, game){
        if(err){
            console.log(err);
        }
        else{       
    const review = new Review({
        title: req.body.title,
        gameName: req.body.game,
        text: req.body.reviewText,
        rating: req.body.rating,
        reviewer: req.session.username,
        platform: req.body.platform,
        gameImage: game.gameImage,
    });
    console.log(req.body.reviewText);
    review.save(function (err){
        if(err){
            console.log(err);
        }
        else{
            //save review to user review property in user object
            User.findOne({username: req.session.username}, function (err, user){
                if(err){
                    console.log(err);
                }
                else{
                    user.update({$push: {reviews: review}}, function (err){
                        if(err){
                            console.log(err);
                        }
                        else{
                            console.log("Review saved");
                        }
                    });
                }
            });
            //save review rating to game object
            Game.findOne({gameName: req.body.game}, function (err, game){
                if(err){
                    console.log(err);
                }
                else{
                    game.update({$push: {gameReviews: review, gameRating: review.rating}}, function (err){
                        if(err){
                            console.log(err);
                        }
                        else{
                            console.log("Review saved");
                        }
                    });
                }
            });
            res.redirect('/profile');
        }
    });
}
});
});

//Edit User Profile
app.get('/editProfile', function (req, res){
    Game.find({}, function (err, games){
        if (err) {
            console.log("Error");
        }
        else{
            User.findOne({username: req.session.username}, function (err, user){
                if(err){
                    console.log(err);
                }
                else{
                    res.render('editProfile', {games: games, user: user});
                }
            });
        }
    });
});

app.post('/editProfile', upload.single('avatar'), function (req, res){
    if(req.file){
        const pathname = req.file.path;
        console.log(pathname);
        const avatar = pathname;
        const description = req.body.description;
        const havePlayed = req.body.havePlayed;
        const favoriteGame = req.body.favoriteGame;
        //update user object
        User.findOne({username: req.session.username}, function (err, user){    
            if(err){
                console.log(err);
            }
            else{
                user.update({avatar: avatar, description: description, havePlayed: havePlayed, favoriteGame: favoriteGame}, function (err){
                    if(err){
                        console.log(err);
                    }
                    else{
                        console.log("Profile updated");
                        res.redirect('/profile');
                    }
                });
            }
        }
        );
    }
    else{
        console.log("No file");
        res.redirect('/editProfile');
    }
});
//render addGames page
app.get('/addGames', function (req, res){
    //If user is not an admin redirect to mainfeed
    if(req.session.user === undefined){
        res.redirect('/mainfeed');
    }
    else{
        User.findOne({username: req.session.username}, function (err, user){
            if(err){
                console.log(err);
            }
            else if(user.authority === 'user'){
                res.redirect('/mainfeed');
            }
            else{
                User.find({}, function (err, users){
                    if(err){
                        console.log(err);
                    }
                    else{
                        res.render('addGames', {user: user, users: users});
                    }
                });
            }
        });
    }
});

//Add game to game database
app.post('/addgame', upload.single('gameImage'), function (req, res){
    if(req.file){
        const pathname = req.file.path;
        console.log(pathname);
        const game = new Game({
            gameName: req.body.gameName,
            gameGenre: req.body.gameGenre,
            gamePlatform: req.body.gamePlatform,
            gameReleaseDate: req.body.gameReleaseDate,
            gameImage: pathname,
            gameDescription: req.body.gameDescription,
            gameRating: [],
        });
        game.save(function (err){
            if (err) {
                console.log("Error");
            } 
            else {
                res.redirect('/profile');
            }
        });
    }
    else{
        console.log("No file");
        res.redirect('/addGames');
    }
});

//render games page
app.get('/games', function (req, res){
    Game.find({}, function (err, games){
        if (err) {
            console.log("Error");
        } 
        else {
            User.findOne({username: req.session.username}, function (err, user){
                if(err){
                    console.log(err);
                    res.render('games', {games: games, filtered: false});
                }
                else{
                    res.render('games', {games: games, user: user});
                }
            });
        } 
    });
});

app.post('/removeUser', function (req, res){
    User.findOneAndRemove({username: req.body.user}, function (err){
        if(err){
            console.log(err);
        }
        else{
            console.log("User removed");
            res.redirect('/addGames');
        }
    });
});

const port = process.env.PORT || 3000;
app.listen(port);