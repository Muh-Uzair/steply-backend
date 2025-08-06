import { createNewForm } from "@/controllers/form-controller";
import express, { Router } from "express";

const router: Router = express.Router();

router.route("/").post(createNewForm);

export default router;
