const PostList = ({ posts, onLike }) => {
  return (
    <div className="posts-container">
      {posts.length === 0 ? (
        <div className="loading-container">
          <p>No hay posts disponibles.</p>
        </div>
      ) : (
        <div className="posts-grid">
          {posts.map((post) => (
            <div key={post.id} className="post-card">
              <h3 className="post-title">{post.title}</h3>
              <p className="post-content">{post.content}</p>
              <div className="post-meta">
                <span className="post-meta-item post-author">{post.author}</span>
                <span className="post-meta-item post-date">
                  {new Date(post.createdAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className="post-actions">
                <span className="like-count">{post.likes}</span>
                <button className="like-button" onClick={() => onLike(post.id)}>
                  Like
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostList;
