import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Join from "./pages/Join";
import AppPage from "./pages/App";
import ProtectedRoute from "./components/ProtectedRoute";
import LoadingScreen from "./components/ui/LoadingScreen";

function App() {
  const [ready, setReady] = useState(false);

  if (!ready) return <LoadingScreen onFinished={() => setReady(true)} />;

  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/join" element={<Join />} />
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <AppPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
