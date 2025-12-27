import * as postService from "../services/postService.js";

// Obtener todos los posts
export const getAllPosts = async (req, res) => {
  try {
    const posts = postService.getAllPosts();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener un post por ID
export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = postService.getPostById(id);
    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// Crear un nuevo post
export const createPost = async (req, res) => {
  try {
    const data = req.body;
    const newPost = postService.createPost(data);
    res.status(201).json(newPost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Actualizar un post
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updatedPost = postService.updatePost(id, data);
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// Eliminar un post
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPost = postService.deletePost(id);
    res.status(200).json({ message: "Post eliminado exitosamente", post: deletedPost });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// Dar like a un post
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = postService.likePost(id);
    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};
