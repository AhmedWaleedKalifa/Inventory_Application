const {Pool}=require("pg");
require("dotenv").config();
const {Client}=require("pg");
const path=require("node:path")
const fs = require('fs');
// const pool=new Pool({
//     connectionString: process.env.CONNECTION_STRING
// })
const pool = new Pool({
    connectionString: process.env.CONNECTION_STRING,
    ssl: {
      ca: fs.readFileSync(path.resolve(process.env.DB_SSL_CERT)).toString(),
      rejectUnauthorized: true 
    }
  });

module.exports=pool