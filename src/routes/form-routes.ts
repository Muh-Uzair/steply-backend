import {
  createNewForm,
  deleteFormOnId,
  editFormOnId,
  getAllForms,
} from "@/controllers/form-controller";
import express, { Router } from "express";

const router: Router = express.Router();

router.route("/").post(createNewForm);
router.route("/").get(getAllForms);
router.route("/:id").put(editFormOnId);
router.route("/:id").delete(deleteFormOnId);

export default router;
