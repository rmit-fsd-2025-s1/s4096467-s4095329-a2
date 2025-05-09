import { Router } from "express";
import { UserController } from "../controller/UserController";
import { LoginController } from "../controller/LoginController";
import { GuideController } from "../controller/GuideController";

const router = Router();
const userController = new UserController();
const loginController = new LoginController();
const guideController = new GuideController();

// to call this, run /api/users/
router.get("/", async (req, res) => {
  await guideController.guide(req, res);
});

// to call this, run /api/users/
router.get("/users", async (req, res) => {
  await userController.all(req, res);
});

// to call this, run /api/login/yourEmailHere/yourPasswordHere
router.get("/users/login/:email/:password", async (req, res) => {
  await loginController.login(req, res);
});
export default router;
