"use client";

import React, { useState } from "react";

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  align?: "left" | "center" | "right";
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchPlaceholder?: string;
  searchKey?: keyof T;
  title?: string;
  description?: string;
  actionButton?: React.ReactNode;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  searchPlaceholder = "Search records...",
  searchKey,
  title,
  description,
  actionButton,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Filtering
  const filteredData = React.useMemo(() => {
    if (!searchQuery.trim()) return data;
    return data.filter((item) => {
      if (searchKey && item[searchKey]) {
        return String(item[searchKey]).toLowerCase().includes(searchQuery.toLowerCase());
      }
      return Object.values(item).some((val) =>
        String(val).toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [data, searchQuery, searchKey]);

  // Sorting
  const sortedData = React.useMemo(() => {
    if (!sortKey) return filteredData;
    return [...filteredData].sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];
      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortKey, sortOrder]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  return (
    <div className="w-full bg-white dark:bg-[#101F33] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden transition-colors">
      {/* Header & Controls Bar */}
      {(title || description || actionButton || searchKey) && (
        <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            {title && (
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                {description}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {searchKey && (
              <div className="relative flex-1 sm:flex-none sm:w-64">
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3.5 py-2 pl-9 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 font-medium transition-colors"
                />
                <svg
                  className="w-4 h-4 text-slate-400 absolute left-3 top-2.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            )}

            {actionButton}
          </div>
        </div>
      )}

      {/* Table Body Container with Safe Horizontal Overflow */}
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 text-[11px] font-extrabold uppercase text-slate-500 dark:text-slate-400 tracking-wider">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key)}
                  className={`px-4 sm:px-6 py-3.5 transition-colors ${
                    col.sortable ? "cursor-pointer hover:text-slate-900 dark:hover:text-white" : ""
                  } ${col.align === "center" ? "text-center" : col.align === "right" ? "text-right" : "text-left"}`}
                >
                  <div className="inline-flex items-center space-x-1.5">
                    <span>{col.header}</span>
                    {col.sortable && (
                      <span className="text-slate-400 text-[10px]">
                        {sortKey === col.key ? (sortOrder === "asc" ? "▲" : "▼") : "↕"}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs font-semibold text-slate-800 dark:text-slate-200">
            {sortedData.length > 0 ? (
              sortedData.map((row, idx) => (
                <tr
                  key={row.id || idx}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-4 sm:px-6 py-4 whitespace-nowrap ${
                        col.align === "center" ? "text-center" : col.align === "right" ? "text-right" : "text-left"
                      }`}
                    >
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-400 dark:text-slate-500">
                  No records match your query.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
