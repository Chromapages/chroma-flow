import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    Target,
    Megaphone,
    FileText,
    CheckSquare,
    X,
    LogOut,
    Radar
} from "lucide-react";
import { useAuth } from "../lib/AuthContext";

const navItems = [
    { to: "/", label: "Dashboard", icon: LayoutDashboard },
    { to: "/mission-control", label: "Mission Control", icon: Radar },
    { to: "/clients", label: "Clients", icon: Users },
    { to: "/leads", label: "Leads", icon: Target },
    { to: "/campaigns", label: "Campaigns", icon: Megaphone },
    { to: "/content", label: "Content", icon: FileText },
    { to: "/deliverables", label: "Deliverables", icon: CheckSquare },
];

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

function Sidebar({ isOpen, onClose }: SidebarProps) {
    const { user, logout } = useAuth();

    return (
        <aside className={`sidebar ${isOpen ? "active" : ""}`}>
            <div className="flex justify-between items-center p-6 pb-4">
                <h1 className="sidebar-logo uppercase">ChromaBase</h1>
                <button
                    onClick={onClose}
                    className="lg:hidden text-white/50 hover:text-white"
                >
                    <X size={20} />
                </button>
            </div>

            <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        onClick={() => {
                            if (window.innerWidth < 1024) onClose();
                        }}
                        className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
                    >
                        <item.icon size={18} />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-white/10 space-y-4">
                {user && (
                    <div className="flex items-center justify-between px-3">
                        <div className="text-xs text-white/50 truncate pr-2" title={user.email || ""}>
                            {user.email}
                        </div>
                        <button
                            onClick={logout}
                            className="text-white/40 hover:text-white/80 transition-colors"
                            title="Log out"
                        >
                            <LogOut size={16} />
                        </button>
                    </div>
                )}
                <div className="text-[10px] mono text-white/40 px-3 uppercase tracking-widest">
                    v1.0.0
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;

