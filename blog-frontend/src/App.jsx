
import { useEffect, useState } from "react";
import api from "./api";
import "./App.css";

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem("token"))
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchPosts();
    }
  }, [isAuthenticated]);

  const fetchPosts = async () => {
    try {
      const response = await api.get("/posts");
      setPosts(response.data);
      setMessage("");
    } catch (error) {
      if (error.response?.status === 401) {
        logout();
      } else {
        setMessage("Unable to load posts. Please try again.");
      }
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (isLogin) {
        const response = await api.post("/auth/login", {
          email: formData.email,
          password: formData.password
        });

        localStorage.setItem("token", response.data.token);
        setIsAuthenticated(true);
        setMessage("");
      } else {
        await api.post("/auth/register", formData);

        setIsLogin(true);
        setFormData({
          name: "",
          email: formData.email,
          password: ""
        });

        setMessage("Registration successful! Please sign in.");
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Unable to connect. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      setMessage("Please enter both title and content.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      if (editingId) {
        await api.put(`/posts/${editingId}`, {
          title,
          content
        });
        setMessage("Post updated successfully!");
      } else {
        await api.post("/posts", {
          title,
          content
        });
        setMessage("Post published successfully!");
      }

      setTitle("");
      setContent("");
      setEditingId(null);
      await fetchPosts();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Unable to save post. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const editPost = (post) => {
    setEditingId(post.id);
    setTitle(post.title);
    setContent(post.content);
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deletePost = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/posts/${id}`);
      setPosts((currentPosts) =>
        currentPosts.filter((post) => post.id !== id)
      );
      setMessage("Post deleted successfully!");
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Unable to delete post."
      );
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTitle("");
    setContent("");
    setMessage("");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setPosts([]);
    setTitle("");
    setContent("");
    setEditingId(null);
    setMessage("");
  };

  if (isAuthenticated) {
    return (
      <div className="dashboard">
        <header className="dashboard-header">
          <div className="dashboard-brand">
            <span>✦</span> BlogSpace
          </div>

          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </header>

        <main className="dashboard-main">
          <section className="dashboard-welcome">
            <span className="small-label">YOUR PERSONAL SPACE</span>
            <h1>Welcome to BlogSpace 👋</h1>
            <p>Share your thoughts. Your stories deserve to be told.</p>
          </section>

          <section className="post-editor">
            <h2>
              {editingId ? "Edit your story" : "Write a new story"}
            </h2>

            <form onSubmit={handlePostSubmit}>
              <input
                type="text"
                placeholder="Enter your blog title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              <textarea
                placeholder="Start writing your story..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows="7"
                required
              />

              <div className="editor-actions">
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={loading}
                >
                  {loading
                    ? "Please wait..."
                    : editingId
                      ? "Update Post"
                      : "Publish Post"}
                </button>

                {editingId && (
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={cancelEdit}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </section>

          {message && (
            <div className="dashboard-message" role="status">
              {message}
            </div>
          )}

          <section className="posts-section">
            <div className="posts-heading">
              <h2>Your Stories</h2>
              <span>{posts.length} posts</span>
            </div>

            {posts.length === 0 ? (
              <div className="empty-posts">
                <div className="empty-icon">✍️</div>
                <h3>Your story starts here</h3>
                <p>You haven't published any posts yet. Write your first one above!</p>
              </div>
            ) : (
              <div className="posts-grid">
                {posts.map((post) => (
                  <article className="post-card" key={post.id}>
                    <span className="post-label">BLOG POST</span>

                    <h3>{post.title}</h3>

                    <p className="post-content">{post.content}</p>

                    <div className="post-actions">
                      <button onClick={() => editPost(post)}>
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => deletePost(post.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </main>

        <footer className="dashboard-footer">
          © 2026 BlogSpace. Made for storytellers.
        </footer>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-left">
        <div className="brand">
          <span className="brand-icon">✦</span>
          BlogSpace
        </div>

        <div className="welcome-content">
          <span className="tagline">YOUR SPACE. YOUR STORIES.</span>

          <h1>
            Every story
            <br />
            deserves to be <span>told.</span>
          </h1>

          <p>
            Share your thoughts, express your ideas, and
            connect with readers through the power of words.
          </p>

          <div className="quote">
            "A blog is a conversation, not a code."
          </div>
        </div>

        <div className="left-footer">
          © 2026 BlogSpace. Made for storytellers.
        </div>
      </div>

      <div className="auth-right">
        <div className="mobile-brand">✦ BlogSpace</div>

        <div className="auth-card">
          <div className="auth-heading">
            <span className="small-label">
              {isLogin ? "WELCOME BACK" : "JOIN OUR COMMUNITY"}
            </span>

            <h2>
              {isLogin
                ? "Sign in to your account"
                : "Create your account"}
            </h2>

            <p>
              {isLogin
                ? "Enter your details to continue your journey."
                : "Start sharing your stories with the world."}
            </p>
          </div>

          <form onSubmit={handleAuth}>
            {!isLogin && (
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button
              className="submit-btn"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Please wait..."
                : isLogin
                  ? "Sign In →"
                  : "Create Account →"}
            </button>
          </form>

          {message && (
            <div className="form-message" role="status">
              {message}
            </div>
          )}

          <div className="switch-text">
            {isLogin
              ? "Don't have an account?"
              : "Already have an account?"}

            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setMessage("");
                setFormData({
                  name: "",
                  email: "",
                  password: ""
                });
              }}
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </div>
        </div>

        <div className="right-footer">
          By continuing, you agree to our Terms and Privacy Policy.
        </div>
      </div>
    </div>
  );
}

export default App;
