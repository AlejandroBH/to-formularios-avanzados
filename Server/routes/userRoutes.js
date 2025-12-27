import { Router } from "express";
import { registerUser, loginUser, refreshToken, logoutUser } from "../controllers/userController.js";

import registerValidator from "../middlewares/registerValidator.js";
import loginValidator from "../middlewares/loginValidator.js";

const userRouter = Router();

// Rutas de usuarios
userRouter.post("/register", registerValidator, registerUser);
userRouter.post("/login", loginValidator, loginUser);
userRouter.post("/refresh", refreshToken);
userRouter.post("/logout", logoutUser);

export default userRouter;
