import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSend, FiUser } from "react-icons/fi";

type Comment = {
  id: string;
  text: string;
  username: string;
  createdAt: string;
};

type Post = {
  id: string;
  text: string;
  username: string;
  createdAt: string;
  updatedAt: string;
  comments?: Comment[];
};

const API_BASE = import.meta.env.VITE_API_BASE;

const Posts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newPostText, setNewPostText] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    const localPosts = JSON.parse(localStorage.getItem("localPosts") || "[]");
    setPosts(localPosts);

    loadPosts(token);
  }, [navigate]);

  const loadPosts = async (token: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/feed`, {
        headers: {
          Authorization: token,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("API error:", data);
        setError(data.message || "Failed to load posts");
        return;
      }

      if (Array.isArray(data)) {
        const localPosts: Post[] = JSON.parse(
          localStorage.getItem("localPosts") || "[]"
        );

        const savedComments = JSON.parse(
          localStorage.getItem("comments") || "{}"
        );

        const apiPostsWithComments: Post[] = data.map((p) => ({
          ...p,
          comments: savedComments[p.id] || [],
        }));

        const combinedPosts = [...localPosts, ...apiPostsWithComments];
        setPosts(combinedPosts);
      } else {
        console.error("API did not return an array:", data);
        setError("Unexpected API response");
      }
    } catch (err) {
      console.error("Network error:", err);
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddPost = () => {
    if (!newPostText.trim()) return;

    const loggedInUsername = localStorage.getItem("username") || "You";

    const newPost: Post = {
      id: `local-${Date.now()}`,
      text: newPostText,
      username: loggedInUsername,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: [],
    };

    setPosts([newPost, ...posts]);
    localStorage.setItem("posts", JSON.stringify([newPost, ...posts]));
    setNewPostText("");
  };

  const handleAddComment = (postId: string, commentText: string) => {
    if (!commentText.trim()) return;

    const updatedPosts = posts.map((post) =>
      post.id === postId
        ? {
            ...post,
            comments: [
              ...(post.comments || []),
              {
                id: `comment-${Date.now()}`,
                text: commentText,
                username: "You",
                createdAt: new Date().toISOString(),
              },
            ],
          }
        : post
    );

    setPosts(updatedPosts);
    localStorage.setItem("localPosts", JSON.stringify(updatedPosts));

    const commentsData: Record<string, Comment[]> = {};
    updatedPosts.forEach((p) => (commentsData[p.id] = p.comments || []));
    localStorage.setItem("comments", JSON.stringify(commentsData));
  };

  return (
    <div className="min-h-screen min-w-screen p-4 sm:p-8 bg-gray-100">
      <div className="max-w-md sm:max-w-2xl mx-auto space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-black">Posts</h1>
          <button
            onClick={() => navigate("/profile")}
            className="p-2 rounded-full hover:bg-gray-200 transition"
            title="Go to Profile"
          >
            <FiUser className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={newPostText}
            onChange={(e) => setNewPostText(e.target.value)}
            placeholder="What's on your mind?"
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 text-black"
          />
          <button
            onClick={handleAddPost}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Post
          </button>
        </div>

        {loading && (
          <p className="text-center sm:text-left">Loading posts...</p>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 p-3 rounded text-red-600 text-sm sm:text-base">
            {error}
          </div>
        )}

        {!loading && !error && posts.length === 0 && (
          <p className="text-center sm:text-left">No posts available.</p>
        )}

        {!loading &&
          posts.map((post) => (
            <PostItem
              key={post.id}
              post={post}
              onAddComment={handleAddComment}
            />
          ))}
      </div>
    </div>
  );
};

type PostItemProps = {
  post: Post;
  onAddComment: (postId: string, commentText: string) => void;
};

const PostItem = ({ post, onAddComment }: PostItemProps) => {
  const [commentText, setCommentText] = useState("");

  const submitComment = () => {
    if (!commentText.trim()) return;
    onAddComment(post.id, commentText);
    setCommentText("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submitComment();
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow space-y-2 wrap-break-words">
      <p className="text-gray-800 text-sm sm:text-base">{post.text}</p>
      <p className="text-gray-500 text-xs sm:text-sm">
        Posted by {post.username} on {new Date(post.createdAt).toLocaleString()}
      </p>

      <div className="relative">
        <input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Write a comment..."
          className="w-full rounded-lg border border-gray-300 px-4 py-2 pr-10 focus:ring-2 focus:ring-blue-500 text-black text-sm sm:text-base"
        />
        <button
          onClick={submitComment}
          className={`absolute right-2 top-1/2 transform -translate-y-1/2 ${
            commentText.trim()
              ? "text-blue-600 hover:text-blue-800"
              : "text-gray-400 cursor-not-allowed"
          }`}
          disabled={!commentText.trim()}
        >
          <FiSend size={20} />
        </button>
      </div>

      {post.comments && post.comments.length > 0 && (
        <div className="mt-2 space-y-2">
          {post.comments
            .slice()
            .reverse()
            .map((c) => (
              <div
                key={c.id}
                className="bg-gray-100 p-2 rounded text-sm sm:text-base"
              >
                <p className="text-gray-800">{c.text}</p>
                <p className="text-gray-500 text-xs sm:text-sm">
                  {c.username} - {new Date(c.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default Posts;
