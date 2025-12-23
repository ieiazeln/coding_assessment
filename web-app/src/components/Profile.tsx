import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

const Profile = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    const username = localStorage.getItem("username") || "";

    setFirstName(localStorage.getItem("firstname") || "");
    setLastName(localStorage.getItem("lastname") || "");

    // User-specific profile picture
    setProfilePic(localStorage.getItem(`profilePic-${username}`));

    // Load user's posts
    const savedPosts: Post[] = JSON.parse(
      localStorage.getItem("posts") || "[]"
    );
    const savedComments: Record<string, Comment[]> = JSON.parse(
      localStorage.getItem("comments") || "{}"
    );

    const userPosts = savedPosts
      .filter((p) => p.username === username)
      .map((p) => ({
        ...p,
        comments: savedComments[p.id] || [],
      }));

    setPosts(userPosts);
  }, [navigate]);

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const username = localStorage.getItem("username") || "";
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setProfilePic(result);
      localStorage.setItem(`profilePic-${username}`, result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen min-w-screen p-4 sm:p-8 bg-gray-100">
      <div className="max-w-md sm:max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold text-black">Profile</h1>
          <button
            onClick={() => navigate("/post")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Back to Posts
          </button>
        </div>

        {/* User info */}
        <div className="flex items-center gap-4">
          <div className="relative">
            {profilePic ? (
              <img
                src={profilePic}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                No Photo
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              capture="user"
              onChange={handleProfilePicChange}
              className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
              title="Change Profile Picture"
            />
          </div>
          <div>
            <p className="text-lg sm:text-xl font-semibold">
              {firstName} {lastName}
            </p>
            <p className="text-gray-500 text-sm">
              @{localStorage.getItem("username")}
            </p>
          </div>
        </div>

        {/* User posts */}
        <div className="space-y-4">
          {posts.length === 0 && (
            <p className="text-gray-600 text-center">
              You have not posted anything yet.
            </p>
          )}

          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white p-4 rounded shadow space-y-2"
            >
              <p className="text-gray-800 text-sm sm:text-base">{post.text}</p>
              <p className="text-gray-500 text-xs sm:text-sm">
                Posted on {new Date(post.createdAt).toLocaleString()}
              </p>

              {/* Comments */}
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
                          {c.username} -{" "}
                          {new Date(c.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
