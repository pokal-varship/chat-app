import { useState } from "react";
import { getAuthUser } from "../lib/api";

const AuthTest = () => {
  const [authStatus, setAuthStatus] = useState("");
  const [user, setUser] = useState(null);

  const testAuth = async () => {
    try {
      setAuthStatus("Testing authentication...");
      const response = await getAuthUser();
      if (response && response.user) {
        setUser(response.user);
        setAuthStatus("✅ Authentication successful! User is logged in.");
      } else {
        setUser(null);
        setAuthStatus("❌ Not authenticated");
      }
    } catch (error) {
      setUser(null);
      setAuthStatus(`❌ Authentication failed: ${error.message}`);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-white dark:bg-gray-800">
      <h3 className="text-lg font-semibold mb-4">Authentication Test</h3>
      <button
        onClick={testAuth}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Test Auth Status
      </button>
      
      <div className="mt-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Status: {authStatus}
        </p>
        
        {user && (
          <div className="mt-4 p-3 bg-green-50 dark:bg-green-900 rounded">
            <h4 className="font-medium">Logged in as:</h4>
            <p>Name: {user.fullName}</p>
            <p>Email: {user.email}</p>
            <p>ID: {user._id}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthTest; 