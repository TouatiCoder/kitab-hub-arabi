import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import ContentDetails from "./pages/ContentDetails";
import Articles from "./pages/Articles";
import Stories from "./pages/Stories";
import Novels from "./pages/Novels";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminContent from "./pages/AdminContent";
import AdminWriters from "./pages/AdminWriters";
import AdminReports from "./pages/AdminReports";
import AdminSubscriptions from "./pages/AdminSubscriptions";
import AdminAds from "./pages/AdminAds";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminSettings from "./pages/AdminSettings";
import UserLogin from "./pages/UserLogin";
import WriterDashboard from "./pages/WriterDashboard";
import WriterJoinRequest from "./pages/WriterJoinRequest";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();


const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/articles" element={<Articles />} />
            <Route path="/stories" element={<Stories />} />
            <Route path="/novels" element={<Novels />} />
            <Route path="/content/:id" element={<ContentDetails />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/content" element={<ProtectedRoute requireAdmin><AdminContent /></ProtectedRoute>} />
            <Route path="/admin/writers" element={<ProtectedRoute requireAdmin><AdminWriters /></ProtectedRoute>} />
            <Route path="/admin/reports" element={<ProtectedRoute requireAdmin><AdminReports /></ProtectedRoute>} />
            <Route path="/admin/subscriptions" element={<ProtectedRoute requireAdmin><AdminSubscriptions /></ProtectedRoute>} />
            <Route path="/admin/ads" element={<ProtectedRoute requireAdmin><AdminAds /></ProtectedRoute>} />
            <Route path="/admin/analytics" element={<ProtectedRoute requireAdmin><AdminAnalytics /></ProtectedRoute>} />
            <Route path="/admin/settings" element={<ProtectedRoute requireAdmin><AdminSettings /></ProtectedRoute>} />
            <Route path="/login" element={<UserLogin />} />
            <Route path="/writer" element={<ProtectedRoute requireWriter><WriterDashboard /></ProtectedRoute>} />
            <Route path="/writer/join" element={<WriterJoinRequest />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
