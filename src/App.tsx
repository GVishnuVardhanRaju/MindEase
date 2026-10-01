import { useState } from "react";
import { RouterProvider } from "@tanstack/react-router";
import { getRouter } from "./router";
import CinematicIntro from "./components/intro/CinematicIntro";

const router = getRouter();

export function App() {
  const [hasEntered, setHasEntered] = useState(() => window.location.pathname !== "/");

  if (!hasEntered) {
    return <CinematicIntro onEnter={() => setHasEntered(true)} />;
  }

  return <RouterProvider router={router} />;
}
