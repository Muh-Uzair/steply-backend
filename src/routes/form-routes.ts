import {
  createNewForm,
  deleteFormOnId,
  editFormOnId,
  getAllForms,
} from "@/controllers/form-controller";
import express, { Router } from "express";
import multer from "multer";

const router: Router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
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
router.route("/:id").put(editFormOnId);
router.route("/:id").delete(deleteFormOnId);

export default router;
