const nodemailer = require("nodemailer");

exports.sendMail = async (req, res, user) => {
    const OTP = Math.floor(1000 + Math.random() * 9000);
    const transport = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 465,
        auth: {
            user: process.env.MAIL_ID,
            pass: process.env.MAIL_PWD,
        },
    });

    const mailOptions = {
        from: "gour_sahaab Pvt. Ltd.<gournitin39@gmail.com>",
        to: req.body.email,
        subject: "Password Reset Link",
        html: `
                <h1>Password Reset OTP</h1>
                <h3>OTP: ${OTP}</h3>
            `,
            
    };

    transport.sendMail(mailOptions, async (err, info) => {
        if (err) return res.send(err);
        console.log(info);

        user.otp = OTP;
        await user.save();
        console.log(OTP)
        return res.redirect(`/verify-otp/${user._id}`);
    });
};