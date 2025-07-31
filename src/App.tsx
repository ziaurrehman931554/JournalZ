import { useEffect } from "react";
import { auth } from "./firebase";

export default function App() {
  useEffect(() => {
    console.log("Firebase Auth:", auth);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-blue-600">
        Firebase Connected! 🔥
      </h1>
      <div className="min-h-screen min-w-screen flex flex-col items-center justify-center bg-gray-900 p-8">
        <h1 className="text-3xl font-bold text-blue-600">
          Welcome to JournalZ! 📝
        </h1>
        <p className="mt-2 text-gray-700">A simple note-taking app.</p>
      </div>
    </div>
  );
}
