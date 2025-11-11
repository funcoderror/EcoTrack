import {Router} from "express";
import {signup, login, logout} from "../controllers/authControllers.js";
import {authenticateToken} from "../middleware/auth.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// Get current authenticated user
router.get("/me", authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

export default router;