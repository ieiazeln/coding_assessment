import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Posts from "./components/Posts";
import Profile from "./components/Profile";
import "./App.css";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/post" element={<Posts />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}

export default App;
