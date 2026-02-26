import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./lib/AuthContext";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Leads from "./pages/Leads";
import Campaigns from "./pages/Campaigns";
import Content from "./pages/Content";
import Deliverables from "./pages/Deliverables";
import MissionControl from "./pages/MissionControl";
import Login from "./pages/Login";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <>{children}</> : <Navigate to="/login" replace />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/clients" element={<Clients />} />
                    <Route path="/leads" element={<Leads />} />
                    <Route path="/campaigns" element={<Campaigns />} />
                    <Route path="/content" element={<Content />} />
                    <Route path="/deliverables" element={<Deliverables />} />
                    <Route path="/mission-control" element={<MissionControl />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Layout>
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
