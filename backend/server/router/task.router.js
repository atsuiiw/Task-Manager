import express from "express";
import Task from "../model/task.model.js";

import { getTask, postTask, putTask, deleteTask } from "../controller/task.contoller.js";

const router = express.Router();

router.get("/",getTask);
router.post("/",postTask);
router.put("/:id",putTask);
router.delete("/:id",deleteTask);

export default router;