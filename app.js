const express = require('express');
const cookieParser = require('cookie-parser');
const userModel = require('./models/users');
const app = express();
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());


app.use(cookieParser());
app.get("/", function(req,res){
    res.render('index');
  
})
app.post("/create", async function(req,res){
    let {username,email,password,age} = req.body;

bcrypt.genSalt(10,(error,salt)=>{
    bcrypt.hash(password,salt,async (err,hash)=>{
        let createdUser = await userModel.create({ 
       username,
        email,
       password:hash,
        age
    })
    let token = jwt.sign({email}, "shhhhhh");
    res.cookie("token",token)
     res.send(createdUser)
  })
})
})


   
  



app.listen(3000);