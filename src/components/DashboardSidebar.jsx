import {
  Calendar,
  FileText,
  Users,
  Vote,
  ShieldAlert,
  RefreshCw,
} from "lucide-react";
import { TABS } from "../utils/formatters";

const ICONS = { Calendar, FileText, Users, Vote, ShieldAlert };

const TAB_COLORS = {
  blue: "bg-blue-100 text-blue-600",
  green: "bg-green-100 text-green-600",
  purple: "bg-purple-100 text-purple-600",
  orange: "bg-orange-100 text-orange-600",
  red: "bg-red-100 text-red-600",
};

export default function DashboardSidebar({ activeTab, setActiveTab, refresh }) {
  return (
    <>
      {/* Desktop */}
      <aside className="sticky top-20  h-full hidden lg:flex w-64 shrink-0 flex-col bg-white p-4 rounded-xl border space-y-3">
        {TABS.map((tab) => {
          const Icon = ICONS[tab.icon];
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center p-3 rounded-lg ${
                activeTab === tab.id
                  ? TAB_COLORS[tab.color]
                  : "hover:bg-gray-100"
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          );
        })}
        <button
          onClick={refresh}
          className="mt-auto flex items-center p-3 bg-gray-100 rounded-lg"
        >
          <RefreshCw className="w-4 h-4 mr-2" /> Refresh
        </button>
      </aside>

      {/* Mobile */}
      <div className="lg:hidden sticky top-0 z-20 bg-white border-b flex gap-2 overflow-x-auto p-2">
        {TABS.map((tab) => {
          const Icon = ICONS[tab.icon];
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 flex items-center px-3 py-2 rounded-lg ${
                activeTab === tab.id
                  ? TAB_COLORS[tab.color]
                  : "hover:bg-gray-100"
              }`}
            >
              <Icon className="w-4 h-4 mr-1" />
              {tab.label}
            </button>
          );
        })}
      </div>
    </>
  );
}
