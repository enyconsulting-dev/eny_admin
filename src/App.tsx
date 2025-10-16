import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import EventDetail from "./pages/EventDetail";
import LocationUsers from "./pages/LocationUsers";
import Events from "./pages/Events";
import CreateEvent from "./pages/CreateEvent";
import Settings from "./pages/Settings";
import Assessments from "./pages/Assessments";
import CreateAssessment from "./pages/CreateAssessment";
import AssessmentDetail from "./pages/AssessmentDetail";
import AssessmentUsers from "./pages/AssessmentUsers";
import AssessmentAttempts from "./pages/AssessmentAttempts";
import AttemptDetail from "./pages/AttemptDetail";
import AssessmentsList from "./pages/AssessmentsList";
import Admins from "./pages/Admins";
import AdminDetail from "./pages/AdminDetail";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { QueryProvider } from "./providers/query-provider";
import { persistor, store } from "./store";


const App = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <QueryProvider>
        <ThemeProvider defaultTheme="system" storageKey="app-theme">
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
                <Route path="/events/create" element={<ProtectedRoute><CreateEvent /></ProtectedRoute>} />
                <Route path="/events/edit/:id" element={<ProtectedRoute><CreateEvent /></ProtectedRoute>} />
                <Route path="/event/:eventId" element={<ProtectedRoute><EventDetail /></ProtectedRoute>} />
                <Route path="/event/:eventId/location/:locationId" element={<ProtectedRoute><LocationUsers /></ProtectedRoute>} />
                <Route path="/assessments" element={<ProtectedRoute><Assessments /></ProtectedRoute>} />
                <Route path="/assessments/list" element={<ProtectedRoute><AssessmentsList /></ProtectedRoute>} />
                <Route path="/assessments/create" element={<ProtectedRoute><CreateAssessment /></ProtectedRoute>} />
                <Route path="/assessments/edit/:id" element={<ProtectedRoute><CreateAssessment /></ProtectedRoute>} />
                <Route path="/assessments/:id" element={<ProtectedRoute><AssessmentDetail /></ProtectedRoute>} />
                <Route path="/assessments/users" element={<ProtectedRoute><AssessmentUsers /></ProtectedRoute>} />
                <Route path="/assessments/:id/users" element={<ProtectedRoute><AssessmentUsers /></ProtectedRoute>} />
                <Route path="/assessments/attempts" element={<ProtectedRoute><AssessmentAttempts /></ProtectedRoute>} />
                <Route path="/assessments/attempts/:id" element={<ProtectedRoute><AttemptDetail /></ProtectedRoute>} />
                <Route path="/admins" element={<ProtectedRoute><Admins /></ProtectedRoute>} />
                <Route path="/admins/:id" element={<ProtectedRoute><AdminDetail /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      </QueryProvider>
    </PersistGate>
  </Provider>
);

export default App;
