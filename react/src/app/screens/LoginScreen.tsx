import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import bcrypt from "bcryptjs";
import { callApi } from "../services/callApi";
import  DBConfigModal  from "../DBConfigModal"; // your existing modal

interface User {
  id: string;
  emri: string;
  roli: string;
  fjalekalimiHash: string;
  salt: string;
}

interface LoginScreenProps {
  onLoginSuccess: (user: User) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDbModal, setShowDbModal] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await callApi.getPerdoruesit();
        setUsers(res);
      } catch (err) {
        console.error("Error fetching users:", err);
        // Even if users fail to load, we still can show the secret button
      }
    };
    fetchUsers();
  }, []);

  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    setPassword("");
  };

  const handleLogin = async () => {
    if (!selectedUser) return;
    setLoading(true);
    try {
      const { fjalekalimiHash } = selectedUser;
      const isValid = bcrypt.compareSync(password, fjalekalimiHash);
      if (isValid) {
        toast.success(`Mire se erdhe ${selectedUser.emri}!`);
        onLoginSuccess(selectedUser);
      } else {
        toast.error("Fjalekalimi i pasakt");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-screen bg-gray-50">

      {/* Grid of user circles, only shown if users loaded */}
      {users.length > 0 && (
        <div className="grid grid-cols-3 gap-6 mb-8">
          {users.map((user) => (
            <div
              key={user.id}
              onClick={() => handleSelectUser(user)}
              className="flex flex-col items-center justify-center cursor-pointer transition-transform transform hover:scale-105"
            >
              <div
                className={`w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-2xl font-bold text-indigo-700 shadow-md ${
                  selectedUser?.id === user.id ? "ring-4 ring-indigo-400" : ""
                }`}
              >
                {user.emri.charAt(0).toUpperCase()}
              </div>
              <div className="mt-2 text-gray-600 font-medium">{user.roli}</div>
            </div>
          ))}
        </div>
      )}

      {selectedUser && (
        <div className="flex flex-col items-center w-full max-w-xs">
          <div className="mb-2 text-gray-700 font-semibold text-center">
            Fjalekalimi per: {selectedUser.emri}
          </div>
          <input
            type="password"
            className="w-full px-4 py-2 rounded-lg shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="Fjalekalimi"
          />
          <button
            className="w-full px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700 transition"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Duke u kyqur..." : "Kyqu"}
          </button>
        </div>
      )}

      {/* ===== SECRET BUTTON ===== */}
      <div
        className="absolute bottom-4 right-4 w-10 h-10 bg-white-300 rounded-full flex items-center justify-center cursor-pointer shadow hover:bg-gray-400 transition"
        title="Secret DB Config"
        onClick={() => setShowDbModal(true)}
      >
      </div>

      {/* DB Config Modal */}
      {showDbModal && <DBConfigModal isOpen = {true} onClose={() => setShowDbModal(false)} />}
    </div>
  );
};
