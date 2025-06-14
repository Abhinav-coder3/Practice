const express = require('express');
const cookieParser = require('cookie-parser');
const userModel = require('./models/users');
const app = express();
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

app.get("/", function(req, res) {
    res.render('index');
});

app.post("/create", async function(req, res) {
    let { username, email, password, age } = req.body;

    bcrypt.genSalt(10, (error, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
            let createdUser = await userModel.create({
                username,
                email,
                password: hash,
                age
            });
            let token = jwt.sign({ email }, "shhhhhh");
            res.cookie("token", token);
            res.send(createdUser);
        });
    });
});

app.get("/logout", function(req, res) {
    res.cookie("token", "");
    res.redirect("/");
});

app.get("/login",function(req,res){
    res.render('login');
})

app.post("/login",async function(req,res){
    let user = await userModel.findOne({email: req.body.email});
    if(!user) return res.send("something went wrong`");

    bcrypt.compare(req.body.password, user.password, function(err,result){
        if(result){ 
             let token = jwt.sign({ email:user.email }, "shhhhhh");
            res.cookie("token", token);
            res.send("yes you can login");
         } else{ res.send("you can't login");
        }
        console.log(req.body.password);
        console.log(user.password)
    })
})
app.listen(3000);
