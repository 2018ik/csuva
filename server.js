var express = require('express');
var app = express();
var admin = express();
var path = require('path');
var queries = require('./query.js'); //used for MySQL queries
var dbconnect = require('./dbconnect'); //used for setup 

dbconnect.setupDatabase();
admin.use(dbconnect.setupAdmin())
app.use(express.static('public'));
app.use(express.urlencoded());
app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/img', express.static(__dirname + '/img'));
app.use('/scss', express.static(__dirname + '/scss'));
app.use('/vendor', express.static(__dirname + '/vendor'));
admin.use('/admin', express.static(__dirname + '/admin'));
app.set('view engine', 'ejs');
// viewed at http://localhost:8080
app.get('/', function(req, res) {
  res.render(path.join(__dirname + '/index.ejs'));
});
app.post('/signup', function(req, res){
  queries.signUp(
    req.body.firstname,
    req.body.lastname,
    req.body.email,
    req.body.phone,
  );
  res.redirect('back');
});


admin.get('/', function(req, res) {
  queries.getMembers((err, result) => {
    if(err){
      res.render(path.join(__dirname + '/admin/admin.ejs'), {table: [{fname: null, lname: null, email: null, phone: null, date_joined: null}]});
    }
    res.render(path.join(__dirname + '/admin/admin.ejs'), {table: result});
  })
});
admin.post('/delete', function(req,res){
  queries.deleteMemberByDate(req.body.dateJoined);
  res.redirect('back');
});
app.use('/admin', admin)
app.listen(8080);
