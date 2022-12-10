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
//DO NOT MODIFY ANY PART OF THIS CODE USELESS TOLD TO DO SO.
/*Add you connestion details to the env file*/

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const con = mysql.createConnection(
    {
        host:process.env.host,
        user: process.env.user,
        password:process.env.password,
        database:process.env.database
    }
);

function seedData(query)
{
    /*
    Call this fuction to  insert a record into your db to the respective table using 
    the query.The variable query corresponds to the sql query you will write to accomplish this. 
     */
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

con.connect(async (err)=>
{
    if(err)
    {
        console.log(err);
    }
    else
    {
        let usr = "23100293";
        let pass = bcrypt.hashSync(usr, salt);
        let occupation = "admin";
        await seedData(`INSERT INTO Ztt5Nb4KuO.users (username,password,occupation,state) VALUES ('${usr}','${pass}','${occupation}','denied')`);
        // let sse = 23100000;
        // let sdsb = 23110000;
        // let hss = 23020000;
        // let law = 23010000;

        // for(let i =0; i<400; i++){
        //     if(sse == 23100293){
        //         continue;
        //     }
        //     let usr = sse.toString();
        //     let pass = bcrypt.hashSync(usr, salt);
        //     let occupation = "student";
        //     await seedData(`INSERT INTO Ztt5Nb4KuO.users (username,password,occupation,state) VALUES ('${usr}','${pass}','${occupation}','Not allowed')`);
        //     let usr1 = sdsb.toString();
        //     let pass1 = bcrypt.hashSync(usr, salt);
        //     let occupation1 = "student";
        //     await seedData(`INSERT INTO Ztt5Nb4KuO.users (username,password,occupation,state) VALUES ('${usr1}','${pass1}','${occupation1}','Not allowed')`);
        //     let usr2 = hss.toString();
        //     let pass2 = bcrypt.hashSync(usr, salt);
        //     let occupation2 = "student";
        //     await seedData(`INSERT INTO Ztt5Nb4KuO.users (username,password,occupation,state) VALUES ('${usr2}','${pass2}','${occupation2}','Not allowed')`);
        //     let usr3 = law.toString();
        //     let pass3 = bcrypt.hashSync(usr, salt);
        //     let occupation3 = "student";
        //     await seedData(`INSERT INTO Ztt5Nb4KuO.users (username,password,occupation,state) VALUES ('${usr3}','${pass3}','${occupation3}','Not allowed')`);
        //     sse+=1;
        //     sdsb+=1;
        //     hss+=1;
        //     law+=1;
        // }
        // for(let i=0; i<100;i++){
        //     let usr = makeid(5);
        //     let pass = bcrypt.hashSync(usr, salt);
        //     let occupation = "faculty";
        //     await seedData(`INSERT INTO Ztt5Nb4KuO.users (username,password,occupation,state) VALUES ('${usr}','${pass}','${occupation}','Not allowed')`);
        // }
        // for(let i=0; i<300;i++){
        //     let usr = makeid(5);
        //     let pass = bcrypt.hashSync(usr, salt);
        //     let occupation = "staff";
        //     await seedData(`INSERT INTO Ztt5Nb4KuO.users (username,password,occupation,state) VALUES ('${usr}','${pass}','${occupation}','Not allowed')`);
        // }

    }
});