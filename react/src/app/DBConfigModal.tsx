import React, { useState, useEffect } from "react";

interface DBConfig {
  user: string;
  password: string;
  server: string;
  database: string;
  options: {
    encrypt: boolean;
    trustServerCertificate: boolean;
  };
}

interface DBConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DBConfigModal: React.FC<DBConfigModalProps> = ({ isOpen, onClose }) => {
  const [config, setConfig] = useState<DBConfig>({
    user: "",
    password: "",
    server: "",
    database: "",
    options: { encrypt: false, trustServerCertificate: true },
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Load existing config when modal opens
      window.api.loadDBConfig().then((cfg: DBConfig) => setConfig(cfg));
    }
  }, [isOpen]);

  const handleChange = (key: keyof DBConfig, value: any) => {
    if (key === "options") {
      setConfig((prev) => ({
        ...prev,
        options: { ...prev.options, ...value },
      }));
    } else {
      setConfig((prev) => ({ ...prev, [key]: value }));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await window.api.saveDBConfig(config);
      onClose();
    } catch (err) {
      console.error("Error saving DB config:", err);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Database Configuration</h2>

        <div className="mb-2">
          <label className="block font-medium">User:</label>
          <input
            type="text"
            className="border rounded w-full px-2 py-1"
            value={config.user}
            onChange={(e) => handleChange("user", e.target.value)}
          />
        </div>

        <div className="mb-2">
          <label className="block font-medium">Password:</label>
          <input
            type="password"
            className="border rounded w-full px-2 py-1"
            value={config.password}
            onChange={(e) => handleChange("password", e.target.value)}
          />
        </div>

        <div className="mb-2">
          <label className="block font-medium">Server:</label>
          <input
            type="text"
            className="border rounded w-full px-2 py-1"
            value={config.server}
            onChange={(e) => handleChange("server", e.target.value)}
          />
        </div>

        <div className="mb-2">
          <label className="block font-medium">Database:</label>
          <input
            type="text"
            className="border rounded w-full px-2 py-1"
            value={config.database}
            onChange={(e) => handleChange("database", e.target.value)}
          />
        </div>

        <div className="mb-4 flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="mr-2"
              checked={config.options.encrypt}
              onChange={(e) =>
                handleChange("options", { encrypt: e.target.checked })
              }
            />
            Encrypt
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              className="mr-2"
              checked={config.options.trustServerCertificate}
              onChange={(e) =>
                handleChange("options", { trustServerCertificate: e.target.checked })
              }
            />
            Trust Server Certificate
          </label>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DBConfigModal;
