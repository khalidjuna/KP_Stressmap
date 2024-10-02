import express from 'express';
import { upload, importCsv } from '../controllers/CsvController.js';

const router = express.Router();
const v1 = express.Router();

v1.post('/import-csv', upload.single('file'), importCsv);

router.use("/v1", v1);
export default router;
