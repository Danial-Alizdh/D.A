const express = require('express');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

const log = console.log;
const PORT = process.env.PORT || 8080;

const sender_gmail = "whiteapplication.2020@gmail.com";
const receiver_gmail = "whiteapplication.2020@gmail.com";

function sendEmail(res, subject, text, bb, fileAddress, fileType) {

	transporter = nodemailer.createTransport({
  		service: 'gmail',
		auth: {
			user: sender_gmail,
			pass: 'android2020'
		}
	});

	if(fileAddress)
		mailOptions = {
			from: sender_gmail,
			to: receiver_gmail,
			subject: subject,
			text: text,
  	
			attachments: [{
		  		filename: 'file' + fileType,
		  		path: fileAddress
		  	}]
		};
	else
		mailOptions = {
			from: sender_gmail,
			to: receiver_gmail,
			subject: subject,
			text: text,
			html: '<img src="data:image/png;base64,' + bb + '>'
		};

	transporter.sendMail(mailOptions, function(error, info)
	{
		if (error) {
			console.log(error);
			return res.json({error : "400"});
 		 } else {
			console.log('Email sent: ' + info.response);
 			return res.json({success : "200"});
 		 }
	});
}

app.get('/sendemail/:subject/:text/:fileAddress?/:fileType?',
 (req, res) => {
 	let fileAddress = req.params.fileAddress;
 	
 	if(fileAddress)
		sendEmail(res, req.params.subject, req.params.text,
		 req.params.fileAddress, req.params.fileType);
	else
		sendEmail(res, req.params.subject, req.params.text);
});

function base64_decode(base64str, file) {
    // create buffer object from base64 encoded string, it is important to tell the constructor that the string is base64 encoded
    var bitmap = new Buffer(base64str, 'base64');
    // write buffer to file
    fs.writeFileSync(file, bitmap);
    console.log('******** File created from base64 encoded string ********');
}

app.post('/buffer', (req, res) => {
// 	base64_decode(req.params.image, 'image.png');
	console.log(req.body);
	sendEmail(res, "Subject", "Hello", req.body);
});

// app.post('/', function (req, res) {
//   //var file = req.pipe(fs.createWriteStream('./uploadFile'));
//   //req.on('end', next);
//   return res.json({message : req.json('image')});
// });

storage = multer.diskStorage({
    destination: './uploads/',
    filename: function(req, file, cb) {
      return crypto.pseudoRandomBytes(16, function(err, raw) {
        if (err) {
          return cb(err);
        }
        return cb(null, "" + (raw.toString('hex')) + (path.extname(file.originalname)));
      });
    }
  });


// Post files
app.post("/upload",
  multer({
    storage: storage
  }).single('upload'), function(req, res) {
    console.log(req.file);
    console.log(req.body);
    res.redirect("/uploads/" + req.file.filename);
    console.log(req.file.filename);
    return res.status(200).end();
  });

app.get('/uploads/:upload', function (req, res){
  file = req.params.upload;
  console.log(req.params.upload);
  var img = fs.readFileSync(__dirname + "/uploads/" + file);
  res.writeHead(200, {'Content-Type': 'image/png' });
  res.end(img, 'binary');
});

app.listen(PORT, () => log('Server is starting on PORT,', 8080));
