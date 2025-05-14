import { Router } from "express";
import { UserController } from "../controller/UserController";
import { LoginController } from "../controller/LoginController";
import { GuideController } from "../controller/GuideController";
import { ClassesController } from "../controller/ClassesController";

const router = Router();
const userController = new UserController();
const loginController = new LoginController();
const guideController = new GuideController();
const classesController = new ClassesController();

// to call this, run /api/
router.get("/", async (req, res) => {
  await guideController.guide(req, res);
});

// to call this, run /api/users/
router.get("/users", async (req, res) => {
  await userController.all(req, res);
});

// to call this, run /api/users/login/yourEmailHere/yourPasswordHere
router.get("/users/login/:email/:password", async (req, res) => {
  await loginController.login(req, res);
});

// to call this, run /api/users/type/yourEmailHere
router.get("/users/type/:email", async (req, res) => {
  await userController.userType(req, res);
});

// to call this, run /api/users/appliedClasses/tutorEmailHere
router.get("/users/appliedClasses/:email", async (req, res) => {
  await userController.applicationCheck(req, res);
});

router.post("/users/applyToClass", async (req, res) => {
  await classesController.addApplicant(req, res);
});

// to call this, run /api/users/type/yourEmailHere
router.get("/classes", async (req, res) => {
  await classesController.all(req, res);
});

// to call this, run /api/classes/lecturerEmailHere/candidates/count
router.get("/classes/:lecturer/candidates/count/", async (req, res) => {
  await classesController.countForLecturerClass(req, res);
});

export default router;
