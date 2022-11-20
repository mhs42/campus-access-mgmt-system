const dotenv = require("dotenv");
const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser')
dotenv.config({path:".env"});
const app = express();
app.use(bodyParser.urlencoded({extended:true}));


var con = mysql.createConnection(
    {
        host:process.env.host,
        user: process.env.user,
        password:process.env.password,
        database:process.env.database
    }
);


function createTable(CreateQuerry)
{
    con.query(CreateQuerry,
        (err,result)=>
        {
            if(err)
            {
                console.log("Table creation failed");
                console.log(err);
            }
            else
            {
                console.log("Table created");
                //console.log(result);
            }
        });
}


con.connect((error)=>
{
    createTable('CREATE TABLE users (username VARCHAR(255),password VARCHAR(255),occupation VARCHAR(255),state VARCHAR(255))');
    con.end();
});