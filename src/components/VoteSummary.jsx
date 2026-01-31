import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const COLORS = [
  "#6366F1",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
  "#06B6D4",
];

// Custom Tooltip for a more "Admin Dashboard" feel
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border rounded-lg shadow-xl ring-1 ring-black ring-opacity-5">
        <p className="font-bold text-gray-900 mb-2 border-b pb-1">{label}</p>
        {payload.map((entry, index) => (
          <div
            key={index}
            className="flex justify-between items-center gap-4 text-sm py-0.5"
          >
            <span className="flex items-center">
              <span
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: entry.fill }}
              />
              <span className="text-gray-600">{entry.name}:</span>
            </span>
            <span className="font-mono font-bold text-gray-900">
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function VoteSummaryChart({ votes = [] }) {
  // 1. Scalable Data Transformation
  const { chartData, candidateKeys } = useMemo(() => {
    const grouped = {};
    const keys = new Set();

    votes.forEach((v) => {
      if (!grouped[v.position]) grouped[v.position] = { position: v.position };
      grouped[v.position][v.candidate] =
        (grouped[v.position][v.candidate] || 0) + 1;
      keys.add(v.candidate);
    });

    return {
      chartData: Object.values(grouped),
      candidateKeys: Array.from(keys),
    };
  }, [votes]);

  if (chartData.length === 0) {
    return (
      <div className="w-full h-80 flex items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
        <p className="text-gray-500 font-medium">No votes recorded yet</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900">
          Election Participation
        </h3>
        <p className="text-sm text-gray-500">
          Real-time vote distribution per position
        </p>
      </div>

      <div className="w-full h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
            barGap={8}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#F3F4F6"
            />
            <XAxis
              dataKey="position"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6B7280", fontSize: 12 }}
              dy={10}
            />
            <YAxis
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6B7280", fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#F9FAFB" }} />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{ paddingBottom: "20px", fontSize: "12px" }}
            />
            {candidateKeys.map((key, idx) => (
              <Bar
                key={key}
                dataKey={key}
                name={key}
                stackId="votes"
                fill={COLORS[idx % COLORS.length]}
                radius={
                  idx === candidateKeys.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]
                }
                maxBarSize={50}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
