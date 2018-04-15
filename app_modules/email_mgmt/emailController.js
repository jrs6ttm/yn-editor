/**
 * Created by Administrator on 2016/2/1.
 */
var nodeMailer = require('nodemailer');

exports.sendMessage = function(req, res){
    var name = req.body.dayNames
        ,email = req.body.email
        ,message = req.body.message;

    var transporter = nodeMailer.createTransport("SMTP",{
        service: 'QQ',
        port: 465,
        auth: {
            user: email,
            pass: 'jrs6ttm'
        }
    });
    var mailOptions = {
        from: name, // sender address
        to: 'jrs6ttm@163.com', // list of receivers
        subject: 'Hello~', // Subject line
        text: message, // plaintext body
        html: '<b>'+message+'</b>' // html body
    };
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
            res.send({success: false});
        }else{
            console.log('Message sent: ' + info.response);
            res.send({success: true});
        }
        transporter.close();
    });
};