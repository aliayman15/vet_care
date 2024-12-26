import express from "express";
import { doctorSignup, doctorLogin, doctorLogout } from "../controller/doctorAuth.controller.js";

const router = express.Router();

router.post("/signup", doctorSignup);
router.post("/login", doctorLogin);
router.post("/logout", doctorLogout);

export default router;
