import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { clientStorageService } from "./services/clientStorage";

// Ensure default users are initialized
clientStorageService.forceInitializeUsers();

createRoot(document.getElementById("root")!).render(<App />);
