var mysql = require('mysql');
var fs = require('fs')
var info = fs.readFileSync('admin.txt').toString().split(/\r?\n/);
var dotenv = require('dotenv');
dotenv.config();
var config = {
    user: process.env.SQL_USER,
    database: process.env.SQL_DATABASE,
    password: process.env.SQL_PASSWORD
}

if (process.env.INSTANCE_CONNECTION_NAME && process.env.NODE_ENV === 'production') {
    config.socketPath = `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`;
}else{
    config.host = "35.196.75.75";
}
console.log(config)
var con = mysql.createConnection(config);

function setupDatabase(){
    con.connect((err) => {
    if(err){
        console.log('Error connecting to Db', err);
        return;
    }
    var sql = "USE csuva";
    con.query(sql, function (err, result) {
        if (err){
        console.log(err);
        return;
        }
        console.log('Connection established');
    });
    });
}
function getCon(){
    return con;
}
function setupAdmin(){
    var setup = (req,res,next) => {
    const auth = {login: info[0], password: info[1]}
    const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
    const [login, password] = new Buffer.from(b64auth, 'base64').toString().split(':')
    if (login && password && login === auth.login && password === auth.password) {
      return next()
    }
    res.set('WWW-Authenticate', 'Basic realm="401"')
    res.status(401).send('Authentication required.')
    }
    return setup;
}


module.exports.setupDatabase = setupDatabase;
module.exports.getCon = getCon;
module.exports.setupAdmin = setupAdmin;