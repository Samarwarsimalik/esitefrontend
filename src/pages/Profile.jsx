import { useEffect, useState } from "react";

const API = "http://localhost:5000/api";

// 🔒 Aadhar mask helper (XXXX-XXXX-1234)
const maskAadhar = (aadhar = "") => {
  if (!aadhar) return "";
  return "XXXX-XXXX-" + aadhar.slice(-4);
};

export default function Profile() {
  const [user, setUser] = useState(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    dob: "",
    profileImage: null, // FILE
    aadharNo: "",
    address: {
      line1: "",
      city: "",
      state: "",
      pincode: "",
      country: "",
    },
  });

  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  // ================= LOAD PROFILE =================
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await fetch(`${API}/users/me`, {
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        setUser(data);
        setForm({
          name: data.name || "",
          phone: data.phone || "",
          dob: data.dob ? data.dob.slice(0, 10) : "",
          profileImage: null,
          aadharNo: data.aadharNo || "",
          address: {
            line1: data.address?.line1 || "",
            city: data.address?.city || "",
            state: data.address?.state || "",
            pincode: data.address?.pincode || "",
            country: data.address?.country || "",
          },
        });

        if (data.profileImage) {
          setPreview(`http://localhost:5000${data.profileImage}`);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  // =============== CLEANUP PREVIEW URL TO AVOID MEMORY LEAKS ===============
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "profileImage") {
      const file = files[0];
      if (!file) return;
      setForm({ ...form, profileImage: file });

      // Update preview to new selected image
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      return;
    }

    if (name.startsWith("address.")) {
      const key = name.split(".")[1];
      setForm({
        ...form,
        address: { ...form.address, [key]: value },
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // ================= SUBMIT =================
  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");

    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("phone", form.phone);
      fd.append("dob", form.dob);
      fd.append("aadharNo", form.aadharNo);
      fd.append("address", JSON.stringify(form.address));

      if (form.profileImage) {
        fd.append("profileImage", form.profileImage);
      }

      const res = await fetch(`${API}/users/me`, {
        method: "PUT",
        credentials: "include",
        body: fd,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setMsg("Profile updated successfully");
      setUser(data.user);

      // Update preview with new image URL from server (if any)
      if (data.user.profileImage) {
        setPreview(`http://localhost:500${data.user.profileImage}`);
      } else {
        setPreview("");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // ================= SAFETY =================
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center text-red-500">
        Please login first
      </div>
    );
  }

  // ================= UI =================
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ===== LEFT PROFILE CARD ===== */}
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center text-center">
          <div className="relative">
            <img
              src={preview || "/avatar.png"}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border"
            />
            <label className="absolute bottom-1 right-1 bg-black text-white p-2 rounded-full cursor-pointer text-xs">
              ✎
              <input
                type="file"
                name="profileImage"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
            </label>
          </div>

          <h3 className="mt-4 text-xl font-semibold">
            {form.name || "Your Name"}
          </h3>
          <p className="text-gray-500 text-sm">{user.email}</p>

          <span className="mt-2 text-xs bg-gray-200 px-3 py-1 rounded-full capitalize">
            {user.role}
          </span>

          {user.aadharNo && (
            <p className="mt-4 text-sm text-gray-600">
              Aadhar:{" "}
              <span className="font-medium">{maskAadhar(user.aadharNo)}</span>
            </p>
          )}
        </div>

        {/* ===== RIGHT FORM ===== */}
        <div className="md:col-span-2 bg-white rounded-2xl shadow p-6">
          <h2 className="text-2xl font-semibold mb-6">Profile Details</h2>

          {msg && <p className="text-green-600 mb-3">{msg}</p>}
          {error && <p className="text-red-600 mb-3">{error}</p>}

          <form onSubmit={submit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="border rounded-lg px-3 py-2"
              />

              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone"
                className="border rounded-lg px-3 py-2"
              />

              <input
                type="date"
                name="dob"
                value={form.dob}
                onChange={handleChange}
                className="border rounded-lg px-3 py-2"
              />

              <input
                value={user.aadharNo ? maskAadhar(user.aadharNo) : form.aadharNo}
                onChange={handleChange}
                name="aadharNo"
                disabled={!!user.aadharNo}
                placeholder="Aadhar No"
                className={`border rounded-lg px-3 py-2 ${
                  user.aadharNo && "bg-gray-100 cursor-not-allowed"
                }`}
              />
            </div>

            <div>
              <h3 className="font-semibold mb-2">Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["line1", "city", "state", "pincode", "country"].map((f) => (
                  <input
                    key={f}
                    name={`address.${f}`}
                    value={form.address[f]}
                    onChange={handleChange}
                    placeholder={f.toUpperCase()}
                    className="border rounded-lg px-3 py-2"
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button className="bg-black text-white px-6 py-2 rounded-lg">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
