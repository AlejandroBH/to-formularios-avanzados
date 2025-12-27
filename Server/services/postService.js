import { posts } from "../data/posts.js";

// Obtener todos los posts
export const getAllPosts = () => {
  return posts;
};

// Obtener un post por ID
export const getPostById = (id) => {
  const post = posts.find((p) => p.id === parseInt(id));
  if (!post) {
    throw new Error("Post no encontrado");
  }
  return post;
};

// Crear un nuevo post
export const createPost = (postData) => {
  const newPost = {
    id: Date.now(),
    ...postData,
    createdAt: new Date(),
    likes: 0,
  };
  posts.push(newPost);
  return newPost;
};

// Actualizar un post
export const updatePost = (id, postData) => {
  const postIndex = posts.findIndex((p) => p.id === parseInt(id));
  if (postIndex === -1) {
    throw new Error("Post no encontrado");
  }

  posts[postIndex] = {
    ...posts[postIndex],
    ...postData,
    id: posts[postIndex].id,
    createdAt: posts[postIndex].createdAt,
    likes: posts[postIndex].likes,
  };

  return posts[postIndex];
};

// Eliminar un post
export const deletePost = (id) => {
  const postIndex = posts.findIndex((p) => p.id === parseInt(id));
  if (postIndex === -1) {
    throw new Error("Post no encontrado");
  }

  const deletedPost = posts.splice(postIndex, 1)[0];
  return deletedPost;
};

// Dar like a un post
export const likePost = (id) => {
  const post = posts.find((p) => p.id === parseInt(id));
  if (!post) {
    throw new Error("Post no encontrado");
  }

  post.likes += 1;
  return post;
};
