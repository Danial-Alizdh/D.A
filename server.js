const express = require('express');
const nodemailer = require('nodemailer');
const fileUpload = require('express-fileupload');

const app = express();

app.use(fileUpload({
  limits: { fileSize: 10 * 1024 * 1024 * 1024 //10MB max file(s) size
	  },
}));

app.use(express.json());
app.use(express.limit("10mb"));

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
			attachments: [{
				filename: 'image.png',
            			content: new Buffer(bb, 'base64')
			}]
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

app.post('/buffer', (req, res) => {
	console.log(req.body);
	return res.json({file: "200"});
	//sendEmail(res, "Subject", "Hello", req.body.image);
});

app.listen(PORT, () => log('Server is starting on PORT,', 8080));
