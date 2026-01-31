import { useState, useMemo } from "react";
import {
  Vote,
  Calendar,
  FileText,
  Users,
  ShieldAlert,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  Edit2,
} from "lucide-react";
import DataTable from "./DataTable";
import VoteSummary from "./VoteSummary";
import VoteControls from "./VoteControls";
import { formatDateTime } from "../utils/formatters";

export default function DashboardContent({
  activeTab,
  tabData,
  stats,
  isLoading,
  onAdd,
  onEdit,
  onDelete,
  onActivate,
}) {
  const [voteFilters, setVoteFilters] = useState({
    position: "",
    candidate: "",
  });

  const actionButtonClasses =
    "flex items-center justify-center gap-1 px-3 py-1 rounded-md text-sm font-medium transition-colors duration-150";

  // CSV Export helper
  const exportCSV = (data) => {
    if (!data?.length) return;
    const headers = Object.keys(data[0]);
    const csv = [
      headers.join(","),
      ...data.map((row) => headers.map((h) => `"${row[h] ?? ""}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "votes.csv");
    link.click();
  };

  const columnsMap = {
    elections: [
      { header: "Title", accessor: "title" },
      { header: "Status", accessor: "status" },
      {
        header: "Actions",
        accessor: "actions",
        cell: (row) => (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onEdit("elections", row)}
              className={`${actionButtonClasses} bg-yellow-500 text-white hover:bg-yellow-600`}
            >
              <Edit2 className="w-4 h-4" />
              <span>Edit</span>
            </button>
            {row.status === "active" ? (
              <button
                onClick={() => onActivate("elections", row.id, false)}
                className={`${actionButtonClasses} bg-red-600 text-white hover:bg-red-700`}
              >
                <XCircle className="w-4 h-4" />
                <span>Deactivate</span>
              </button>
            ) : (
              <button
                onClick={() => onActivate("elections", row.id, true)}
                className={`${actionButtonClasses} bg-green-600 text-white hover:bg-green-700`}
              >
                <CheckCircle className="w-4 h-4" />
                <span>Activate</span>
              </button>
            )}
            <button
              onClick={() => onDelete("elections", row.id)}
              className={`${actionButtonClasses} bg-gray-200 text-gray-800 hover:bg-gray-300`}
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>
        ),
      },
    ],

    positions: [
      { header: "Name", accessor: "name" },
      {
        header: "Actions",
        accessor: "id",
        cell: (row) => (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onEdit("positions", row)}
              className={`${actionButtonClasses} bg-yellow-500 text-white hover:bg-yellow-600`}
            >
              <Edit2 className="w-4 h-4" />
              <span>Edit</span>
            </button>
            <button
              onClick={() => onDelete("positions", row.id)}
              className={`${actionButtonClasses} bg-red-600 text-white hover:bg-red-700`}
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
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
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onEdit("candidates", row)}
              className={`${actionButtonClasses} bg-yellow-500 text-white hover:bg-yellow-600`}
            >
              <Edit2 className="w-4 h-4" />
              <span>Edit</span>
            </button>
            <button
              onClick={() => onDelete("candidates", row.id)}
              className={`${actionButtonClasses} bg-red-600 text-white hover:bg-red-700`}
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>
        ),
      },
    ],

    votes: [
      { header: "User ID", accessor: "userId" },
      { header: "Candidate", accessor: "candidate" },
      { header: "Position", accessor: "position" },
      {
        header: "Time",
        accessor: "createdAt",
        cell: (row) => formatDateTime(row.createdAt),
      },
    ],

    abuse: [
      { header: "Matric No", accessor: "matricNo" },
      { header: "Action", accessor: "action" },
      { header: "IP Address", accessor: "ipAddress" },
      {
        header: "Time",
        accessor: "occurredAt",
        cell: (row) => formatDateTime(row.occurredAt),
      },
    ],
  };

  // Filtered votes
  const filteredVotes = useMemo(() => {
    if (activeTab !== "votes") return tabData.votes || [];
    return (tabData.votes || []).filter(
      (v) =>
        (!voteFilters.position || v.position === voteFilters.position) &&
        (!voteFilters.candidate || v.candidate === voteFilters.candidate),
    );
  }, [tabData.votes, voteFilters, activeTab]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 w-full">
        <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin mb-4"></div>
        <span className="text-gray-600 font-medium">Loading data...</span>
      </div>
    );
  }

  return (
    <main className="flex-1 space-y-6 w-full">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[
          { label: "Votes", value: stats.totalVotes, icon: Vote },
          { label: "Elections", value: stats.activeElections, icon: Calendar },
          { label: "Positions", value: stats.totalPositions, icon: FileText },
          { label: "Candidates", value: stats.totalCandidates, icon: Users },
          { label: "Abuse", value: stats.reportedAbuse, icon: ShieldAlert },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white p-4 rounded-xl border flex justify-between"
          >
            <div>
              <p className="text-sm text-gray-500">{s.label}</p>
              <p className="text-2xl font-bold">{s.value ?? 0}</p>
            </div>
            <s.icon className="w-8 h-8 text-gray-400" />
          </div>
        ))}
      </div>

      {/* Votes Summary */}
      {activeTab === "votes" && <VoteSummary votes={filteredVotes} />}

      {/* Table */}
      <div className="bg-white p-4 sm:p-6 rounded-xl border space-y-4">
        <div className="flex flex-col sm:flex-row justify-between gap-2">
          <h2 className="text-lg font-semibold capitalize">{activeTab}</h2>

          {activeTab === "votes" && (
            <VoteControls
              votes={tabData.votes || []}
              voteFilters={voteFilters}
              setVoteFilters={setVoteFilters}
              onExport={() => exportCSV(filteredVotes)}
            />
          )}

          {["elections", "positions", "candidates"].includes(activeTab) &&
            !(activeTab === "elections" && tabData.elections?.length > 0) && (
              <button
                onClick={() => onAdd(activeTab)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-150"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add
              </button>
            )}
        </div>

        <DataTable
          columns={columnsMap[activeTab]}
          data={
            activeTab === "votes" ? filteredVotes : tabData[activeTab] || []
          }
          emptyMessage={`No ${activeTab} found`}
        />
      </div>
    </main>
  );
}
