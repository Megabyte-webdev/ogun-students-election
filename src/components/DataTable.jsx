import React from "react";

export default function DataTable({ columns, data, emptyMessage }) {
  return (
    <div className=" w-full max-w-full overflow-x-auto ">
      <table className="w-full table-auto border-collapse divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th
                key={col.accessor}
                className="px-3 py-2 text-left text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-3 py-4 text-center text-sm text-gray-500"
              >
                {emptyMessage || "No data found"}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={row.id ?? `row-${rowIndex}`}
                className="hover:bg-gray-50"
              >
                {columns.map((col, colIndex) => (
                  <td
                    key={`${row.id ?? rowIndex}-${col.accessor ?? colIndex}`}
                    className="px-3 py-2 text-xs sm:text-sm text-gray-600 "
                  >
                    {col.cell ? col.cell(row) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
