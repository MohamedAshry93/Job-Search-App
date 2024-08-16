import multer from "multer";
import fs from "fs";
import path from "path";
import { DateTime } from "luxon";
import { nanoid } from "nanoid";
import ErrorHandlerClass from "./../Utils/error-class.utils.js";

const multerLocalMiddleware = ({
    filePath = "general",
    allowedExtensions,
} = {}) => {
    const destinationPath = path.resolve(`src/uploads/${filePath}`);
    if (!fs.existsSync(destinationPath)) {
        fs.mkdirSync(destinationPath, { recursive: true });
    }
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, destinationPath);
        },
        filename: function (req, file, cb) {
            const uniqueFileName =
                DateTime.now().toFormat("yyyy-MM-dd") +
                "_" +
                nanoid(4) +
                "_" +
                file.originalname;
            cb(null, uniqueFileName);
        },
    });
    const fileFilter = (req, file, cb) => {
        if (allowedExtensions?.includes(file.mimetype)) {
            return cb(null, true);
        }
        cb(new ErrorHandlerClass("File type not allowed", 400), false);
    };
    return multer({ fileFilter, storage });
};

const multerHostMiddleware = ({ allowedExtensions }) => {
    const storage = multer.diskStorage({
        filename: function (req, file, cb) {
            const uniqueFileName =
                DateTime.now().toFormat("yyyy-MM-dd") +
                "_" +
                nanoid(4) +
                "_" +
                file.originalname;
            cb(null, uniqueFileName);
        },
    });
    const fileFilter = (req, file, cb) => {
        if (allowedExtensions?.includes(file.mimetype)) {
            return cb(null, true);
        }
        cb(new ErrorHandlerClass("File type not allowed", 400), false);
    };
    return multer({ fileFilter, storage });
};
export { multerLocalMiddleware, multerHostMiddleware };
