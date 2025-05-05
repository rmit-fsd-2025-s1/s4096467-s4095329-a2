import { Router } from "express";
import { UserController } from "../controller/UserController";

const router = Router();
const userController = new UserController();

router.get("/users", async (req, res) => {
  await userController.all(req, res);
});
export default router;
