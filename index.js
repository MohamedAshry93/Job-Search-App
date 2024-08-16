import express from "express";
import { config } from "dotenv";
import path from "path";

import ErrorHandlerClass from "./src/Utils/error-class.utils.js";
import { globalResponse } from "./src/Middlewares/error-handle.middleware.js";
import { connectionDB } from "./database/connection.js";
import userRouter from "./src/Modules/Users/user.routes.js";
import companyRouter from "./src/Modules/Companies/company.routes.js";
import jobRouter from "./src/Modules/Jobs/job.routes.js";

if (process.env.NODE_ENV == "prod") {
    config({ path: path.resolve(".prod.env") });
}
if (process.env.NODE_ENV == "dev") {
    config({ path: path.resolve(".dev.env") });
}
config();

const app = express();
let port = process.env.PORT;

app.use(express.json());
app.use("/users", userRouter);
app.use("/companies", companyRouter);
app.use("/jobs", jobRouter);
app.use("src/uploads", express.static(path.resolve("src/uploads")));

connectionDB();

app.use("*", (req, res, next) =>
    next(
        new ErrorHandlerClass(
            `Invalid url ${req.originalUrl}`,
            404,
            "at index.js or modules.routes.js",
            "error in API route",
            "No route found"
        )
    )
);
app.use(globalResponse);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
