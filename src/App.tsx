import { useLayoutEffect, useState } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Join from "./pages/Join";
import AppPage from "./pages/App";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import ProtectedRoute from "./components/ProtectedRoute";
import LoadingScreen from "./components/ui/LoadingScreen";
import CursorFollower from "./components/ui/CursorFollower";

function AppViewport() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    const viewport = window.visualViewport;
    const updateViewport = () => {
      document.documentElement.style.setProperty(
        "--visual-viewport-height",
        `${viewport?.height ?? window.innerHeight}px`
      );
      document.documentElement.style.setProperty(
        "--visual-viewport-top",
        `${viewport?.offsetTop ?? 0}px`
      );
    };

    updateViewport();
    viewport?.addEventListener("resize", updateViewport);
    viewport?.addEventListener("scroll", updateViewport);
    window.addEventListener("resize", updateViewport);
    return () => {
      viewport?.removeEventListener("resize", updateViewport);
      viewport?.removeEventListener("scroll", updateViewport);
      window.removeEventListener("resize", updateViewport);
    };
  }, []);

  useLayoutEffect(() => {
    const isAppRoute = pathname === "/app" || pathname.startsWith("/app/");
    document.documentElement.classList.toggle("app-active", isAppRoute);
    document.getElementById("root")?.classList.toggle("app-viewport", isAppRoute);
  }, [pathname]);

  return null;
}

function App() {
  const [ready, setReady] = useState(false);

  if (!ready) return <LoadingScreen onFinished={() => setReady(true)} />;

  return (
    <AuthProvider>
      <AppViewport />
      <CursorFollower />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/join" element={<Join />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <AppPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
