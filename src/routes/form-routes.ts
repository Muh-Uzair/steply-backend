import {
  createNewForm,
  deleteFormOnId,
  editFormOnId,
  getAllForms,
} from "@/controllers/form-controller";
import express, { Router } from "express";
import multer from "multer";

const router: Router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("resume"), createNewForm);
router.route("/").get(getAllForms);
router.route("/:id").put(editFormOnId);
router.route("/:id").delete(deleteFormOnId);

export default router;
