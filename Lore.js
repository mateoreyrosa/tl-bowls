var express = require('express');
const { session_key, sendgrid_key } = require('./config');
var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');
var flash = require('express-flash');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var validator = require('express-validator');

var nodemailer = require('nodemailer');
var sgMail = require('@sendgrid/mail');
var path = require('path');

const {sendgrip_key, }


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({secret: session_key}));
  app.use(flash());


// prepare server
 // redirect API calls
 app.use('/', express.static(__dirname + '/www')); // redirect root
 app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
 app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
 app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap
app.engine('handlebars', handlebars.engine);
app.use(express.static('Pictures'));
app.use(express.static('CSS'));
app.set('view engine', 'handlebars');
app.set('port', 3881);





app.get('/',function(req,res){
 res.render('home');
});

app.get('/ContactUs',function(req,res){
 res.render('contactus');
});

app.post('/ContactUs', function(req, res){

  sgMail.setApiKey(sendgrid_key);
  var msg = {
    to: req.body.ContactEmail,
    from: 'ThomasLittle@TLBowls.com',
    subject: 'TL Bowls Thanks You!',
    html: '<p>{{ContactName}}, thank you for reaching out to us. We usually respond to contact inquiries within a few hours. In the meantime, be sure to check our our site!</p><p><a href="http://flip2.engr.oregonstate.edu:{{port}}/">TLBowls.com</a></p>',
    substitutions: {"ContactName": req.body.ContactName, "port": app.get('port')},
  };
  sgMail.send(msg);
  msg = {
    to: 'littlethomas98@gmail.com',
    from: 'ThomasLittle@TLBowls.com',
    subject: 'Testing SMTP Email protocols - not a real message',
    html: '<p>You have received the following message from {{ContactName}}, at {{Email}}: {{Message}}</p><p><a href="http://flip2.engr.oregonstate.edu:{{port}}/">Click for website TLBowls.com</a></p>',
    substitutions: {"ContactName": req.body.ContactName, "Email": req.body.ContactEmail,"port": app.get('port'), "Message": req.body.Message},
  };
  sgMail.send(msg);
var context = {};
context.ContactName = req.body.ContactName;
context.ContactEmail = req.body.ContactEmail;
context.Message = req.body.Message;
req.flash('success', 'Thank you ' + context.ContactName + '! We will be in touch')
  res.render('contactus', context);
});

app.get('/About',function(req,res){
 res.render('about');
});

app.get('/Store',function(req,res){

 res.render('store');
});
//downlaod
app.get('/CustomOrderInstructions', function(req, res){

  var file = 'CustomOrderInstructions.txt';
   res.download(file);


});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){

  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
