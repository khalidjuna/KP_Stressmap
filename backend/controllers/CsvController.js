import multer from "multer";
import path from "path";
import csv from "fast-csv";
import fs from "fs";
import { fileURLToPath } from "url";
import { Model as Point } from "../models/PointsModel.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Multer config
let storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join(__dirname, "..", "uploads"));
  },
  filename: (req, file, callback) => {
    callback(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

let upload = multer({
  storage: storage,
});

const uploadCsv = async (filePath) => {
  let stream = fs.createReadStream(filePath);
  let csvDataColl = [];
  let fileStream = csv
    .parse()
    .on("data", function (data) {
      csvDataColl.push(data);
    })
    .on("end", async function () {
      csvDataColl.shift(); // Remove header row if present

      const points = csvDataColl.map((row) => ({
        x: parseFloat(row[0]),
        y: parseFloat(row[1]),
        ratio: parseFloat(row[2]),
        orientation: parseFloat(row[3]),
      }));

      try {
        await Point.insertMany(points);
        console.log("Data inserted successfully");
      } catch (error) {
        console.error("Error inserting data:", error);
      }

      fs.unlinkSync(filePath);
    });
  stream.pipe(fileStream);
};

const importCsv = async (req, res) => {
  try {
    await uploadCsv(path.join(__dirname, "..", "./uploads", req.file.filename));
    res.send("Record imported");
  } catch (error) {
    res.status(500).send(`Error importing CSV: ${error.message}`);
  }
};

export { upload, importCsv };
