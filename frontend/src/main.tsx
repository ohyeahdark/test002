import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import "swiper/swiper-bundle.css";
import "flatpickr/dist/flatpickr.css";
import App from "./App.tsx";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import 'react-datepicker/dist/react-datepicker.css';
import './i18n';
import { AuthProvider } from './context/AuthContext';

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AppWrapper>
          <AuthProvider>
            <App />
          </AuthProvider>
        </AppWrapper>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);