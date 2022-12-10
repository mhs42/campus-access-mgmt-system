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
// const { it } = require("node:test");
app.use(express.json())
app.use(cors())

const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

const arr = ["bat", "ball", "football", "racket", "biscuits", "milk", "chips", "tea", "pen", "pencil", "ink", "register", "flask", "chemicals", "optics", "burner"];

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
    if (usr == "admin"){
        return res.json({status: "error", error: "user exists"});
    }
    if (occ!="student" && occ!="faculty" && occ!="staff"){
        console.log("occ:", occ);
        return res.json({status: "error", error: "occupation can only be student,faculty or staff"});
    }
    else{
        const u = await query(`select username from Ztt5Nb4KuO.users where username = '${usr}'`);
        console.log(u);
        console.log(u.length);
        if(u.length != 0){
            return res.json({ status: "error", error: "already registered"});
        }
    }
    if(occ == "student" && (isNaN(usr) || usr.length!=8)){
        return res.json({ status: "error", error: "Only 8 digit roll no is allowed as username"});
    }
    const hashed_password = bcrypt.hashSync(req.body.password, salt);
    con.connect(async (err)=>{
        console.log("before seeding: ",usr,pass,occ);
        if(occ == "faculty"){
            const r = await query(`select * from Ztt5Nb4KuO.users where occupation="student" ORDER BY RAND() LIMIT 1;`);
            console.log("r:",r);
            if(r.length != 0){
                console.log("r[0].username",r[0].username);
                console.log("here1");
                await seedData(`INSERT INTO Ztt5Nb4KuO.facilities (username,gym,library) VALUES ('${usr}',"allowed","allowed")`);
                console.log("here2");
                await seedData(`INSERT INTO Ztt5Nb4KuO.tas (username,ta,state) VALUES ('${usr}','${r[0].username}','${r[0].state}')`);
                console.log("here3");
            }   
        }
        await seedData(`INSERT INTO Ztt5Nb4KuO.users (username,password,occupation,state) VALUES ('${usr}','${hashed_password}','${occ}','Not allowed')`);
        await seedData(`INSERT INTO Ztt5Nb4KuO.facilities (username,gym,library) VALUES ('${usr}',"allowed","allowed")`);
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
    if(match && (o[0].occupation === "student" || o[0].occupation === "faculty" || o[0].occupation === "staff")){
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


app.post('/resetpassword', async (req,res)=>{
    const usr = req.body.usrname;
    const pass = req.body.password;
    const newpass = req.body.newpassword;
    console.log("usr: ",usr);
    console.log("pass: ", pass);
    console.log("newpass: ", newpass);
    if (!usr || !pass || !newpass){
        console.log("if (!usr || !pass || !occ): ",usr,pass,newpass);
        return res.json({status: "error", error: "Please enter all the data"});
    }
    const s = await query(`select username from Ztt5Nb4KuO.users where username='${usr}'`);
    console.log("s: ",s);
    if(s.length == 0){
        return res.json({ status: "error", error: "no such user exists"});
    }
    console.log("s[0].username: ",s[0].username);
    const p = await query(`select password from Ztt5Nb4KuO.users where username = '${usr}'`);
    console.log("p: ",p);
    console.log("p[0].password: ",p[0].password);
    const match = await bcrypt.compare(pass, p[0].password);
    if(!match){
        return res.json({ status: "error", error: "wrong password"});
    }
    const hashed_password = bcrypt.hashSync(newpass, salt);
    await query(`UPDATE Ztt5Nb4KuO.users SET password='${hashed_password}' where username='${usr}'`)
        return res.json({ status: "success"});

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
    if(!token){
        return res.json({ status: "error", error: "login first"});
    }
    const decoded = jwt.verify(token, "talha");
    console.log("decoded: ",decoded.name);
    console.log("typeof decoded: ",typeof decoded.name);
    console.log("token: ",token);
    if(decoded.name != "admin"){
        return res.json({ status: "error", error: "Only admin can visit this page"});
    }
    const s = await query(`select * from Ztt5Nb4KuO.users where occupation!='admin'`);
    console.log("s: ",s);
    return res.json({ data:s});
})


// app.get('/test', async (req,res)=>{
//     const s = await query(`select * from Ztt5Nb4KuO.users where occupation!='admin'`);
//     console.log("s: ",s);
//     return res.json({ data:s});
// })


app.post('/vendor', async (req,res)=>{
    const token = req.headers["x-access-token"];
    if(!token){
        return res.json({ status: "error", error: "login first"});
    }
    const decoded = jwt.verify(token, "talha");
    console.log("decoded: ",decoded.name);
    console.log("typeof decoded: ",typeof decoded.name);
    console.log("token: ",token);
    if(decoded.name != "admin"){
        console.log("bye bye");
        return res.json({ status: "error", error: "admin can visit this page only"});
    }
    const s = await query(`select * from Ztt5Nb4KuO.vendors`);
    const s1 = await query(`select * from Ztt5Nb4KuO.vehicles where item!="NULL"`);
    // const s3 = await query(`select id from Ztt5Nb4KuO.vehicles,Ztt5Nb4KuO.vendors where LOCATE(item,items)`);
    const s2 = await query(`select username,vehiclename,plateno,state,item,id,type from Ztt5Nb4KuO.vehicles,Ztt5Nb4KuO.vendors where item!="NULL" and LOCATE(item,items)`);
    console.log("s: ",s);
    console.log("s2: ",s2);
    // console.log("s3: ",s3);
    return res.json({ data:s, data1:s2});
})


app.post('/vendorsearch', async (req,res)=>{
    const token = req.headers["x-access-token"];
    if(!token){
        return res.json({ status: "error", error: "login first"});
    }
    const decoded = jwt.verify(token, "talha");
    console.log("decoded: ",decoded.name);
    console.log("typeof decoded: ",typeof decoded.name);
    console.log("token: ",token);
    if(decoded.name != "admin"){
        console.log("bye bye");
        return res.json({ status: "error", error: "admin can visit this page only"});
    }
    const usr = req.body.usrname;
    const s = await query(`select items from Ztt5Nb4KuO.vendors where id=${usr}`);
    // const s2 = await query(`select user	vehicle	plate state	item vendor-id from Ztt5Nb4KuO.vendors,Ztt5Nb4KuO.vehicles from Ztt5Nb4KuO.vehicles where item!="NULL" and item=%${}%`);
    console.log("s: ",s);
    if(s.length == 0){
        return res.json({data:''});    
    }
    return res.json({data:s[0].items});
})

app.post('/ta', async (req,res)=>{
    const token = req.headers["x-access-token"];
    if(!token){
        return res.json({ status: "error", error: "login first"});
    }
    const id = req.body.usrname;
    console.log(req.body);
    const decoded = jwt.verify(token, "talha");
    console.log("decoded: ",decoded.name);
    console.log("typeof decoded: ",typeof decoded.name);
    console.log("token: ",token);
    console.log("id: ",id);
    if(decoded.name != "admin"){
        console.log("bye bye");
        return res.json({ status: "error", error: "Only admin can visit this page"});
    }
    const s1= await query(`select occupation from Ztt5Nb4KuO.users where username = '${id}'`);
    console.log("s1: ",s1[0].occupation);
    if(s1[0].occupation == "student" || s1[0].occupation == "staff"){
        return res.json({ status: "nochanges", error: "No Tas available for this"});
    }
    const s = await query(`select * from Ztt5Nb4KuO.tas where username = '${id}'`);
    console.log("s: ",s);
    return res.json({ data:s});
})




app.post('/facility', async (req,res)=>{
    const token = req.headers["x-access-token"];
    const id = req.body.usrname;
    console.log(req.body);
    const decoded = jwt.verify(token, "talha");
    console.log("decoded: ",decoded.name);
    console.log("typeof decoded: ",typeof decoded.name);
    console.log("token: ",token);
    console.log("id: ",id);
    if(decoded.name != "admin"){
        return res.json({ status: "error", error: "Only admin can visit this page"});
    }
    const  s= await query(`select * from Ztt5Nb4KuO.facilities where username = '${id}'`);
    const  s1= await query(`select * from Ztt5Nb4KuO.visitorfacilities where username = '${id}'`);
    console.log("s: ",s);
    console.log("s1: ",s1);
    return res.json({ data:s, data1: s1});
})

app.post('/change', async (req,res)=>{
    console.log("inside /change");
    console.log("req.body: ",req.body);
    const token = req.headers["x-access-token"];
    const decoded = jwt.verify(token, "talha");
    console.log("decoded: ",decoded.name);
    console.log("typeof decoded: ",typeof decoded.name);
    console.log("token: ",token);
    if(decoded.name != "admin"){
        return res.json({ status: "error", error: "Only admin can visit this page"});
    }
    const usr = req.body.usrname;
    const state = req.body.status;
    console.log("usr: ",usr);
    console.log("state: ", state);
    if (state == "allowed"){
        let new_s = "Not allowed";
        await query(`UPDATE Ztt5Nb4KuO.users SET state='${new_s}' where username='${usr}'`)
        await query(`UPDATE Ztt5Nb4KuO.tas SET state='${new_s}' where ta='${usr}'`)
        return res.json({ status: "good"});
    }
    else if(state == "Not allowed"){
        let new_s = "allowed";
        await query(`UPDATE Ztt5Nb4KuO.users SET state='${new_s}' where username='${usr}'`)
        await query(`UPDATE Ztt5Nb4KuO.tas SET state='${new_s}' where ta='${usr}'`)
        return res.json({ status: "good"});
    }
    else{
        return res.json({ status: "error", error:"Some error"});
    }
})



app.post('/changegym', async (req,res)=>{
    console.log("inside /changegym");
    console.log("req.body: ",req.body);
    const token = req.headers["x-access-token"];
    const decoded = jwt.verify(token, "talha");
    console.log("decoded: ",decoded.name);
    console.log("typeof decoded: ",typeof decoded.name);
    console.log("token: ",token);
    if(decoded.name != "admin"){
        return res.json({ status: "error", error: "Only admin can visit this page"});
    }
    const usr = req.body.usrname;
    const gm = req.body.gym;
    console.log("usr: ",usr);
    console.log("gm: ",gm);
    if (gm == "allowed"){
        let new_s = "Not allowed";
        await query(`UPDATE Ztt5Nb4KuO.facilities SET gym='${new_s}' where username='${usr}'`)
        return res.json({ status: "good"});
    }
    else if(gm == "Not allowed"){
        let new_s = "allowed";
        await query(`UPDATE Ztt5Nb4KuO.facilities SET gym='${new_s}' where username='${usr}'`)
        return res.json({ status: "good"});
    }
    else{
        return res.json({ status: "error", error:"Some error"});
    }
})


app.post('/changelibrary', async (req,res)=>{
    console.log("inside /changelibrary");
    console.log("req.body: ",req.body);
    const token = req.headers["x-access-token"];
    const decoded = jwt.verify(token, "talha");
    console.log("decoded: ",decoded.name);
    console.log("typeof decoded: ",typeof decoded.name);
    console.log("token: ",token);
    if(decoded.name != "admin"){
        return res.json({ status: "error", error: "Only admin can visit this page"});
    }
    const usr = req.body.usrname;
    const lib = req.body.library;
    console.log("usr: ",usr);
    console.log("lib: ",lib);
    if (lib == "allowed"){
        let new_s = "Not allowed";
        await query(`UPDATE Ztt5Nb4KuO.facilities SET library='${new_s}' where username='${usr}'`)
        return res.json({ status: "good"});
    }
    else if(lib == "Not allowed"){
        let new_s = "allowed";
        await query(`UPDATE Ztt5Nb4KuO.facilities SET library='${new_s}' where username='${usr}'`)
        return res.json({ status: "good"});
    }
    else{
        return res.json({ status: "error", error:"Some error"});
    }
})

app.post('/changevisitors', async (req,res)=>{
    console.log("inside /changevisitors");
    console.log("req.body: ",req.body);
    const token = req.headers["x-access-token"];
    const decoded = jwt.verify(token, "talha");
    console.log("decoded: ",decoded.name);
    console.log("typeof decoded: ",typeof decoded.name);
    console.log("token: ",token);
    if(decoded.name != "admin"){
        return res.json({ status: "error", error: "Only admin can visit this page"});
    }
    const usr = req.body.usrname;
    const state = req.body.status;
    const noc = req.body.cnic;
    console.log("usr: ",usr);
    console.log("state: ", state);
    console.log("noc: ", noc);
    if (state == "allowed"){
        let new_s = "Not allowed";
        await query(`UPDATE Ztt5Nb4KuO.visitors SET state='${new_s}' where username='${usr}' and cnic='${noc}'`)
        return res.json({ status: "good"});
    }
    else if(state == "Not allowed"){
        let new_s = "allowed";
        await query(`UPDATE Ztt5Nb4KuO.visitors SET state='${new_s}' where username='${usr}' and cnic='${noc}'`)
        return res.json({ status: "good"});
    }
    else{
        return res.json({ status: "error", error:"Some error"});
    }
})

app.post('/changegymvisitor', async (req,res)=>{
    console.log("inside /changegymvisitor");
    console.log("req.body: ",req.body);
    const token = req.headers["x-access-token"];
    const decoded = jwt.verify(token, "talha");
    console.log("decoded: ",decoded.name);
    console.log("typeof decoded: ",typeof decoded.name);
    console.log("token: ",token);
    if(decoded.name != "admin"){
        return res.json({ status: "error", error: "Only admin can visit this page"});
    }
    const usr = req.body.usrname;
    const visit = req.body.visitname;
    const gm = req.body.gym;
    console.log("usr: ",usr);
    console.log("visit: ", visit);
    console.log("gm: ", gm);
    if (gm == "allowed"){
        let new_s = "Not allowed";
        await query(`UPDATE Ztt5Nb4KuO.visitorfacilities SET gym='${new_s}' where username='${usr}' and visitorname='${visit}'`)
        return res.json({ status: "good"});
    }
    else if(gm == "Not allowed"){
        let new_s = "allowed";
        await query(`UPDATE Ztt5Nb4KuO.visitorfacilities SET gym='${new_s}' where username='${usr}' and visitorname='${visit}'`)
        return res.json({ status: "good"});
    }
    else{
        return res.json({ status: "error", error:"Some error"});
    }
})

app.post('/changelibraryvisitor', async (req,res)=>{
    console.log("inside /changelibraryvisitor");
    console.log("req.body: ",req.body);
    const token = req.headers["x-access-token"];
    const decoded = jwt.verify(token, "talha");
    console.log("decoded: ",decoded.name);
    console.log("typeof decoded: ",typeof decoded.name);
    console.log("token: ",token);
    if(decoded.name != "admin"){
        return res.json({ status: "error", error: "Only admin can visit this page"});
    }
    const usr = req.body.usrname;
    const visit = req.body.visitname;
    const gm = req.body.library;
    console.log("usr: ",usr);
    console.log("visit: ", visit);
    console.log("gm: ", gm);
    if (gm == "allowed"){
        let new_s = "Not allowed";
        await query(`UPDATE Ztt5Nb4KuO.visitorfacilities SET library='${new_s}' where username='${usr}' and visitorname='${visit}'`)
        return res.json({ status: "good"});
    }
    else if(gm == "Not allowed"){
        let new_s = "allowed";
        await query(`UPDATE Ztt5Nb4KuO.visitorfacilities SET library='${new_s}' where username='${usr}' and visitorname='${visit}'`)
        return res.json({ status: "good"});
    }
    else{
        return res.json({ status: "error", error:"Some error"});
    }
})


app.post('/changevehicles', async (req,res)=>{
    console.log("inside /changevehicles");
    console.log("req.body: ",req.body);
    const token = req.headers["x-access-token"];
    const decoded = jwt.verify(token, "talha");
    console.log("decoded: ",decoded.name);
    console.log("typeof decoded: ",typeof decoded.name);
    console.log("token: ",token);
    if(decoded.name != "admin"){
        return res.json({ status: "error", error: "Only admin can visit this page"});
    }
    const usr = req.body.usrname;
    const state = req.body.st;
    const vehicle_name = req.body.vehiname;
    const plate_no = req.body.pltno;
    console.log("usr: ",usr);
    console.log("state: ", state);
    console.log("vehicle_name: ", vehicle_name);
    console.log("plate_no: ", plate_no);
    if (state == "allowed"){
        let new_s = "Not allowed";
        await query(`UPDATE Ztt5Nb4KuO.vehicles SET state='${new_s}' where username='${usr}' and vehiclename='${vehicle_name}' and plateno='${plate_no}'`)
        return res.json({ status: "good"});
    }
    else if(state == "Not allowed"){
        let new_s = "allowed";
        await query(`UPDATE Ztt5Nb4KuO.vehicles SET state='${new_s}' where username='${usr}' and vehiclename='${vehicle_name}' and plateno='${plate_no}'`)
        return res.json({ status: "good"});
    }
    else{
        return res.json({ status: "error", error:"Some error"});
    }
})


app.post('/visitor', async (req,res)=>{
    const visitor_name = req.body.name;
    const noc = req.body.cnic;
    const token = req.headers['x-access-token'];
    console.log(token);
    const decoded = jwt.verify(token, "talha");
    console.log(visitor_name, noc);
    console.log(decoded.name);
    if (!visitor_name || !noc){
        console.log("if (!visitor_name || !noc): ",visitor_name,noc);
        return res.json({status: "error", error: "Please enter all the data"});
    }
    if(!decoded.name || decoded.name == "admin"){
        return res.json({status: "error1", error: "login correctly to access"});
    }
    if(isNaN(noc) || noc.length!=13){
        return res.json({ status: "error", error: "Only 13 digit cnic is allowed"});
    }
    const  s= await query(`select * from Ztt5Nb4KuO.visitors where cnic = '${noc}'`);
    console.log("s: ",s);
    if(s.length != 0){
        return res.json({ status: "error", error: "wrong cnic"});
    }
    con.connect(async (err)=>{
        console.log("before seeding: ",decoded.name,visitor_name,noc);
        await seedData(`INSERT INTO Ztt5Nb4KuO.visitors (username,visitorname,cnic,state) VALUES ('${decoded.name}','${visitor_name}','${noc}','Not allowed')`);
        await seedData(`INSERT INTO Ztt5Nb4KuO.visitorfacilities (username,visitorname,gym,library) VALUES ('${decoded.name}','${visitor_name}',"Not allowed","Not allowed")`);
        res.json({ status: "success", error: "succeeded"});
    })
})


app.post('/vehicle', async (req,res)=>{
    const vehicle_name = req.body.name;
    const no = req.body.number;
    const token = req.headers['x-access-token'];
    console.log(token);
    const decoded = jwt.verify(token, "talha");
    console.log(vehicle_name,);
    console.log(decoded.name);
    if (!vehicle_name || !no){
        console.log("if (!vehicle_name || !no): ",vehicle_name,no);
        return res.json({status: "error", error: "Please enter all the data"});
    }
    if(!decoded.name || decoded.name == "admin"){
        return res.json({status: "error1", error: "login correctly to access"});
    }
    let x = 0;
    if(no.includes("-")){
        const a = no.split("-");
        console.log("a: ",a);
        if(!isNaN(a[0]) || isNaN(a[1]) || a[0].length !=3 || a[1].length !=3){
           x = 1;
           console.log("here x: ",x);
        }
    }
    else{
        return res.json({status: "error", error: "plate no can be of the form abc-123"});
    }
    if(x ==1){
        return res.json({status: "error", error: "plate no can be of the form abc-123"});
    }
    const car = await query(`select vehiclename,plateno from Ztt5Nb4KuO.vehicles where vehiclename='${vehicle_name}' and plateno='${no}'`);
    if(car.length !=0){
        return res.json({status: "error", error: "car already exists"});
    }
    const o = await query(`select occupation from Ztt5Nb4KuO.users where username='${decoded.name}'`);
    console.log("o: ",o);
    let ite = "NULL";
    if(o[0].occupation == "staff"){
        ite = arr[Math.floor(Math.random()*arr.length)];
    }
    con.connect(async (err)=>{
        console.log("before seeding: ",decoded.name,vehicle_name,no);
        await seedData(`INSERT INTO Ztt5Nb4KuO.vehicles (username,	vehiclename,plateno,state,item) VALUES ('${decoded.name}','${vehicle_name}','${no}','Not allowed','${ite}')`);
        res.json({ status: "success", error: "succeeded"});
    })
})

app.get('/viewrequests', async (req,res)=>{
    const token = req.headers["x-access-token"];
    if(!token){
        return res.json({status: "error", error: "login correctly to access"});
    }
    const decoded = jwt.verify(token, "talha");
    console.log("decoded: ",decoded.name);
    if(!decoded.name || decoded.name == "admin"){
        return res.json({status: "error", error: "login correctly to access"});
    }
    const s = await query(`select * from Ztt5Nb4KuO.visitors where username='${decoded.name}'`);
    const s1 = await query(`select * from Ztt5Nb4KuO.vehicles where username='${decoded.name}'`);
    const s2 = await query(`select * from Ztt5Nb4KuO.visitorfacilities where username='${decoded.name}'`);
    console.log("s: ",s);
    console.log("s1: ",s1);
    console.log("s2: ",s2);
    return res.json({status: "good", data:s, data1: s1, data2: s2});
})


app.get('/viewrequestsadmin', async (req,res)=>{
    const token = req.headers["x-access-token"];
    const decoded = jwt.verify(token, "talha");
    console.log("decoded: ",decoded.name);
    console.log("typeof decoded: ",typeof decoded.name);
    console.log("token: ",token);
    if(decoded.name != "admin"){
        return res.json({ status: "error", error: "Only admin can visit this page"});
    }
    const s = await query(`select * from Ztt5Nb4KuO.visitors`);
    const s1 = await query(`select * from Ztt5Nb4KuO.vehicles`);
    const s2 = await query(`select * from Ztt5Nb4KuO.vehicles`);
    console.log("s: ",s);
    console.log("s1: ",s1);
    return res.json({ data:s, data1:s1});
})


app.post('/delete', async (req,res)=>{
    console.log("inside /delete");
    console.log("req.body: ",req.body);
    const token = req.headers["x-access-token"];
    const decoded = jwt.verify(token, "talha");
    console.log("decoded: ",decoded.name);
    console.log("typeof decoded: ",typeof decoded.name);
    console.log("token: ",token);
    if(decoded.name != "admin"){
        return res.json({ status: "error", error: "Only admin can visit this page"});
    }
    const usr = req.body.usrname;
    console.log("usr: ",usr);
    await query(`Delete from Ztt5Nb4KuO.users where username='${usr}'`)
    await query(`Delete from Ztt5Nb4KuO.tas where ta='${usr}'`)
    await query(`Delete from Ztt5Nb4KuO.visitors where username='${usr}'`)
    await query(`Delete from Ztt5Nb4KuO.vehicles where username='${usr}'`)
    await query(`Delete from Ztt5Nb4KuO.visitorfacilities where username='${usr}'`)
    await query(`Delete from Ztt5Nb4KuO.facilities where username='${usr}'`)
    return res.json({ status: "good"});
})


app.post('/deletevisitor', async (req,res)=>{
    console.log("inside /deletevisitor");
    console.log("req.body: ",req.body);
    const token = req.headers["x-access-token"];
    const decoded = jwt.verify(token, "talha");
    console.log("decoded: ",decoded.name);
    console.log("typeof decoded: ",typeof decoded.name);
    console.log("token: ",token);
    if(decoded.name != "admin"){
        return res.json({ status: "error", error: "Only admin can visit this page"});
    }
    // const usr = req.body.usrname;
    const noc = req.body.cnic;
    console.log("noc: ",noc);
    await query(`Delete from Ztt5Nb4KuO.visitors where cnic='${noc}'`)
    return res.json({ status: "good"});
})

app.post('/deletevehicle', async (req,res)=>{
    console.log("inside /deletevisitor");
    console.log("req.body: ",req.body);
    const token = req.headers["x-access-token"];
    const decoded = jwt.verify(token, "talha");
    console.log("decoded: ",decoded.name);
    console.log("typeof decoded: ",typeof decoded.name);
    console.log("token: ",token);
    if(decoded.name != "admin"){
        return res.json({ status: "error", error: "Only admin can visit this page"});
    }
    const usr = req.body.usrname;
    const vehi = req.body.vehiname;
    const plt = req.body.pltno;
    await query(`Delete from Ztt5Nb4KuO.vehicles where (username='${usr}' and vehiclename='${vehi}' and plateno='${plt}')   `)
    return res.json({ status: "good"});
})

app.listen(5000, ()=>{
    console.log("server running");
})