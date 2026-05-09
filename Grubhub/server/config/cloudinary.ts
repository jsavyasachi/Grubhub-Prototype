import {
    v2 as cloudinary,
    ConfigOptions
} from 'cloudinary';
import { Request, Response, NextFunction } from 'express';

const cloudinaryConfig = (req: Request, res: Response, next: NextFunction) => {
    cloudinary.config({
        cloud_name: 'savya-cloudinary',
        api_key: '565435984852792',
        api_secret: '9CeQ9Ei2r-BVyo39US03imUFLtM',
    });
    next();
}

const uploader = cloudinary.uploader;

export {
    cloudinaryConfig,
    uploader
};
