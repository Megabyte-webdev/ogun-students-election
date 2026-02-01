import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout.jsx";
import useAdmin from "../hooks/useAdmin.js";
import Modal from "../components/Modal.jsx";
import ElectionForm from "../components/ElectionForm.jsx";
import PositionForm from "../components/PositionForm.jsx";
import CandidateForm from "../components/CandidateForm.jsx";
import DashboardSidebar from "../components/DashboardSidebar.jsx";
import DashboardContent from "../components/DashboardContent.jsx";

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
  const [stats, setStats] = useState({
    activeElections: 0,
    totalPositions: 0,
    totalCandidates: 0,
    totalVotes: 0,
    reportedAbuse: 0,
  });
  const [tabData, setTabData] = useState({
    elections: [],
    positions: [],
    candidates: [],
    votes: [],
    abuse: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState({ open: false, type: null, item: null });

  /** Fetch dashboard stats */
  const fetchStats = async () => {
    try {
      const res = await get("dashboard/stats");
      setStats(res);
    } catch (err) {
      console.error("Failed to fetch dashboard stats:", err);
    }
  };

  /** Fetch tab data independently */
  const fetchTabData = async (tab) => {
    setIsLoading(true);
    try {
      if (tab === "elections") {
        const res = await get("elections");
        setTabData((p) => ({ ...p, elections: res.elections || [] }));
      }
      if (tab === "positions") {
        const res = await get("positions");
        setTabData((p) => ({ ...p, positions: res.positions || [] }));
      }
      if (tab === "candidates") {
        const res = await get("candidates");
        setTabData((p) => ({ ...p, candidates: res.candidates || [] }));
      }
      if (tab === "votes") {
        const res = await listVotes();
        setTabData((p) => ({ ...p, votes: res.votes || [] }));
      }
      if (tab === "abuse") {
        const res = await listAbuseLogs();
        setTabData((p) => ({ ...p, abuse: res.logs || [] }));
      }
    } catch (err) {
      console.error("Failed to fetch tab data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  /** Initial load */
  useEffect(() => {
    fetchStats();
    fetchTabData(activeTab);
  }, []);

  /** Refetch tab data when changing tabs */
  useEffect(() => {
    fetchTabData(activeTab);
  }, [activeTab]);

  /** Delete handler */
  const handleDelete = async (type, id) => {
    if (!confirm("Are you sure?")) return;
    if (type === "elections") await deleteElection(id);
    if (type === "positions") await deletePosition(id);
    if (type === "candidates") await deleteCandidate(id);
    fetchTabData(type);
    fetchStats(); // update stats after deletion
  };

  /** Activate handler */
  const handleActivate = async (type, id, activate = true) => {
    if (type === "elections") {
      activate ? await activateElection(id) : await deactivateElection(id);
    }
    if (type === "positions") await activatePosition(id);
    fetchTabData(type);
    fetchStats(); // update stats after activation
  };

  return (
    <AdminLayout>
      <div className="flex flex-col lg:flex-row gap-6">
        <DashboardSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          refresh={() => {
            fetchTabData(activeTab);
            fetchStats();
          }}
        />

        <DashboardContent
          activeTab={activeTab}
          tabData={tabData}
          stats={stats}
          isLoading={isLoading}
          onAdd={(type) => setModal({ open: true, type })}
          onEdit={(type, item) => setModal({ open: true, type, item })}
          onDelete={handleDelete}
          onActivate={handleActivate}
        />
      </div>

      <Modal
        open={modal.open}
        onClose={() => setModal({ open: false, type: null, item: null })}
      >
        {modal.type === "elections" && (
          <ElectionForm
            election={modal.item}
            onCreated={() => {
              fetchTabData("elections");
              fetchStats();
              setModal({ type: "elections", open: false });
            }}
          />
        )}
        {modal.type === "positions" && (
          <PositionForm
            position={modal.item}
            onCreated={() => {
              fetchTabData("positions");
              fetchStats();
              setModal({ type: "positions", open: false });
            }}
          />
        )}
        {modal.type === "candidates" && (
          <CandidateForm
            candidate={modal.item}
            onCreated={() => {
              fetchTabData("candidates");
              fetchStats();
              setModal({ type: "candidates", open: false });
            }}
          />
        )}
      </Modal>
    </AdminLayout>
  );
}
