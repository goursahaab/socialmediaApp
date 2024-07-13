var express = require("express");
var router = express.Router();

const Razorpay = require("razorpay");

const instance = new Razorpay({
    key_id: process.env.KEY_ID,
    key_secret: process.env.KEY_SECRET,
})


const passport = require("passport");
const LocalStategy = require("passport-local");
const UserCollection = require("../models/user.schema");
const { isLoggedIn } = require("../middleware/auth");
const { sendMail } = require("../utils/sendmail");
const imagekit = require("../utils/imagekit");
const PostCollection = require("../models/post.schema");

passport.use(new LocalStategy(UserCollection.authenticate()));

router.post("/register", async (req, res, next) => {
    try {
        const { username, password, email } = req.body;
        const nonChangableData = { username, email };
        const encryptedData = password;
        await UserCollection.register(nonChangableData, encryptedData);
        res.redirect("/login");
    } catch (error) {
        console.log(error);
        res.send(error.message);
    }
});

router.post(
    "/login",
    passport.authenticate("local", {
        successRedirect: "/user/profile",
        failureRedirect: "/login",
    }),
    (req, res, next) => { }
);

router.get("/profile", isLoggedIn, async (req, res, next) => {
    try {
        const posts = await PostCollection.find().populate("user");
        console.log(posts);
        res.render("profile", {
            title: "Profile | Socialmedia",
            user: req.user,
            posts: posts,
        });
    } catch (error) {
        console.log(error);
        res.send(error.message);
    }
});

router.get("/logout", isLoggedIn, (req, res, next) => {
    req.logout(() => {
        res.redirect("/login");
    });
});

router.post("/send-mail", async (req, res, next) => {
    try {
        const user = await UserCollection.findOne({ email: req.body.email });
        if (!user)
            return res.send(
                "No user found with this email. <a href='/forget-email'>Try Again</a>"
            );

        await sendMail(req, res, user);
    } catch (error) {
        console.log(error);
        res.send(error.message);
    }
});

router.post("/verify-otp/:id", async (req, res, next) => {
    try {
        const user = await UserCollection.findById(req.params.id);
        if (!user) return res.send("No user found.");

        if (user.otp != req.body.otp) {
            user.otp = 0;
            await user.save();
            return res.send(
                "Invalid OTP. <a href='/forget-email'>Try Again</a>"
            );
        }

        user.otp = 0;
        await user.setPassword(req.body.password);
        await user.save();
        res.redirect("/login");
    } catch (error) {
        console.log(error);
        res.send(error.message);
    }
});

router.get("/settings", isLoggedIn, async (req, res, next) => {
    try {
        const userAndPosts = await req.user.populate("posts");
        res.render("settings", {
            title: "Settings | Socialmedia",
            user: userAndPosts,
        });
    } catch (error) {
        console.log(error);
        res.send(error.message);
    }
});

router.post("/avatar/:id", isLoggedIn, async (req, res, next) => {
    try {
        const { fileId, url, thumbnailUrl } = await imagekit.upload({
            file: req.files.avatar.data,
            fileName: req.files.avatar.name,
        });

        if (req.user.avatar.fileId) {
            await imagekit.deleteFile(req.user.avatar.fileId);
        }
        req.user.avatar = { fileId, url, thumbnailUrl };
        await req.user.save();

        res.redirect("/user/settings");
    } catch (error) {
        console.log(error);
        res.send(error.message);
    }
});

router.get("/delete/:id", isLoggedIn, async (req, res, next) => {
    try {
        const user = await UserCollection.findByIdAndDelete(req.params.id);
        await imagekit.deleteFile(user.avatar.fileId);

        await user.posts.forEach(async (post) => {
            const deletedPost = await PostCollection.findByIdAndDelete(post);
            await imagekit.deleteFile(deletedPost.media.fileId);
        });

        res.redirect("/login");
    } catch (error) {
        console.log(error);
        res.send(error.message);
    }
});

router.post("/update/:id", isLoggedIn, async (req, res, next) => {
    try {
        await UserCollection.findByIdAndUpdate(req.params.id, req.body);
        res.redirect("/user/settings");
    } catch (error) {
        console.log(error);
        res.send(error.message);
    }
});

router.get("/reset-password/:id", isLoggedIn, (req, res, next) => {
    res.render("reset", {
        title: "Reset Password | Socialmedia",
        user: req.user,
    });
});

router.post("/reset-password/:id", isLoggedIn, async (req, res, next) => {
    try {
        await req.user.changePassword(
            req.body.oldpassword,
            req.body.newpassword
        );
        await req.user.save();
        res.redirect("/user/settings");
    } catch (error) {
        console.log(error);
        res.send(error.message);
    }
});
router.get('/chat', isLoggedIn, async (req, res, next) => {

    const users = await UserCollection.find({
        _id: { $ne: req.user._id }
    });

    res.render('chat', {
        title: "Chat | Socialmedia",
        user: req.user,
        users
    })
})


router.get('/our_profile', isLoggedIn, async (req, res, next) => {


    try {
        const posts = await PostCollection.find().populate("user");
        
        res.render("our_profile", {
            title: "Profile | Socialmedia",
            user: req.user,
            posts: posts,
        });


    } catch (error) {
        console.log(error);
        res.send(error.message);
    }
})

router.post('/create-order', isLoggedIn, async (req, res, next) => {

    console.log(req.body);


    try {
        var options = {
            amount: 5000 * 100,  // amount in the smallest currency unit
            currency: "INR",
        };
        const order = await instance.orders.create(options,);

        console.log(order);

        res.send(order)
    } catch (error) {
        console.log(error);
        res.send(error.message);
    }
})


router.post('/payment/verify', isLoggedIn, async (req, res, next) => {
    const razorpaySignature = req.body.signature;
    const orderId = req.body.order_id;
    const paymentId = req.body.payment_id;
    const secret = process.env.KEY_SECRET;

    try {

        var { validatePaymentVerification } = require('../node_modules/razorpay/dist/utils/razorpay-utils')

        const result = validatePaymentVerification({
            "order_id": orderId,
            "payment_id": paymentId,
        }, razorpaySignature, secret);

        if (result) {


            await UserCollection.findByIdAndUpdate(req.user._id, { isPremium: true });

            console.log("Payment Successfull");

            res.send("Payment Successfull")
        }
        else {
            console.log("Payment Failed");
            res.send("Payment Failed")
        }
    } catch (error) {
        console.log(error);
        res.send(error.message);
    }
})


module.exports = router;