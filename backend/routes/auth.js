const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser =require("../middleware/fetchuser")


const JWT_SECRET = "kirtanisagoodb$oy"; // ideally .env.local ma store karisu

// ROUTE 1 :no login required, creating a user.
router.post('/createuser',[
    body('name',"Enter a valid name").isLength({min : 3}),
    body('email', "Enter a valid email").isEmail(),
    body('password',"Password must be atleast 5 characters").isLength({min : 5})
], async (req,res)=>{
   let success = false
    // console.log(req.body)

    // if there are errors, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success, errors: errors.array() });
    }
    //chech whether the user with this email exists already
    try{

   let user = await User.findOne({email: req.body.email});
   if(user){
      return res.status(400).json({success,error:"Sorry user with this email already exists!"});
   }

   const salt = await bcrypt.genSalt(10); // genrating salt
   secPass = await bcrypt.hash(req.body.password,salt); // generating hash of pass and salt then store in db

   // create a new user
       user = await User.create({
       name: req.body.name,
       password: secPass,
       email: req.body.email,
     })     
    //  .then(user => res.json(user))
    //  .catch(err=>{
    //         console.log(err);
    //         res.json({"error" : "Please enter a unique value for email", message : err.message})
    //       });

    const data = {
      user:{
        id : user.id
      }
    }

    const authtoken = jwt.sign(data,JWT_SECRET);
    success = true;
    res.json({success,authtoken});
    // res.json(user);
  }catch(error){
    console.error(error.message);
    res.status(500).send("Some Internal Server error occured!");
  }
})

// ROUTE 2 : Authenticate a user: POST "/api/auth/login". no login required
router.post('/login',[
  body('email', "Enter a valid email").isEmail(),
  body('password',"Password can not be blank").exists()
], async (req,res)=>{
  let success = false;
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let {email, password} = req.body;
      let user = await User.findOne({email});

      if(!user){
        return res.status(400).json({error : "Try to login with correct credentials"})
      }

      const comparepass = await bcrypt.compare(password, user.password);
      if(!comparepass){
        return res.status(400).json({success, error : "Try to login with correct credentials"})
      }
      const data = {
        user:{
          id : user.id
        }
      }
      const authtoken = jwt.sign(data,JWT_SECRET);
      success = true
      res.json({success,authtoken});
    }catch(error){
      console.error(error.message);
      res.status(500).send("Some Internal Server error occured!");
    }
})

// ROUTE 3 : Get logged in user details : POST "api/auth/getuser",Login required
router.post('/getuser', fetchuser, async (req,res)=>{
try {
  userid = req.user.id;
  const user = await User.findById(userid).select("-password");
  res.send(user);

}catch(error){
  console.error(error.message);
  res.status(500).send("Some Internal Server error occured!");
}
});
module.exports = router