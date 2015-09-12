var User		= require('../models/user');
var jwt			= require('jsonwebtoken');
var config		= require('../../config');
var Developer     = require('../models/developer');

//super secret for creating tokens
var superSecret = config.secret;

module.exports = function(app, express){

    //init database
    
    //init users
    User.remove(function(err) { 
   console.log('collection removed') 
});
    var user01 = new User();
    user01.name = "Abraham";
    user01.username = "pm1";
    user01.password = "pm1";
    user01.save(function(err){
			if(err){
				console.log(err);
			}
            console.log('created');
    });
    
    var user02 = new User();
    user02.name = "Bob";
    user02.username = "pm2";
    user02.password = "pm2";
    user02.save(function(err){});
    
    var user03 = new User();
    user03.name = "Charlie";
    user03.username = "pm3";
    user03.password = "pm3";
    user03.save(function(err){});
    
    Developer.remove(function(err) { 
   console.log('collection removed') 
});
    
    //init developers
var dev01 = new Developer();
    dev01.name = 'yuri';
    dev01.slots = [];
dev01.save();    

    var dev02 = new Developer();
    dev02.name = 'jonny';
    dev02.slots = [];
dev02.save();
    
    var dev03 = new Developer();
    dev03.name = 'chris';
    dev03.slots = [];
dev03.save();
    
    var dev04 = new Developer();
    dev04.name = 'steve';
    dev04.slots = [];
dev04.save();
    
    var dev05 = new Developer();
    dev05.name = 'linus';
    dev05.slots = [];
dev05.save();
    
    var dev06 = new Developer();
    dev06.name = 'karl';
    dev06.slots = [];
dev06.save();
    
    var dev07 = new Developer();
    dev07.name = 'julia';
    dev07.slots = [];
dev07.save();
    
    var dev08 = new Developer();
    dev08.name = 'ivette';
    dev08.slots = [];
dev08.save();
    
	//get an instance of the express router
var apiRouter = express.Router();

//route to authenticate a user (POST http://localhost:8080/api/authenticate)
apiRouter.post('/authenticate', function(req, res){

	//find the user
	//select the name username and password explicitly
	User.findOne({
		username: req.body.username
	}).select('name username password').exec(function(err, user){
		if(err) throw err;

		//no user with that username was found
		if(!user){
			res.json({
				success: false,
				message: 'Authentication faild. User not found.'
			});
		}
		else if(user){

			//check if password matches
			var validPassword = user.comparePassword(req.body.password);
			if(!validPassword){
				res.json({
					success:false,
					message: 'Authentication failed. Wrong password.'
				});
			}
			else{

				//if user is found and password is right
				//create a token
				var token = jwt.sign({
					name: user.name,
					username: user.username
				}, superSecret, {
					expiresInMinutes: 1440 //exires in 24 hours
				});

				//return the information including token as JSON
				res.json({
					success: true,
					message: 'Enjoy your token!',
					token:token
				});

			}
		
		}
	});
	});


//middleware to use for all requests
apiRouter.use(function(req, res, next){
	//check header or url parameters or post parameters for token
	var token = req.body.token || req.param('token') || req.headers['x-access-token'];

	//decode token
	if(token){

		//verifies secret and checks exp
		jwt.verify(token, superSecret, function(err, decoded){
			if(err){
				return res.status(403).send({
					success: false, message: 'Failed to authenticate token.'
				});
			} else{
				//if everything is good, save to request for use in other reoutes
				req.decoded = decoded;

				next();
			}
		})
	} else {

		//if there is no token
		//return an HTTP response of 403 (access forbidden ) and an error message
		return res.status(403).send({
			success: false,
			message: 'No token provided.'
		});
	}

});


//on routes that end in /developers
//-------------------------------

apiRouter.route('/developers')

	//get all the users (accessed at GET http://localhost:8080/api/users)
	.get(function(req, res){
		Developer.find(function(err, developers){
			if (err) res.send(err);
            console.log(developers);
			//return the users
			res.json(developers);
		})
	}); 
    
apiRouter.route('/developers/:dev_id')

	//get the user with that id
	//(accessed at GET http://localhost:8080/api/users/:user_id)
	.get(function(req, res){
		Developer.findById(req.params.dev_id, function(err, dev){
			if(err) res.send(err);
			//return that user
			res.json(dev);
		});
	})    
    
apiRouter.route('/developers/block')

	//get all the users (accessed at GET http://localhost:8080/api/users)
	.post(function(req, res){
        var blocks = req.body.blocks;
        var dev = null;
        var pm = req.body.pm;
        console.log("PM: "+pm);
        Developer.findById(req.body.developer._id, function(err, developer){
			if(err) res.send(err);
			dev = developer;
            while(blocks > 0){
                blocks = dev.block(req.body.from,req.body.to,blocks,pm);
            }
            console.log(blocks);
            console.log(blocks == null);
            if(blocks == null){
                res.json({'message':'Der Entwickler konnte für diesen Zeitraum aufgrund eines Konfliktes nicht blockiert werden','code':500});
            }
            else{
                 //save the user and check for erros
                dev.save(function(err){
                    if(err){
                        //duplicate entry
                        console.log(err);
                    }
                    console.log('developer blocked');
                    res.json({'message':'Der Entwickler wurde für den gewünschten Zeitraum blockiert','code':200});
                });
            }
		});
	});      
    
    
//on routes that end in /users
//-------------------------------

apiRouter.route('/users')

	//create a user (accessed at POST http://localhost:8080/api/users)
	.post(function(req, res){

		//create a new instance of the User model
		var user = new User();

		//set the users information (comes from the request)
		user.name = req.body.name;
		user.username = req.body.username;
		user.password = req.body.password;

		//save the user and check for erros
		user.save(function(err){
			if(err){
				//duplicate entry
				if(err.code == 11000)
					return res.json({success: false, message: 'A user with that username already exists. '});
				else
					return res.send(err);
			}
			res.json({message: 'User created!' });
		});
	})

	//get all the users (accessed at GET http://localhost:8080/api/users)
	.get(function(req, res){
		User.find(function(err, users){
			if (err) res.send(err);
            console.log(users);
			//return the users
			res.json(users);
		})
	});


//api endpoint to get user information
apiRouter.get('/me', function(req, res){
	console.log('ME!');
    console.log(req.decoded);
   User.findOne({
        username: req.decoded.username
    }).exec(function(err,usr){
    res.send(usr);
   });
    
});

//on routes that end in /users/:user_id
//--------------------------------------
apiRouter.route('/users/:user_id')

	//get the user with that id
	//(accessed at GET http://localhost:8080/api/users/:user_id)
	.get(function(req, res){
		User.findById(req.params.user_id, function(err, user){
			if(err) res.send(err);
			//return that user
			res.json(user);
		});
	})

	//update the user with that id
	//(accessed at PUT http://localhost:8080/api/users/:user_id)
	.put(function(req, res){

		//use our user model to find the user we want
		User.findById(req.params.user_id, function(err, user){

			if(err) res.send(err);

			//update the users info only if its new
			if(req.body.name) user-name = req.body.name;
			if(req.body.username) user.username = req.body.username;
			if(req.body.password) user.password = req.body.password;

			//save the user
			user.save(function(err){
				if(err) res.send(err);

				//return a message
				res.json({message: 'User updated'});
			});
		});
	})
	//delete the user with this id
	//(accessed at DELETE http://localhost:8080/api/users/:user_id)
	.delete(function(req, res){
		User.remove({
			_id: req.params.user_id
		}, function(err, user){
			if(err) return res.send(err);
			res.json ({message: 'Succesfully deleted'});
		});
	});	

	return apiRouter;

};