const express = require('express');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const app = express();

const log = console.log;
const PORT = process.env.PORT || 8080;

function sendEmail(res, to, subject, text, fileAddress, fileType) {

	transporter = nodemailer.createTransport({
  		service: 'gmail',
		auth: {
			user: 'whiteapplication.2020@gmail.com',
			pass: 'android2020'
		}
	});

	if(fileAddress)
		mailOptions = {
			from: 'whiteapplication.2020@gmail.com',
			to: to,
			subject: subject,
			text: text,
  	
			attachments: [{
		  		filename: 'file' + fileType,
		  		path: 'to/' + fileAddress
		  	}]
		};
	else
		mailOptions = {
			from: 'whiteapplication.2020@gmail.com',
			to: to,
			subject: subject,
			text: text
		};

	transporter.sendMail(mailOptions, function(error, info)
	{
		if (error) {
			console.log(error);
			return res.json('400');
 		 } else {
			console.log('Email sent: ' + info.response);
 			return res.json('200');
 		 }
	});
}

app.get('/sendemail/:to/:subject/:text/:fileAddress?/:fileType?',
 (req, res) => {
 	let fileAddress = req.params.fileAddress;
 	
 	if(fileAddress)
		sendEmail(res, req.params.to, req.params.subject, req.params.text,
		 req.params.fileAddress, req.params.fileType);
	else
		sendEmail(res, req.params.to, req.params.subject, req.params.text);
});

app.get('/upload/:image', (req, res) => {
	return res.json(req.params);
});

app.post('/', function (req, res) {
  //var file = req.pipe(fs.createWriteStream('./uploadFile'));
  //req.on('end', next);
  return res.json({message : "received"});
});

app.listen(PORT, () => log('Server is starting on PORT,', 8080));
