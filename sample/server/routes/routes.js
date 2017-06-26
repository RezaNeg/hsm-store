const bCrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtSecret = require('../config/jwtSecret');

module.exports = function(app, user, auth_user, product){
	const User = user;
  const Auth_user = auth_user;
	const Product = product;


  // login section
  app.post('/users/login', function(req, res) {
    const email = req.body.email;
    const password = req.body.password;
		User.findOne({ where : { email: email}}).then(function (user) {
      if (!user) {
        req.msg = "No such a user!";
        return res.json({success: false, msg:req.msg});
      } else if (!user.password){
        req.msg = "You registered only via social networks! Signup locally!";
        return res.json({success: false, msg:req.msg});
      }else if (!isCorrectPassword(password, user.password)) {
        req.msg = "Incorrect password!";
        return res.json({success: false, msg:req.msg});
      }else{
        sendUserToClient(user.get(),"You are successfully logged in.", res);
        }
      }).catch(function(err){
			  console.log("###### Error : ", err);												
    });
  });

  // signup section
	app.post("/users/signup", function(req, res) {
		// I dont check for passwords mismatch error as I did it in client side
		const password_salt = bCrypt.genSaltSync(9);
    const userPassword  = bCrypt.hashSync(req.body.password, password_salt, null);
    const data = {
                email 		    : req.body.email,
                password    	: userPassword,
                password_salt : password_salt,
                firstname    	: req.body.firstname,
                lastname 	    : req.body.lastname    
                };
    User.findOne({where: {email:req.body.email}}).then(function(user) {
			if(user && user.password != null) {
				return res.json({success: false, msg:'That email is already taken!'});
			}else if (user && user.password == null) {
        // we are updating a user who has been logged in earlier only from social networks
        return User.update(data, { where: { email: data.email} }).then(function(){
          return res.json({success: true, msg:'User information is updated successfully.'});
        }).catch((err) => {
          return res.json({success: false, msg:'Something went wrong while updating user information!'});
        });
      }else{ // we must register new user
        return User.create(data).then(function(newUser,created){
          if(!newUser){
            return res.json({success: false, msg:'Failed to register user due to db error!'});
          }else{
            return res.json({success: true, msg:'User is registered successfully.'});
          }
          }).catch((err) => {
            return res.json({success: false, msg:'Something went wrong while registering new user!'});
          });
      }
    });
  });


  // facebook section
	app.post("/users/auth/facebook", function(req, res) {
    console.log("@@@@@@@@@@@ searching for f_id in user");
    console.log(req.body.id);
    User.findOne({ where : { f_id: req.body.id }}).then(function (user) {
      if(user){
        console.log("@@@@@@@@@@@ executing user.get");
        const userInfo = user.get();
        const token = jwt.sign(userInfo, jwtSecret.secret, {
          expiresIn: 3000
        });
        req.msg = "You are successfully logged in using Facebook (as before)!";
        return res.json({ success: true,
                          msg:req.msg,
                          token: 'JWT '+ token,
                          user:{
                            id: userInfo.id,
                            f_id: userInfo.f_id,
                            firstname: userInfo.firstname,
                            lastname: userInfo.lastname,
                            email: userInfo.email
                          }
                        });
      }else{
        console.log("@@@@@@@@@@@ searching for facebook email in user table");
        return User.findOne({ where : { email : req.body.email } }).then(function(user){
          if(user){
            const dataForAuth_user =
            { 
              user_id  	: user.id,
              auth_id 	: req.body.id,
              email     : req.body.email,
              firstname : req.body.first_name,
              lastname 	: req.body.last_name,
              displayName : req.body.name,
              provider_id : 1
            };
            const data = {
              f_id 	: req.body.id,
              f_name 	: req.body.name
            };
            console.log("@@@@@@@@@@@ searching for f_id in auth_user table");
            return Auth_user.findOne({ where : { auth_id : req.body.id }}).then(function(auth_user){
              if(auth_user){
                console.log("@@@@@@@@@@@ Updating Auth_table with new data from facebook");
                return Auth_user.update(dataForAuth_user, { where: { auth_id : req.body.id } }).then(function(){
                  console.log("@@@@@@@@@@@ updating user table by inserting f_id and f_name");
                  return User.update(data, { where: { email : req.body.email } }).then(function(){
                    console.log("@@@@@@@@@@@ executing user.get");
                    const userInfo = user.get();
                    const token = jwt.sign(userInfo, jwtSecret.secret, {
                      expiresIn: 3000
                    });
                    req.msg = "You are successfully logged in using Facebook. (new Facebook relogin)";
                    return res.json({ success: true,
                                      msg:req.msg,
                                      token: 'JWT '+ token,
                                      user:{
                                        id: userInfo.id,
                                        f_id: userInfo.f_id,
                                        firstname: userInfo.firstname,
                                        lastname: userInfo.lastname,
                                        email: userInfo.email
                                      }
                                    });
                  });
                });
              }else{
                console.log("@@@@@@@@@@@ No f_id and creating new facebook user in auth-user table");
                return Auth_user.create(dataForAuth_user).then(function(newAuthUser,created){
                  if(!newAuthUser){
                    return res.json({success: false, msg:'Problem in registering your Facebook profile!'});
                  }else{
                    console.log("A new facebook user is created!");
                    console.log("@@@@@@@@@@@ updating user table by inserting f_id and f_name");
                    return User.update(data, { where: { email : req.body.email } }).then(function(){
                      console.log("@@@@@@@@@@@ executing user.get");
                      const userInfo = user.get();
                      const token = jwt.sign(userInfo, jwtSecret.secret, {
                        expiresIn: 3000
                      });
                      req.msg = "You are successfully logged in using Facebook. (first Facebook login)";
                      return res.json({ success: true,
                                        msg:req.msg,
                                        token: 'JWT '+ token,
                                        user:{
                                          id: userInfo.id,
                                          f_id: userInfo.f_id,
                                          firstname: userInfo.firstname,
                                          lastname: userInfo.lastname,
                                          email: userInfo.email
                                        }
                                      });
                    });
                  }
                });
              }
            });
          }else{
            // no user with Facebook email exists in our database
            const dataForUser =
            { 
              firstname 	: req.body.first_name,
              lastname 	  : req.body.last_name,
              f_id 		    : req.body.id,
              f_name 	  	: req.body.name,
              email 		  : req.body.email
            };
            console.log("@@@@@@@@@@@ creating a new user based on facebook profile");
            return User.create(dataForUser).then(function(newUser,created){
              if(!newUser){
                return res.json({success: false, msg:'Problem in creating your local profile based on facebook data!'});
              }else{
              const dataForAuth_user =
                {
                  user_id  	  : newUser.id,
                  auth_id 	  : req.body.id,
                  firstname   : req.body.first_name,
                  lastname 	  : req.body.last_name,
                  displayName : req.body.name,
                  email       : req.body.email,
                  provider_id : 1
                };
                console.log("@@@@@@@@@@@ creating a new facebook profile");
                return Auth_user.create(dataForAuth_user).then(function(newAuthUser,created){
                  if(!newAuthUser){
                    return res.json({success: false, msg:'Problem in registering your new Facebook profile!'});
                  }else{
                    console.log("NEW USER: ", newUser);
                    const userInfo = newUser.get();
                    console.log("STRINGIFIED NEW USER: ", userInfo)
                    const token = jwt.sign(userInfo, jwtSecret.secret, {
                      expiresIn: 3000
                    });
                    req.msg = "You are successfully logged in using Facebook. (first login ever)";
                    return res.json({ success: true,
                                      msg:req.msg,
                                      token: 'JWT '+ token,
                                      user:{
                                        id: userInfo.id,
                                        f_id: userInfo.f_id,
                                        firstname: userInfo.firstname,
                                        lastname: userInfo.lastname,
                                        email: userInfo.email
                                      }
                                    });
                  }
                });
                }
            });
          }
        });	
      }
    });
  });


  // all social logins together (facebook, google and linkedin)
  app.post("/users/auth/social", function(req, res) {
    console.log("Request body from client: ", req.body);
    // data initiation
    console.log("START OF SOCIAL LOGIN AT SERVER SIDE: ..........");
    var socialId = req.body.uid;
    var prodiverId = null;
    var updUser = null;
    var split = req.body.name.split(' ');
    var dataForUser = {
                        firstname 	: split[0],
                        lastname 	  : split[split.length -1],
                        email 		  : req.body.email,
                        imageURL    : req.body.image
                      };
    var dataForAuth_user = {
                              auth_id 	  : socialId,
                              firstname   : split[0],
                              lastname 	  : split[split.length -1],
                              displayName : req.body.name,
                              email       : req.body.email,
                              imageURL    : req.body.image
                            }; 
    console.log("req.body.provider: ", req.body.provider);
    switch (req.body.provider){
      case 'facebook':
        prodiverId = "1";
        updUser =  {
                    f_id 	: socialId,
                    f_name 	: req.body.name,
                    imageURL: req.body.image
                  };
        dataForUser.f_id = socialId;
        dataForUser.f_name = req.body.name;
        break;
      case 'google':
        prodiverId = "2";
        updUser =  {
                    g_id 	: socialId,
                    g_name 	: req.body.name,
                    imageURL: req.body.image
                  };               
        dataForUser.g_id = socialId;
        dataForUser.g_name = req.body.name;
        break;
      case 'linkedIN':
        prodiverId = "3";
        updUser =  {
                    l_id 	: socialId,
                    l_name 	: req.body.name,
                    imageURL: req.body.image
                  };
        dataForUser.l_id = socialId;
        dataForUser.l_name = req.body.name;
        break;
    }
    dataForAuth_user.provider_id = prodiverId;
    
    // profile manipulation
    console.log("@@@@@@@@@@@ searching for f_id, g-id or t-id in user table");

    User.findOne({ where: { $or: [ { f_id: socialId }, { g_id: socialId}, { l_id: socialId } ] } }).then((user) => {
      if(user){
        console.log("@@@@@@@@@@@ executing user.get");
        sendUserToClient(user.get(), "You are successfully logged in using social netwowrks (as before)!", res);
      }else{
        console.log("@@@@@@@@@@@ searching for social network email in user table");
        return User.findOne({ where : { email : req.body.email } }).then((user) => {
          if(user){
            dataForAuth_user.user_id = user.id;
            console.log("@@@@@@@@@@@ searching for auth_id in auth_user table");
            return Auth_user.findOne({ where : { auth_id: socialId } }).then((auth_user) =>{
              if(auth_user){
                console.log("@@@@@@@@@@@ Updating Auth_table with new data from social network");
                return Auth_user.update(dataForAuth_user, { where: { auth_id : socialId } }).then(() =>{
                  console.log("@@@@@@@@@@@ updating user table by inserting social data");
                  return User.update(updUser, { where: { email : req.body.email } }).then(() =>{
                    User.findOne({ where : { email : req.body.email }}).then((user) =>{
                      sendUserToClient(user.get(), "You are successfully logged in using social networks. (new social for existing local user)", res);
                    });
                  });
                });
              }else{
                console.log("@@@@@@@@@@@ No auth_id and creating new authUser in auth-user table");
                return Auth_user.create(dataForAuth_user).then((newAuthUser,created) => {
                  if(!newAuthUser){
                    return res.json({success: false, msg:'Problem in registering your social network profile!'});
                  }else{
                    console.log("A new authUser is created!");
                    console.log("@@@@@@@@@@@ updating user table by inserting social data");
                    return User.update(updUser, { where: { email : req.body.email } }).then(() => {
                      User.findOne({ where : { email : req.body.email }}).then((user) =>{
                        sendUserToClient(user.get(), "You are successfully logged in using social networks. (for the first time)", res);
                      });
                    });
                  }
                });
              }
            });
          }else{
            // no user with this social network email exists in our database
            console.log("@@@@@@@@@@@ creating a new user based on social network data");
            return User.create(dataForUser).then((newUser,created) => {
              if(!newUser){
                return res.json({success: false, msg:'Problem in creating your local profile based on social network data!'});
              }else{
                dataForAuth_user.user_id = newUser.id;
                console.log("@@@@@@@@@@@ creating a new authUser in auth table");
                return Auth_user.create(dataForAuth_user).then((newAuthUser,created) => {
                  if(!newAuthUser){
                    return res.json({success: false, msg:'Problem in registering your new social network in our database!'});
                  }else{
                    sendUserToClient(newUser.get(), "You are successfully logged in using social networks. (first login ever)", res);
                  }
                });
                }
            });
          }
        });	
      }
    });
  });

function sendUserToClient(user, msg, res){
  const token = jwt.sign(user, jwtSecret.secret, {
    expiresIn: 3000  
  });
  user.password = null;
  user.password_salt = null;
  return res.json({ success: true,
                    msg: msg,
                    token: 'JWT '+ token,
                    user: user
                  });
}

 // profile section
	app.get('/users/profile', function(req, res, next) {
    console.log("Header authorization from client: ", req.headers.authorization);
    let str = req.headers.authorization;
    jwt.verify(str.substring(4), jwtSecret.secret, function(err, user) {
      if(!err){
        console.log("decoded user: ", user);
        //check it....................................TODO
        return res.json({user: user, msg: "You made it to the secure area"});
      }else{ res.json({msg: "Your token is expired!"});}
    });
  
  });



  app.get('/product-detail/:id', function(req,res){
    console.log("REQ>PARAM: ", req.params.id );
    Product.findOne({where: {id: req.params.id}}).then((product) => {
      if (!product){
        req.msg = "No such a product in database!";
        return res.json({success: false, msg:req.msg});
      }else{
        sendProductToClient(product, "the product is found.", res);
      }
    }).catch(function(err){
			  console.log("###### Error : ", err);
    });
  })

  app.get('/products', function(req,res,next) {
    // console.log("REQ from client: ", req);

    Product.findAll().then(function (product) {
      if (!product) {
        req.msg = "No product in database!";
        return res.json({success: false, msg:req.msg});
      }else{
        sendProductsToClient(product,"products are loaded successfully.", res);
        }
      }).catch(function(err){
			  console.log("###### Error : ", err);												
    });
  })

function sendProductToClient(product, msg, res){
  return res.json({ success: true,
                    msg: msg,
                    product: product
                  });
}


function sendProductsToClient(products, msg, res){
  return res.json({ success: true,
                    msg: msg,
                    products: products
                  });
}


};

function isCorrectPassword(userpass,password){
  return bCrypt.compareSync(userpass, password);
}