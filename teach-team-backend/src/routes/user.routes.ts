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

// Returns a guide for the API
// to call this, run /api/
router.get("/", async (req, res) => {
  await guideController.guide(req, res);
});

// Returns all users in the database
// to call this, run /api/users/
router.get("/users", async (req, res) => {
  await userController.all(req, res);
});

// Returns boolean depending on if the login is correct
// to call this, run /api/users/login/yourEmailHere/yourPasswordHere
router.get("/users/login/:email/:password", async (req, res) => {
  await loginController.login(req, res);
});

// Returns user type of either candidate, lecturer or admin
// to call this, run /api/users/type/yourEmailHere
router.get("/users/type/:email", async (req, res) => {
  await userController.userType(req, res);
});

//Get a specific user via email
// to call this, run /api/users/yourEmailHere
router.get("/users/:email", async (req, res) => {
  await userController.userInfo(req, res);
});

// Gets the status of application for the tutor apply to classes page
// to call this, run /api/users/appliedClasses/tutorEmailHere
router.get("/users/appliedClasses/:email", async (req, res) => {
  await userController.applicationCheck(req, res);
});

// Saved the passed in tutor to the specified class and role in the database
router.post("/users/applyToClass", async (req, res) => {
  await classesController.addApplicant(req, res);
});

// Returns all classes in the database
// to call this, run /api/classes
router.get("/classes", async (req, res) => {
  await classesController.all(req, res);
});

// Populates the lecturer tutors in class lists
// to call this, run /api/classes/tutors/:classCode
router.get("/classes/tutors/:classCode", async (req, res) => {
  await classesController.getTutorsInClass(req, res);
});

// Saves the ordered accepted and unaccepted candidates to the database
// Updates the accepted and candidates for a specified class
router.post("/classes/tutors/update", async (req, res) => {
  await classesController.updateClass(req, res);
});

// Checks to see if a lecturer is teaching a class
// to call this, run /api/classes/classCodeHere/hasLecturer/lecturerEmailHere
router.get("/classes/:classCode/hasLecturer/:lecturer/", async (req, res) => {
  await classesController.isTutorInClass(req, res);
});

// Gets the number of new applicants in the lecturer's dashboard
// to call this, run /api/classes/lecturerEmailHere/candidates/count
router.get("/classes/:lecturer/candidates/count/", async (req, res) => {
  await classesController.countForLecturerClass(req, res);
});

// Gets the course cards returned in the lecturer's dashboard
// to call this, run /api/classes/lecturerEmailHere/courseCandidates/count
router.get("/classes/:lecturer/courseCandidates/count/", async (req, res) => {
  await classesController.getLecturerCourseDetails(req, res);
});

// Returns the information searched for in the lecturer's dashboard
router.get("/classes/search/:sort/:filter/:search/:availability/:type", async (req, res)=>{
  await classesController.searchClasses(req, res);
});

//Registers a user 
//post new reg info 
router.post("/users", async (req, res) => {
  await userController.registerUser(req, res);
});

export default router;

