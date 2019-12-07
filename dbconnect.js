var mysql = require('mysql');
var fs = require('fs')
const [host,user,pass] = fs.readFileSync('admin.txt').toString().split("\r\n");
var con = mysql.createConnection({
    host: host,
    user:  user,
    password: pass,
});;
function setupDatabase(){
    con.connect((err) => {
    if(err){
        console.log('Error connecting to Db');
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
    const auth = {login: user, password: pass}
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