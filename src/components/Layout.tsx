import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { Menu } from "lucide-react";

interface LayoutProps {
    children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="app">
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <main className="main-viewport">
                {/* Mobile Header */}
                <header className="mobile-header">
                    <h1 className="mobile-logo">ChromaBase</h1>
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="mobile-menu-btn"
                    >
                        <Menu size={24} />
                    </button>
                </header>

                <div className="page-container">
                    <div className="page-inner">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Layout;
