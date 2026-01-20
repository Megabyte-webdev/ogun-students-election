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
  CheckCircle,
  Trash2,
} from "lucide-react";
import Modal from "../components/Modal.jsx";

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
    activateCandidate,
    deleteCandidate,
    get,
  } = useAdmin();

  const [activeTab, setActiveTab] = useState("elections");
  const [stats, setStats] = useState({});
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState({ open: false, type: null });

  // Fetch stats and data
  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const [votesRes, electionsRes, positionsRes, candidatesRes, abuseRes] =
        await Promise.all([
          listVotes(),
          get("elections"),
          get("positions"),
          get("candidates"),
          listAbuseLogs(),
        ]);

      setStats({
        totalVotes: votesRes.votes?.length || 0,
        activeElections: electionsRes.elections?.length || 0,
        totalPositions: positionsRes.positions?.length || 0,
        totalCandidates: candidatesRes.candidates?.length || 0,
        reportedAbuse: abuseRes.logs?.length || 0,
      });

      // Set data for active tab
      switch (activeTab) {
        case "votes":
          setData(votesRes.votes || []);
          break;
        case "abuse":
          setData(abuseRes.logs || []);
          break;
        case "elections":
          setData(electionsRes.elections || []);
          break;
        case "positions":
          setData(positionsRes.positions || []);
          break;
        case "candidates":
          setData(candidatesRes.candidates || []);
          break;
        default:
          setData([]);
      }
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [activeTab]);

  // Actions
  const handleActivate = async (type, id, activate = true) => {
    if (type === "elections") {
      if (activate)
        await activateElection(id); // PATCH /api/elections/:id/activate
      else await deactivateElection(id); // PATCH /api/elections/:id/deactivate
    }

    if (type === "positions") await activatePosition(id);
    if (type === "candidates") await activateCandidate(id);

    fetchStats(); // Refresh the table
  };

  const handleDelete = async (type, id) => {
    if (type === "elections") await deleteElection(id);
    if (type === "positions") await deletePosition(id);
    if (type === "candidates") await deleteCandidate(id);
    fetchStats();
  };

  // Columns for tables
  const columnsMap = {
    elections: [
      { header: "Title", accessor: "title" },
      { header: "Status", accessor: "status" },
      {
        header: "Actions",
        accessor: "actions",
        cell: (row) => (
          <div className="flex items-center space-x-2">
            {/* Activate / Deactivate Button */}
            {row.status === "active" ? (
              <button
                onClick={() => handleActivate("elections", row.id, false)}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Deactivate
              </button>
            ) : (
              <button
                onClick={() => handleActivate("elections", row.id, true)}
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Activate
              </button>
            )}

            {/* Delete Button */}
            <button
              onClick={() => handleDelete("elections", row.id)}
              className="px-3 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
            >
              Delete
            </button>
          </div>
        ),
      },
    ],
    positions: [
      { header: "Name", accessor: "name" },
      { header: "Election", accessor: "electionTitle" },
      {
        header: "Actions",
        accessor: "id",
        cell: (row) => (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleActivate("positions", row.id)}
              className="text-green-600 hover:text-green-800"
            >
              <CheckCircle />
            </button>
            <button
              onClick={() => handleDelete("positions", row.id)}
              className="text-red-600 hover:text-red-800"
            >
              <Trash2 />
            </button>
          </div>
        ),
      },
    ],
    candidates: [
      { header: "Name", accessor: "name" },
      { header: "Position", accessor: "positionName" },
      {
        header: "Actions",
        accessor: "id",
        cell: (row) => (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleActivate("candidates", row.id)}
              className="text-green-600 hover:text-green-800"
            >
              <CheckCircle />
            </button>
            <button
              onClick={() => handleDelete("candidates", row.id)}
              className="text-red-600 hover:text-red-800"
            >
              <Trash2 />
            </button>
          </div>
        ),
      },
    ],
  };

  const renderTabContent = () => {
    if (isLoading)
      return (
        <div className="flex justify-center py-12">
          <div className="animate-spin h-8 w-8 border-b-2 border-blue-600 rounded-full mr-3"></div>
          Loading...
        </div>
      );

    if (["elections", "positions", "candidates"].includes(activeTab)) {
      return (
        <div>
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-semibold capitalize">{activeTab}</h2>
            <button
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              onClick={() => setModal({ open: true, type: activeTab })}
            >
              <Plus className="w-4 h-4 mr-2" /> Add {activeTab.slice(0, -1)}
            </button>
          </div>
          <DataTable
            columns={columnsMap[activeTab]}
            data={data}
            emptyMessage={`No ${activeTab} found`}
          />
        </div>
      );
    }

    if (activeTab === "votes")
      return <DataTable columns={columnsMap["votes"]} data={data} />;
    if (activeTab === "abuse")
      return <DataTable columns={columnsMap["abuse"]} data={data} />;

    return null;
  };

  return (
    <AdminLayout>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar for large screens */}
        <div className="hidden lg:flex w-64 flex-col bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-4">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Dashboard</h2>
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center p-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? `bg-${tab.color}-100 text-${tab.color}-600`
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon className="w-4 h-4 mr-2" /> {tab.label}
              </button>
            );
          })}
          <button
            onClick={fetchStats}
            className="mt-auto flex items-center p-3 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium text-gray-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" /> Refresh Stats
          </button>
        </div>

        {/* Sticky top tab bar for small screens */}
        <div className="lg:hidden sticky top-0 z-20 bg-white border-b border-gray-200 flex overflow-x-auto p-2 space-x-2">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? `bg-${tab.color}-100 text-${tab.color}-600`
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon className="w-4 h-4 mr-1" /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* Main content */}
        <div className="flex-1 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                label: "Total Votes",
                value: stats.totalVotes,
                icon: Vote,
                color: "blue",
              },
              {
                label: "Active Elections",
                value: stats.activeElections,
                icon: Calendar,
                color: "green",
              },
              {
                label: "Positions",
                value: stats.totalPositions,
                icon: FileText,
                color: "yellow",
              },
              {
                label: "Candidates",
                value: stats.totalCandidates,
                icon: Users,
                color: "purple",
              },
              {
                label: "Abuse Reports",
                value: stats.reportedAbuse,
                icon: ShieldAlert,
                color: "red",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex justify-between items-center"
              >
                <div>
                  <p className="text-sm text-gray-600">{s.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {s.value}
                  </p>
                </div>
                <s.icon className={`w-10 h-10 text-${s.color}-500`} />
              </div>
            ))}
          </div>

          {/* Tab content */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        open={modal.open}
        onClose={() => setModal({ open: false, type: null })}
      >
        {modal.type === "elections" && (
          <ElectionForm
            onCreated={() => {
              fetchStats();
              setModal({ open: false });
            }}
          />
        )}
        {modal.type === "positions" && (
          <PositionForm
            onCreated={() => {
              fetchStats();
              setModal({ open: false });
            }}
          />
        )}
        {modal.type === "candidates" && (
          <CandidateForm
            onCreated={() => {
              fetchStats();
              setModal({ open: false });
            }}
          />
        )}
      </Modal>
    </AdminLayout>
  );
}
