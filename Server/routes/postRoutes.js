import { Router } from "express";
import {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  likePost,
} from "../controllers/postController.js";
import {
  createPostValidator,
  updatePostValidator,
  idParamValidator,
} from "../middlewares/postValidator.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const postRouter = Router();

// Rutas para posts
postRouter.get("/", getAllPosts);
postRouter.get("/:id", idParamValidator, getPostById);
postRouter.post("/", authenticateToken, createPostValidator, createPost);
postRouter.put("/:id", authenticateToken, updatePostValidator, updatePost);
postRouter.delete("/:id", authenticateToken, idParamValidator, deletePost);
postRouter.patch("/:id/like", authenticateToken, idParamValidator, likePost);

export default postRouter;
