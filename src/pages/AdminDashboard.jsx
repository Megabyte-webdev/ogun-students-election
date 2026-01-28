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
    deleteCandidate,
    get,
  } = useAdmin();

  const [activeTab, setActiveTab] = useState("elections");
  const [stats, setStats] = useState({});
  const [tabData, setTabData] = useState({
    elections: [],
    positions: [],
    candidates: [],
    votes: [],
    abuse: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState({ open: false, type: null, item: null });

  // Fetch only the active tab's data
  const fetchTabData = async (tab) => {
    setIsLoading(true);
    try {
      switch (tab) {
        case "elections": {
          const electionsRes = await get("elections");
          setTabData((prev) => ({
            ...prev,
            elections: electionsRes.elections || [],
          }));
          setStats((prev) => ({
            ...prev,
            activeElections: electionsRes.elections?.length || 0,
          }));
          break;
        }
        case "positions": {
          const positionsRes = await get("positions");
          setTabData((prev) => ({
            ...prev,
            positions: positionsRes.positions || [],
          }));
          setStats((prev) => ({
            ...prev,
            totalPositions: positionsRes.positions?.length || 0,
          }));
          break;
        }
        case "candidates": {
          const candidatesRes = await get("candidates");
          setTabData((prev) => ({
            ...prev,
            candidates: candidatesRes.candidates || [],
          }));
          setStats((prev) => ({
            ...prev,
            totalCandidates: candidatesRes.candidates?.length || 0,
          }));
          break;
        }
        case "votes": {
          const votesRes = await listVotes();
          setTabData((prev) => ({ ...prev, votes: votesRes.votes || [] }));
          setStats((prev) => ({
            ...prev,
            totalVotes: votesRes.votes?.length || 0,
          }));
          break;
        }
        case "abuse": {
          const abuseRes = await listAbuseLogs();
          setTabData((prev) => ({ ...prev, abuse: abuseRes.logs || [] }));
          setStats((prev) => ({
            ...prev,
            reportedAbuse: abuseRes.logs?.length || 0,
          }));
          break;
        }
        default:
          break;
      }
    } catch (err) {
      console.error("Failed to fetch tab data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTabData(activeTab);
  }, [activeTab]);

  // Actions
  const handleActivate = async (type, id, activate = true) => {
    if (type === "elections") {
      activate ? await activateElection(id) : await deactivateElection(id);
    }
    if (type === "positions") await activatePosition(id);
    fetchTabData(type);
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    if (type === "elections") await deleteElection(id);
    if (type === "positions") await deletePosition(id);
    if (type === "candidates") await deleteCandidate(id);

    fetchTabData(type);
  };

  // Columns mapping
  const columnsMap = {
    elections: [
      { header: "Title", accessor: "title" },
      { header: "Status", accessor: "status" },
      {
        header: "Actions",
        accessor: "actions",
        cell: (row) => (
          <div className="flex items-center space-x-2">
            <button
              onClick={() =>
                setModal({ open: true, type: "elections", item: row })
              }
              className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              Edit
            </button>
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
              onClick={() =>
                setModal({ open: true, type: "positions", item: row })
              }
              className="text-yellow-600 hover:text-yellow-800"
            >
              Edit
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
      {
        header: "Photo",
        accessor: "photoUrl",
        cell: (row) => (
          <img
            src={row.photo}
            alt={row.name}
            className="w-12 h-12 rounded-full object-cover border"
            onError={(e) => {
              e.currentTarget.src = "/avatar-placeholder.png";
            }}
          />
        ),
      },
      { header: "Name", accessor: "name" },
      { header: "Position", accessor: "positionName" },
      {
        header: "Actions",
        accessor: "id",
        cell: (row) => (
          <div className="flex items-center space-x-2">
            <button
              onClick={() =>
                setModal({ open: true, type: "candidates", item: row })
              }
              className="text-yellow-600 hover:text-yellow-800"
            >
              Edit
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
    votes: [
      { header: "User ID", accessor: "userId" },
      { header: "Candidate", accessor: "candidate" },
      { header: "Position", accessor: "position" },
      { header: "Time of Vote", accessor: "createdAt" },
    ],
    abuse: [
      { header: "Matric No", accessor: "matricNo" },
      { header: "Biometric Type", accessor: "biometricType" },
      { header: "Action", accessor: "action" },
      { header: "IP Address", accessor: "ipAddress" },
      { header: "User Agent", accessor: "userAgent" },
      { header: "Occurred At", accessor: "occurredAt" },
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
      const disableAddElection =
        activeTab === "elections" && tabData.elections.length > 0;

      return (
        <div>
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-semibold capitalize">{activeTab}</h2>
            <button
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              onClick={() => setModal({ open: true, type: activeTab })}
              disabled={disableAddElection}
            >
              <Plus className="w-4 h-4 mr-2" /> Add {activeTab.slice(0, -1)}
            </button>
          </div>
          <DataTable
            columns={columnsMap[activeTab]}
            data={tabData[activeTab]}
            emptyMessage={`No ${activeTab} found`}
          />
        </div>
      );
    }

    if (activeTab === "votes")
      return <DataTable columns={columnsMap.votes} data={tabData.votes} />;
    if (activeTab === "abuse")
      return <DataTable columns={columnsMap.abuse} data={tabData.abuse} />;

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
            onClick={() => fetchTabData(activeTab)}
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
                className={`shrink-0 flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
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
        onClose={() => setModal({ open: false, type: null, item: null })}
      >
        {modal.type === "elections" && (
          <ElectionForm
            election={modal?.item}
            onCreated={() => {
              fetchTabData("elections");
              setModal({ open: false });
            }}
          />
        )}
        {modal.type === "positions" && (
          <PositionForm
            position={modal?.item}
            onCreated={() => {
              fetchTabData("positions");
              setModal({ open: false });
            }}
          />
        )}
        {modal.type === "candidates" && (
          <CandidateForm
            candidate={modal?.item}
            onCreated={() => {
              fetchTabData("candidates");
              setModal({ open: false });
            }}
          />
        )}
      </Modal>
    </AdminLayout>
  );
}
