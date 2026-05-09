import express, { Request, Response } from 'express';
import passport from 'passport';
import userHandler from '../handlers/user.js'
import {
    multerUploads,
    dataUri
} from '../config/multer.js';
import {
    cloudinaryConfig
} from '../config/cloudinary.js'

const userRouter = express.Router();

/**
 * @openapi
 * /:
 *   get:
 *     description: Root endpoint for Grubhub Server
 *     responses:
 *       200:
 *         description: Returns a string message.
 */
userRouter.get('/', (req: Request, res: Response) => {
    res.send("Grubhub Server Home");
})

/**
 * @openapi
 * /register:
 *   post:
 *     description: Register a new user
 *     responses:
 *       200:
 *         description: Successfully registered user.
 */
userRouter.post('/register', passport.authenticate('register'), (req: Request, res: Response) => {
    const userDetails = req.body;
    return userHandler.registerUser(userDetails).then(result => {
        res.cookie('grubhubCookie', result.token, {
            maxAge: 900000,
            httpOnly: false
        });
        return res.status(200).json(result);
    }).catch(err => {
        return res.status(500).json(err);
    });
});

userRouter.post('/login', passport.authenticate('login'), (req: Request, res: Response) => {
    const userCredentials = req.body;
    console.log(req.body);
    return userHandler.loginUser(userCredentials).then(result => {
        res.cookie('grubhubCookie', result.token, {
            maxAge: 900000,
            httpOnly: false
        });
        return res.status(200).json(result);
    }).catch(err => {
        return res.status(500).json(err);
    });
});

userRouter.put("/userUpdate/:user_id", passport.authenticate("jwt"), (req: Request, res: Response) => {
    const userDetails = req.body;
    userDetails.user_id = req.params.user_id;
    return userHandler.updateUser(userDetails).then(result => {
        res.status(200).json(result);
    }).catch(err => {
        res.status(500).json(err);
        console.log("ERROR: ", err)
    })
})

userRouter.get("/user/:user_id", (req: Request, res: Response) => {
    userHandler.getUser(req.params.user_id).then(result => {
        res.status(200).json(result);
    }).catch(err => {
        res.status(500).json(err);
    });
});

userRouter.post("/upload/image", multerUploads, cloudinaryConfig, (req: Request, res: Response) => {
    let file: any;
    if (req.file) {
        file = dataUri(req).content;
    } else {
        return res.status(400).json({
            message: 'File not uploaded!'
        });
    }
    userHandler.uploadUserImage(file).then(result => {
        res.status(200).json(result);
    }).catch(err => {
        res.status(500).json(err);
    });
});

export default userRouter;
