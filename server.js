const express = require('express');
const app=express()
const nodemailer=require('nodemailer')
const dotenv=require('dotenv').config()
// const fapshi = require('./fabshi');
const cors=require('cors')

const hostname = 'Localhost';
const port = 3000;

app.use(express.json())
app.use(express.urlencoded())
app.use(cors({
  origin:'*'
}))

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user:process.env.email,
        pass:process.env.password,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN
    }
});

let  mailOptions = {
    from: process.env.email,
    to: 'bongyucletus28@gmail.com',
    subject: 'Sending Email using Node.js',
    text: 'That was easy! Was is it not?'
};

// async function main(){
//     const payment = {
//         amount: 500, //fapshi
//         email: 'cletusberinyuy@email.com',
//         externalId: '12345',
//         userId: 'abcde',
//         // redirectUrl: 'https://mywebsite.com',
//         message: 'Eventix event ticket',
//     }
//     const resp = await fapshi.initiatePay(payment)
//     // const resp = await fapshi.paymentStatus('lyhXMC9h')
//     // const resp = await fapshi.expirePay('lyhXMC9h')
//     console.log(resp)
//     return resp
// }
app.get('/', (req, res) => {
    // transporter.sendMail(mailOptions, function(error, info){
    //     if (error) {
    //       console.log(error);
    //     } else {
    //       console.log('Email sent: ' + info.response);
    //     }
    //   });
    //   main()
    res.send('Hello from server ');
});
app.get('/initiate-pay',async (req, res) => {
    // let resp=await main()
    // res.json(resp);
    res.json({message:'Get success'})
});
app.post('/initiate-pay',async (req, res) => {
    // console.log(req.body)
    // let resp=await main()
    // res.json(resp);
    res.json({message:'Post success'})
});

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});