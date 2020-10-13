const express = require('express');
const nodemailer = require('nodemailer');

const app = express();

app.use(express.json({limit: '20mb'}));

const log = console.log;
const PORT = process.env.PORT || 8080;

const sender_gmail = "whiteapplication.2020@gmail.com";
const receiver_gmail = "whiteapplication.2020@gmail.com";

function sendEmail(res, subject, text, fileBuffer, fileName) {

	transporter = nodemailer.createTransport({
  		service: 'gmail',
		auth: {
			user: sender_gmail,
			pass: 'android2020'
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
			console.log(error);
			return res.json({error : "400"});
 		 } else {
			console.log('Email sent: ' + info.response);
 			return res.json({success : "200"});
 		 }
	});
}

app.post('/buffer', (req, res) => {
	req.setTimeout(240000, function(){
		sendEmail(res, req.body.subject, req.body.text, req.body.fileBuffer, req.body.fileName);
        });
});

app.post('/info', (req, res) => {
	sendEmail(res, req.body.subject, req.body.text);
});

/*const server = */app.listen(PORT, () => log('Server is starting on PORT,', 8080));
// server.timeout = 5 * 60 * 1000;	//5 minuts
