const express = require('express');
const http = require('http');
const bcrypt = require('bcryptjs');
const path = require("path");
const bodyParser = require('body-parser');
//const users = require('./data').userDB;
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/Records');


const app = express();
const server = http.createServer(app);


app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname,'./public')));


app.get('/',(req,res) => {
    res.sendFile(path.join(__dirname,'./public/index.html'));
});

const Dataschema ={
    id: Number,
    username:String,
	email: String,
	password: String,
    company: String,
    status: String
};

const data = mongoose.model('data', Dataschema);


app.post('/register', async (req, res) => {
    try{
        const foundUser = await data.findOne({ email: req.body.email });
        if (!foundUser) {
    
            let hashPassword = await bcrypt.hash(req.body.password, 10);
    
            let bruh= new data({
                id: Date.now(),
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                company: req.body.Cname,
                status: "Manager"
            });
            bruh.save();
            //console.log('User list', users);
    
            res.send("<div align ='center'><h2>Registration successful</h2></div><br><br><div align='center'><a href='./login.html'>login</a></div><br><br><div align='center'><a href='./registration.html'>Register another user</a></div>");
        } else {
            res.send("<div align ='center'><h2>Email already used</h2></div><br><br><div align='center'><a href='./registration.html'>Register again</a></div>");
        }
    } catch{
        res.send("Internal server error");
    }
});

app.post('/login', async (req, res) => {
    try{
        let foundUser = await data.findOne({email: req.body.email});
        if (foundUser) {
//error last time all passwords accepted check await for the casue of error
            let submittedPass = req.body.password; 
            let storedPass = foundUser.password;            
    
           //let passwordMatch =  bcrypt.compareSync(submittedPass, storedPass);
            if (storedPass === submittedPass) {
                let usrname = foundUser.username;
                let cid= foundUser.id;
                if(foundUser.status === "Manager"){
                res.send(`<div align ='center'><h2>login successful</h2></div><br><br><br><div align ='center'><h3>Hello ${usrname}</h3><br><br>Your Company ID:${cid}</div><br><br><div align='center'><a href='./login.html'>logout</a></div>`);
            } 
        else{
            res.send(`<div align ='center'><h2>login successful</h2></div><br><br><br><div align ='center'><h3>Hello ${usrname}</h3><br><br>Welcome, to ${foundUser.company} Portal<br></div><br><br><div align='center'><a href='./login.html'>logout</a></div>`); }
    }else {
                res.send("<div align ='center'><h2>Invalid email or password</h2></div><br><br><div align ='center'><a href='./login.html'>login again</a></div>");
            }
        }
        else {
    
            let fakePass = `$2b$$10$ifgfgfgfgfgfgfggfgfgfggggfgfgfga`;
            await bcrypt.compare(req.body.password, fakePass);
    
            res.send("<div align ='center'><h2>Invalid email or password</h2></div><br><br><div align='center'><a href='./login.html'>login again<a><div>");
        }
    } catch{
        res.send("Internal server error");
    }
});

app.post('/employee', async (req, res) => {
    try{
        const foundUser = await data.findOne({ email: req.body.email });
        if (!foundUser) {
            const foundcom= await data.findOne({id: req.body.CompanyID})
    
            let hashPassword = await bcrypt.hash(req.body.password, 10);
    
            let bruh= new data({
                id: Date.now(),
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                company: foundcom.company,
                status: "Employee"
            });
            bruh.save();
            //console.log('User list', users);
    
            res.send(`<div align ='center'><h2>Registration successful as an Employee Under ${bruh.company},<br> Your Presiding manager is ${foundcom.username}</h2></div><br><br><div align='center'><a href='./login.html'>login</a></div><br><br><div align='center'><a href='./registration.html'>Register another user</a></div>`);
        } else {
            res.send("<div align ='center'><h2>Email already used</h2></div><br><br><div align='center'><a href='./registration.html'>Register again</a></div>");
        }
    } catch{
        res.send("Internal server error");
    }
});
server.listen(3000, function(){
    console.log("server is listening on port: 3000");
});