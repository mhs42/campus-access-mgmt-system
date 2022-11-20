const dotenv = require("dotenv");
const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser')
const fs = require('fs');
const util = require('util');
const cors = require('cors');
const bcrypt = require("bcrypt");
dotenv.config({path:".env"});
const app = express();
const jwt = require("jsonwebtoken");
app.use(express.json())
app.use(cors())

const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);


function seedData(query)
{
    return new Promise((resolve, reject)=>{
    con.query(query,
    (err2,result)=>
    {
        if(err2)
        {
            console.log("Seeding Failed");
            reject(err2);
        }
        else
        {
            resolve()
            console.log("Seeding done");
        }
     });
    });
}

const con = mysql.createConnection(
    {
        host:process.env.host,
        user: process.env.user,
        password:process.env.password,
        database:process.env.database
    }
);


const query = util.promisify(con.query).bind(con);

setInterval(function () {
    con.query('SELECT 1');
}, 5000);

app.post('/signup', async (req,res)=>{
    const usr = req.body.usrname;
    const pass = req.body.password;
    const occ = req.body.occupation;
    console.log("at start: ",usr,pass,occ);
    if (!usr || !pass || !occ){
        console.log("if (!usr || !pass || !occ): ",usr,pass,occ);
        return res.json({status: "error", error: "Please enter all the data"});
    }
    if (occ!="student" && occ!="faculty"){
        console.log("occ:", occ);
        return res.json({status: "error", error: "occupation can only be student or faculty"});
    }
    else{
        const u = await query(`select username from Ztt5Nb4KuO.users where username = '${usr}'`);
        console.log(u);
        console.log(u.length);
        if(u.length != 0){
            return res.json({ status: "error", error: "already registered"});
        }
    }
    if(isNaN(usr) || usr.length!=8){
        return res.json({ status: "error", error: "Only 8 digit roll no is allowed as username"});
    }
    const hashed_password = bcrypt.hashSync(req.body.password, salt);
    con.connect(async (err)=>{
        console.log("before seeding: ",usr,pass,occ);
        await seedData(`INSERT INTO Ztt5Nb4KuO.users (username,password,occupation,state) VALUES ('${usr}','${hashed_password}','${occ}','Not allowed')`);
        res.json({ status: "success", error: "succeeded"});
    })
})

app.post('/login', async (req,res)=>{
    const usr = req.body.usrname;
    const pass = req.body.password;
    console.log("at start: ",usr,pass);
    if (!usr || !pass){
        console.log("if (!usr || !pass): ",usr,pass);
        return res.json({status: "error", error: "Please enter all the data"});
    }
    const u = await query(`select username from Ztt5Nb4KuO.users where username = '${usr}'`);
    const o = await query(`select occupation from Ztt5Nb4KuO.users where username = '${usr}'`);
    console.log("u: ",u);
    console.log("u.length: ",u.length);
    console.log("o: ",o);
    console.log("o.length: ",o.length);
    if(u.length == 0){
        return res.json({ status: "error", error: "no such user exists"});
    }
    const p = await query(`select password from Ztt5Nb4KuO.users where username = '${usr}'`);
    console.log("p: ",p);
    console.log("p[0].password: ",p[0].password);
    const match = await bcrypt.compare(pass, p[0].password);
    if(match && o[0].occupation === "student"){
        const token = jwt.sign(
            {
              name: usr,
            },
            "talha"
          );
        // const token = usr;
        return res.json({ status: "success", error: "succeeded", occupation:"student",auth: token});
    }
    else if (match && o[0].occupation === "admin")
    {
        const token = jwt.sign(
            {
              name: "admin",
            },
            "talha"
          );
        return res.json({ status: "success", error: "succeeded", occupation:"admin",auth: token});
    }
    else{
        return res.json({ status: "error", error: "wrong password"});
    }
})


app.get('/access', async (req,res)=>{
    const token = req.headers["x-access-token"];
    const decoded = jwt.verify(token, "talha");
    console.log("decoded: ",decoded.name);
    console.log("typeof decoded: ",typeof decoded.name);
    console.log("token: ",token);
    if(decoded.name == "admin"){
        return res.json({ status: "error", error: "Admin can't visit the access page"});
    }
    const s = await query(`select state from Ztt5Nb4KuO.users where username = '${decoded.name}'`);
    console.log("s: ",s);
    if(s.length ==0){
        return res.json({ status: "error", error: "Error"});  
    }
    else{
        return res.json({ status: "success", data: s[0].state});
    }

})

app.get('/admin', async (req,res)=>{
    const token = req.headers["x-access-token"];
    const decoded = jwt.verify(token, "talha");
    console.log("decoded: ",decoded.name);
    console.log("typeof decoded: ",typeof decoded.name);
    console.log("token: ",token);
    if(decoded.name != "admin"){
        return res.json({ status: "error", error: "Only admin can visit this page"});
    }
    const s = await query(`select * from Ztt5Nb4KuO.users`);
    console.log("s: ",s);
})


app.listen(5000, ()=>{
    console.log("server running");
})
