import {
  LayoutDashboard,
  BookOpen,
  CheckSquare,
  CalendarDays,
  ClipboardCheck,
  FileText,
  GraduationCap,
  BarChart3,
  Sparkles,
  Settings,
  LogOut,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const menuItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Subjects",
    path: "/dashboard/subjects",
    icon: BookOpen,
  },
  {
    name: "Tasks",
    path: "/dashboard/tasks",
    icon: CheckSquare,
  },
  {
  name: "Exams",
  path: "/dashboard/exams",
  icon: GraduationCap,
  },
  {
    name: "Schedule",
    path: "/dashboard/schedule",
    icon: CalendarDays,
  },
  {
    name: "Attendance",
    path: "/dashboard/attendance",
    icon: ClipboardCheck,
  },
  {
    name: "Notes",
    path: "/dashboard/notes",
    icon: FileText,
  },
  {
    name: "Analytics",
    path: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    name: "AI Assistant",
    path: "/dashboard/ai",
    icon: Sparkles,
  },
];

function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="fixed left-0 top-0 flex h-screen w-64 flex-col border-r border-slate-200 bg-white">

      {/* Logo */}
      <div className="flex h-20 items-center border-b border-slate-200 px-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Acadex
          </h1>

          <p className="text-xs text-slate-400">
            Academic OS
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
  key={item.path}
  to={item.path}
  end={item.path === "/dashboard"}
  className={({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
      isActive
        ? "bg-slate-900 text-white"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`
  }
>
              <Icon size={19} />

              <span>{item.name}</span>
            </NavLink>
          );
        })}

      </nav>

      {/* Bottom section */}
      <div className="border-t border-slate-200 p-4">

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `mb-1 flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium ${
              isActive
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`
          }
        >
          <Settings size={19} />
          Settings
        </NavLink>

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={19} />
          Logout
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;