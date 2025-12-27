import { useState, useEffect } from "react";
import api from "../services/api";
import PostList from "../components/common/PostList";
import CreatePostModal from "../components/common/CreatePostModal";
import "../styles/posts.css";

const PostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get("/posts");
        setPosts(response.data);
      } catch (err) {
        setError("Error al cargar los posts", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLike = async (id) => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Debes iniciar sesión para dar like a los posts');
      window.location.href = '/login';
      return;
    }

    try {
      const response = await api.patch(`/posts/${id}/like`);
      setPosts(posts.map((post) => (post.id === id ? response.data : post)));
    } catch (err) {
      console.error("Error al dar like:", err);
      if (err.response && err.response.status === 401) {
        alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
  };

  const handleCreatePost = () => {
    if (!isLoggedIn) {
      alert('Debes iniciar sesión para crear un nuevo post');
      window.location.href = '/login';
      return;
    }

    setIsModalOpen(true);
  };

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  if (loading) return (
    <div className="posts-page">
      <div className="loading-container">Cargando posts...</div>
    </div>
  );

  if (error) return (
    <div className="posts-page">
      <div className="error-container">{error}</div>
    </div>
  );

  return (
    <div className="posts-page">
      <div className="posts-header">
        <h1 className="posts-title">Posts</h1>
        <button
          className={`create-post-button ${!isLoggedIn ? 'disabled' : ''}`}
          onClick={handleCreatePost}
          disabled={!isLoggedIn}
          title={!isLoggedIn ? 'Debes iniciar sesión para crear un post' : 'Crear nuevo post'}
        >
          <span className="button-icon">✨</span>
          <span className="button-text">Crear Nuevo Post</span>
        </button>
      </div>
      <PostList posts={posts} onLike={handleLike} />

      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPostCreated={handlePostCreated}
      />
    </div>
  );
};

export default PostsPage;
