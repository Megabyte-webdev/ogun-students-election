import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout.jsx";
import ElectionForm from "../components/ElectionForm.jsx";
import PositionForm from "../components/PositionForm.jsx";
import CandidateForm from "../components/CandidateForm.jsx";
import DataTable from "../components/DataTable.jsx";
import useAdmin from "../hooks/useAdmin.js";
import {
  Vote,
  Users,
  Calendar,
  FileText,
  ShieldAlert,
  RefreshCw,
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  XCircle
} from "lucide-react";
import Modal from "../components/Modal.jsx";

// Explicitly mapping Tailwind classes to prevent JIT purge issues
const colorMap = {
  blue: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-100", icon: "text-blue-500" },
  green: { bg: "bg-green-50", text: "text-green-600", border: "border-green-100", icon: "text-green-500" },
  purple: { bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-100", icon: "text-purple-500" },
  orange: { bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-100", icon: "text-orange-500" },
  red: { bg: "bg-red-50", text: "text-red-600", border: "border-red-100", icon: "text-red-500" },
  yellow: { bg: "bg-yellow-50", text: "text-yellow-600", border: "border-yellow-100", icon: "text-yellow-500" },
};

const TABS = [
  { id: "elections", label: "Elections", icon: Calendar, color: "blue" },
  { id: "positions", label: "Positions", icon: FileText, color: "green" },
  { id: "candidates", label: "Candidates", icon: Users, color: "purple" },
  { id: "votes", label: "Votes", icon: Vote, color: "orange" },
  { id: "abuse", label: "Security Logs", icon: ShieldAlert, color: "red" },
];

export default function AdminDashboard() {
  const {
    listVotes,
    listAbuseLogs,
    activateElection,
    deactivateElection,
    deleteElection,
    activatePosition,
    deletePosition,
    deleteCandidate,
    get,
  } = useAdmin();

  const [activeTab, setActiveTab] = useState("elections");
  const [stats, setStats] = useState({});
  const [tabData, setTabData] = useState({ elections: [], positions: [], candidates: [], votes: [], abuse: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState({ open: false, type: null, item: null });

  const fetchTabData = async (tab) => {
    setIsLoading(true);
    try {
      const dataFetchers = {
        elections: async () => {
          const res = await get("elections");
          setStats(p => ({ ...p, activeElections: res.elections?.length || 0 }));
          return res.elections || [];
        },
        positions: async () => {
          const res = await get("positions");
          setStats(p => ({ ...p, totalPositions: res.positions?.length || 0 }));
          return res.positions || [];
        },
        candidates: async () => {
          const res = await get("candidates");
          setStats(p => ({ ...p, totalCandidates: res.candidates?.length || 0 }));
          return res.candidates || [];
        },
        votes: async () => {
          const res = await listVotes();
          setStats(p => ({ ...p, totalVotes: res.votes?.length || 0 }));
          return res.votes || [];
        },
        abuse: async () => {
          const res = await listAbuseLogs();
          setStats(p => ({ ...p, reportedAbuse: res.logs?.length || 0 }));
          return res.logs || [];
        }
      };

      if (dataFetchers[tab]) {
        const data = await dataFetchers[tab]();
        setTabData(prev => ({ ...prev, [tab]: data }));
      }
    } catch (err) {
      console.error("Dashboard Sync Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchTabData(activeTab); }, [activeTab]);

  const handleAction = async (action, type, id, extra = null) => {
    try {
      if (action === "delete" && !window.confirm("Permanent delete? This cannot be undone.")) return;
      
      const actions = {
        delete: { elections: deleteElection, positions: deletePosition, candidates: deleteCandidate },
        toggle: { elections: extra ? activateElection : deactivateElection }
      };

      await actions[action][type](id);
      fetchTabData(type);
    } catch (err) {
      console.error("Action failed:", err);
    }
  };

  const columnsMap = {
    elections: [
      { header: "Title", accessor: "title" },
      { 
        header: "Status", 
        cell: (row) => (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${row.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
            {row.status}
          </span>
        )
      },
      {
        header: "Actions",
        cell: (row) => (
          <div className="flex gap-2">
            <button onClick={() => setModal({ open: true, type: "elections", item: row })} className="p-1.5 hover:bg-yellow-50 text-yellow-600 rounded-lg transition-colors"><Edit size={18}/></button>
            {row.status === "active" ? (
              <button onClick={() => handleAction("toggle", "elections", row.id, false)} className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg"><XCircle size={18}/></button>
            ) : (
              <button onClick={() => handleAction("toggle", "elections", row.id, true)} className="p-1.5 hover:bg-green-50 text-green-600 rounded-lg"><CheckCircle size={18}/></button>
            )}
            <button onClick={() => handleAction("delete", "elections", row.id)} className="p-1.5 hover:bg-gray-100 text-gray-500 rounded-lg"><Trash2 size={18}/></button>
          </div>
        )
      }
    ],
    // Simplified candidate columns for space
    candidates: [
      { header: "Candidate", cell: (row) => (
        <div className="flex items-center gap-3">
          <img src={row.photo || "/avatar.png"} className="w-8 h-8 rounded-full border shadow-sm" alt=""/>
          <span className="font-medium">{row.name}</span>
        </div>
      )},
      { header: "Position", accessor: "positionName" },
      { header: "Action", cell: (row) => (
        <button onClick={() => handleAction("delete", "candidates", row.id)} className="text-red-500 hover:text-red-700"><Trash2 size={16}/></button>
      )}
    ],
    votes: [
      { header: "Voter", accessor: "userId" },
      { header: "Candidate", accessor: "candidate" },
      { header: "Time", accessor: "createdAt" }
    ],
    abuse: [
        { header: "User", accessor: "matricNo" },
        { header: "Action", accessor: "action" },
        { header: "Time", accessor: "occurredAt" }
    ]
  };

  const renderContent = () => {
    if (isLoading) return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-400">
        <RefreshCw className="animate-spin mb-4" size={32} />
        <p className="font-medium">Syncing database...</p>
      </div>
    );

    const isEditableTab = ["elections", "positions", "candidates"].includes(activeTab);
    
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-900 capitalize">{activeTab}</h2>
          {isEditableTab && (
            <button 
              onClick={() => setModal({ open: true, type: activeTab })}
              disabled={activeTab === "elections" && tabData.elections.length > 0}
              className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-blue-100 disabled:opacity-50"
            >
              <Plus size={20} className="mr-2"/> Create {activeTab.slice(0, -1)}
            </button>
          )}
        </div>
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle px-4 sm:px-0">
            <DataTable columns={columnsMap[activeTab] || columnsMap.votes} data={tabData[activeTab]} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Desktop Sidebar Navigation */}
          <aside className="hidden lg:block w-64 space-y-2">
            <div className="bg-white rounded-2xl border border-gray-100 p-3 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 px-4 mb-4">Admin Panel</p>
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                const colors = colorMap[tab.color];
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 rounded-xl text-sm font-bold transition-all mb-1 ${
                      active ? `${colors.bg} ${colors.text}` : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <Icon size={18} className="mr-3" /> {tab.label}
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Mobile Horizontal Navigation */}
          <nav className="lg:hidden sticky top-2 z-40 flex overflow-x-auto gap-2 py-2 no-scrollbar">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              const colors = colorMap[tab.color];
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`shrink-0 flex items-center px-5 py-2.5 rounded-2xl text-sm font-bold shadow-sm border transition-all ${
                    active ? `${colors.bg} ${colors.text} ${colors.border}` : "bg-white text-gray-500 border-gray-100"
                  }`}
                >
                  <Icon size={16} className="mr-2" /> {tab.label}
                </button>
              );
            })}
          </nav>

          <main className="flex-1 min-w-0 space-y-6">
            {/* Responsive Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
              {[
                { label: "Votes", val: stats.totalVotes, icon: Vote, col: "blue" },
                { label: "Active", val: stats.activeElections, icon: Calendar, col: "green" },
                { label: "Seats", val: stats.totalPositions, icon: FileText, col: "yellow" },
                { label: "People", val: stats.totalCandidates, icon: Users, col: "purple" },
                { label: "Threats", val: stats.reportedAbuse, icon: ShieldAlert, col: "red" },
              ].map((s) => (
                <div key={s.label} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
                  <s.icon className={`${colorMap[s.col].icon} mb-3`} size={24} />
                  <p className="text-2xl font-black text-gray-900 leading-none">{s.val || 0}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Main Content Area */}
            <section className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-5 sm:p-8">
              {renderContent()}
            </section>
          </main>
        </div>
      </div>

      <Modal open={modal.open} onClose={() => setModal({ open: false, type: null, item: null })}>
        {modal.type === "elections" && <ElectionForm election={modal?.item} onCreated={() => { fetchTabData("elections"); setModal({ open: false }); }} />}
        {modal.type === "positions" && <PositionForm position={modal?.item} onCreated={() => { fetchTabData("positions"); setModal({ open: false }); }} />}
        {modal.type === "candidates" && <CandidateForm candidate={modal?.item} onCreated={() => { fetchTabData("candidates"); setModal({ open: false }); }} />}
      </Modal>
    </AdminLayout>
  );
        }
