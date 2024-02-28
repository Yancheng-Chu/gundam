const mysql = require("mysql")
const connection = mysql.createConnection({
  host:"localhost",
  user:"root",
  password:"123456789",
  database:"party"
})
connection.connect();
connection.query('select * from User', (err,results,fields) => {
if(err) throw err;
console.log(results)
}
)