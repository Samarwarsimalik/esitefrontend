import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5000";

export default function ProfileAvatar() {
  const navigate = useNavigate();
  const [src, setSrc] = useState("/avatar.png");

  useEffect(() => {
    const loadAvatar = async () => {
      try {
        const res = await fetch(`${API}/api/users/me`, {
          credentials: "include",
        });

        if (!res.ok) return;

        const data = await res.json();

        if (data.profileImage) {
          // handle full url / relative path
          if (data.profileImage.startsWith("http")) {
            setSrc(data.profileImage);
          } else {
            setSrc(API + data.profileImage);
          }
        }
      } catch (err) {
        console.log("Avatar load failed");
      }
    };

    loadAvatar();
  }, []);

  return (
    <button
      onClick={() => navigate("/profile")}
      className="w-10 h-10 rounded-full overflow-hidden border border-gray-300 hover:ring-2 hover:ring-black transition"
      title="My Profile"
    >
      <img
        src={src}
        alt="Profile"
        className="w-full h-full object-cover"
        onError={(e) => {
          e.currentTarget.src = "/avatar.png";
        }}
      />
    </button>
  );
}
