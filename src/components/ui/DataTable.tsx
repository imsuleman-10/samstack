'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SearchBar } from './SearchBar';

interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (row: T) => string;
  onRowClick?: (row: T) => void;
  isLoading?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (val: string) => void;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  selectable?: boolean;
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
}

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  onRowClick,
  isLoading,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  page = 1,
  totalPages = 1,
  onPageChange,
  selectable = false,
  selectedIds = [],
  onSelectionChange,
}: DataTableProps<T>) {
  const allIds = data.map(keyExtractor);
  const isAllSelected = data.length > 0 && data.every(row => selectedIds.includes(keyExtractor(row)));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      onSelectionChange?.(selectedIds.filter(id => !allIds.includes(id)));
    } else {
      const newSelections = Array.from(new Set([...selectedIds, ...allIds]));
      onSelectionChange?.(newSelections);
    }
  };

  const toggleSelectRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIds.includes(id)) {
      onSelectionChange?.(selectedIds.filter(selected => selected !== id));
    } else {
      onSelectionChange?.([...selectedIds, id]);
    }
  };

  return (
    <div className="w-full bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-2xl shadow-xs overflow-hidden transition-colors">
      {onSearchChange && (
        <div className="p-4 border-b border-slate-100 dark:border-zinc-800/80 bg-slate-50/50 dark:bg-zinc-900/50">
          <SearchBar
            value={searchValue || ''}
            onChange={onSearchChange}
            placeholder={searchPlaceholder || 'Search...'}
            className="max-w-md"
          />
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-zinc-400 border-b border-slate-200/80 dark:border-zinc-800 bg-slate-50/80 dark:bg-zinc-800/40 font-bold">
            <tr>
              {selectable && (
                <th className="px-6 py-3.5 w-12">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-slate-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-brand-600 focus:ring-brand-500/20"
                  />
                </th>
              )}
              {columns.map(col => (
                <th key={col.key} className="px-6 py-3.5 font-bold">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0)} className="px-6 py-12 text-center text-slate-400 dark:text-zinc-500">
                  <div className="inline-block w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mb-2" />
                  <p className="text-xs font-medium">Loading data...</p>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0)} className="px-6 py-12 text-center text-slate-400 dark:text-zinc-500">
                  No records found.
                </td>
              </tr>
            ) : (
              data.map(row => {
                const id = keyExtractor(row);
                const isSelected = selectedIds.includes(id);
                return (
                  <tr
                    key={id}
                    onClick={() => onRowClick?.(row)}
                    className={`transition-colors ${
                      onRowClick ? 'cursor-pointer hover:bg-slate-50/80 dark:hover:bg-zinc-800/40' : ''
                    } ${isSelected ? 'bg-brand-50/50 dark:bg-brand-950/20' : ''}`}
                  >
                    {selectable && (
                      <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => toggleSelectRow(id, e as unknown as React.MouseEvent)}
                          className="w-4 h-4 rounded border-slate-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-brand-600 focus:ring-brand-500/20"
                        />
                      </td>
                    )}
                    {columns.map(col => (
                      <td key={col.key} className="px-6 py-4 whitespace-nowrap text-slate-700 dark:text-zinc-200">
                        {col.render ? col.render(row) : String((row as any)[col.key] || '-')}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {onPageChange && totalPages > 1 && (
        <div className="px-6 py-4 flex items-center justify-between border-t border-slate-100 dark:border-zinc-800/80 bg-slate-50/40 dark:bg-zinc-900/40 text-sm text-slate-500 dark:text-zinc-400">
          <span>
            Page <span className="font-bold text-slate-900 dark:text-white">{page}</span> of{' '}
            <span className="font-bold text-slate-900 dark:text-white">{totalPages}</span>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
