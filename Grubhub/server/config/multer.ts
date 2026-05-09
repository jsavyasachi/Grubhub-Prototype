import multer from "multer";
import DatauriParser from 'datauri/parser.js';
import path from 'path';
import { Request } from 'express';

const storage = multer.memoryStorage();
const multerUploads = multer({
    storage
}).single("file");
const parser = new DatauriParser();

const dataUri = (req: Request) => {
    if (!req.file) {
        throw new Error('No file uploaded');
    }
    return parser.format(path.extname(req.file.originalname).toString(), req.file.buffer);
};

export {
    multerUploads,
    dataUri
};
