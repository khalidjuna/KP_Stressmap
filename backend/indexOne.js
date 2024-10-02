import { StatusCodes } from "http-status-codes";
import express from "express";
import mongoose from "mongoose";

// import bodyParser from 'body-parser';

import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import AuthRoute from "./routes/AuthRoute.js";
import UserRoute from "./routes/UserRoute.js";
import RoleRoute from "./routes/RoleRoute.js";
import PointsRoute from "./routes/PointsRoute.js";
import CsvRoute from "./routes/CsvRoute.js";
// import { upload, importCsv } from './controllers/CsvController.js';

const app = express();
mongoose.connect("mongodb://localhost:27017/stressmap_db", {
});
const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("Database connected..."));

app.use(cors());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
// app.use("/api", ChildrenRoute);
// app.use("/api", AddDailyReportRoute);
app.use("/api", AuthRoute);
app.use("/api", UserRoute);
app.use("/api", RoleRoute);
app.use("/api", PointsRoute);
app.use("/api", CsvRoute);

app.get("*", (_, res) =>
  res.status(StatusCodes.NOT_FOUND).json({ message: "endpoint not found" })
);
app.all("*", (_, res) =>
  res
    .status(StatusCodes.METHOD_NOT_ALLOWED)
    .json({ message: "method not allowed" })
);

// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/index.html');
// });

// app.post('/import-csv', upload.single('file'), importCsv);

app.listen(5002, () => console.log("Server up and running..."));

export default app;