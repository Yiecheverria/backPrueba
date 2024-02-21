import { Router } from "express";
import {  orderAI,subirArchivo } from "../controller/archivoController.js";
import { upload } from "../utils/file.js";

const router = Router();

router.post('/subirArchivo', upload, subirArchivo);
router.post('/openAI', orderAI);
export default router;