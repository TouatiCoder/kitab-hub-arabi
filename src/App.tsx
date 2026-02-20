import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import UserLogin from "./pages/UserLogin";
import WriterDashboard from "./pages/WriterDashboard";
import WriterJoinRequest from "./pages/WriterJoinRequest";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
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
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/content" element={<AdminContent />} />
          <Route path="/admin/writers" element={<AdminWriters />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/admin/subscriptions" element={<AdminSubscriptions />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/writer" element={<WriterDashboard />} />
          <Route path="/writer/join" element={<WriterJoinRequest />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
