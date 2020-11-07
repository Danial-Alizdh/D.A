const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();

// app.use(express.json({limit: '20mb'}));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

const log = console.log;
const PORT = process.env.PORT || 8080;

const sender_gmail = "whiteapplication.2020@gmail.com";
const receiver_gmail = "whiteapplication.2020@gmail.com";

function sendEmail(res, subject, text, fileBuffer, fileName) {

	transporter = nodemailer.createTransport({
  		service: 'gmail',
		auth: {
			user: sender_gmail,
			pass: 'android0617'
		}
	});
	
	if (fileBuffer == null) {
		mailOptions = {
			from: sender_gmail,
			to: receiver_gmail,
			subject: subject,
			text: text
		};
	}
	else {
		console.log('Image become encoding..');
		mailOptions = {
			from: sender_gmail,
			to: receiver_gmail,
			subject: subject,
			text: text,
			attachments: [{
				filename: fileName,
            			content: new Buffer(fileBuffer, 'base64')
			}]
		};
	}

	transporter.sendMail(mailOptions, function(error, info)
	{
		if (error) {
			console.log('Email error: ' + error);
			return res.json({error : "400"});
 		 } else {
			console.log('Email sent: ' + info.response);
 			return res.json({success : "200"});
 		 }
	});
}

app.post('/buffer', (req, res) => {
	console.log('Image received: ' + req.body.fileName);
	sendEmail(res, req.body.subject, req.body.text, req.body.fileBuffer, req.body.fileName);
});

app.post('/info', (req, res) => {
	sendEmail(res, req.body.subject, req.body.text);
});

app.listen(PORT, () => log('Server is starting on PORT,', 8080));
