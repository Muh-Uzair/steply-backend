import {
  createNewForm,
  deleteFormOnId,
  editFormOnId,
  getAllForms,
  getFormById,
} from "@/controllers/form-controller";
import express, { Router } from "express";
import multer from "multer";

const router: Router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  },
});

router.post("/", upload.single("resume"), createNewForm);
router.route("/").get(getAllForms);
router.route("/:id").get(getFormById);
router.route("/:id").put(editFormOnId);
router.route("/:id").delete(deleteFormOnId);

export default router;
