var express= require('express'),
    cookie= require('cookie-parser'),
    passport= require('passport'),
    session= require('express-session'),
    passport= require('passport'),
    mongodb= require('mongodb').MongoClient,
    body= require('body-parser'),
    localStrategy= require('passport-local').Strategy,
     app= express();
     app.set('view engine','ejs');
     app.use(body.json());
     app.use(body.urlencoded({extended: true}));
     app.use(cookie());
     app.use(session({ secret: 'utkarsh',
     resave: false,
     saveUninitialized: true
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(function(req,res,next){
         res.locals.currentUser= req.user;
         next();
    });
    passport.serializeUser(
        function(user,done){
            done(null,user);
        }
    );
    passport.deserializeUser(function(user,done){
        done(null,user);
    });
    passport.use(new localStrategy(
     { 
         usernameField: 'username',
         passwordField: 'password'
      },function(username,password,done){
          var url= 'mongodb://localhost:27017/authenticate';
          mongodb.connect(url,function(err,db){
              var collection= db.collection('users');
              collection.findOne({ username: username},function(err,result){
                  if(result){
                    if(result.password === password){
                        var user= result
                        done(null,user);
                    }
                  }
                  else{
                      done(null,false);
                  }
              })
          })
      }
    ));
     
   app.post('/signup',function(req,res){
       var user={
           username: req.body.username,
           password: req.body.password
       };
    var url= 'mongodb://localhost:27017/authenticate';
    mongodb.connect(url,function(err,db){
        var collection= db.collection('users');
        collection.insertOne(user,function(err,result){
            req.logIn(user,function(){
                res.redirect('/user/profile');
            })
        })
    })
   });
   app.post('/signin',passport.authenticate('local',{ failureRedirect: '/signin'}),function(req,res){
       res.redirect('/user/profile');
   });
  app.get('/user/profile',function(req,res){
     res.render('profile');
  })
    
app.get('/',function(req,res){
    res.redirect('/signup');
});
app.get('/signup',function(req,res){
    res.render('signup');
});
app.get('/signin',function(req,res){
  res.render('signin');
});
 app.listen(800,function(){
     console.log('server started');
 });


