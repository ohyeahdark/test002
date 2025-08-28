import React, { useMemo, useState, useEffect } from 'react';
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableCell,
} from '../ui/table';
import { useDebounce } from '../../hooks/useDebounce';
import { useTranslation } from 'react-i18next';
import { useResponsive } from '../../hooks/useResponsive';
import { DataCardList } from './DataCardList';

interface Column<T> {
    title: string;
    key?: keyof T;
    render: (item: T, index: number) => React.ReactNode;
    className?: string;
    sortable?: boolean;
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    loading?: boolean;
    emptyMessage?: string;
    pagination?: {
        page: number;
        pageSize: number;
        totalCount: number;
        onPageChange: (newPage: number) => void;
        serverSide?: boolean;
    };
    onSearch?: (keyword: string) => void;
    onEdit?: (item: T) => void;
    onDelete?: (item: T) => void;
}

export function DataTable<T>({
    data,
    columns,
    loading = false,
    emptyMessage,
    pagination,
    onSearch,
    onEdit,
    onDelete,
}: DataTableProps<T>) {
    const { t } = useTranslation();
    const { isMobile } = useResponsive();
    const [sortKey, setSortKey] = useState<keyof T | null>(null);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [searchValue, setSearchValue] = useState('');
    const debouncedSearch = useDebounce(searchValue, 500);

    useEffect(() => {
        if (onSearch) {
            onSearch(debouncedSearch.trim());
        }
    }, [debouncedSearch, onSearch]);

    const handleSort = (key?: keyof T) => {
        if (!key) return;
        if (sortKey === key) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortOrder('asc');
        }
    };

    const sortedData = useMemo(() => {
        if (!sortKey || pagination?.serverSide) return data;

        return [...data].sort((a, b) => {
            const aValue = a[sortKey];
            const bValue = b[sortKey];

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return sortOrder === 'asc'
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            }

            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
            }

            return 0;
        });
    }, [data, sortKey, sortOrder, pagination]);

    const displayedData = useMemo(() => {
        if (pagination?.serverSide) return data;
        if (!pagination) return sortedData;
        const start = (pagination.page - 1) * pagination.pageSize;
        return sortedData.slice(start, start + pagination.pageSize);
    }, [sortedData, data, pagination]);

    const totalPages = pagination ? Math.ceil(pagination.totalCount / pagination.pageSize) : 1;

    if (isMobile) {
        return (
            <DataCardList
                data={displayedData}
                loading={loading}
                fields={columns
                    .filter((col) => !!col.key)
                    .map((col) => ({
                        label: col.title,
                        key: col.key as keyof T,
                        render: col.render as (item: T) => React.ReactNode,
                    }))}
                onEdit={onEdit}
                onDelete={onDelete}
                emptyMessage={emptyMessage}
            />
        );
    }

    return (
        <div className="w-full max-w-full overflow-x-auto rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            {onSearch && (
                <div className="p-4">
                    <input
                        type="text"
                        placeholder={t('common.searchPlaceholder')}
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        className="w-full max-w border px-3 py-2 rounded text-sm dark:bg-white/[0.05] text-black dark:text-white"
                    />
                </div>
            )}

            <div className="w-full min-w-full">
                <Table className="w-full table-auto bg-white dark:bg-white/[0.03]">
                    <TableHeader className="border-b border-gray-100 dark:border-white/[0.05] bg-gray-50 dark:bg-white/[0.05]">
                        <TableRow>
                            {columns.map((col, i) => {
                                const isActiveSort = col.key && col.key === sortKey;
                                const responsiveClass = i > 2 ? 'hidden lg:table-cell' : '';
                                return (
                                    <TableCell
                                        key={i}
                                        isHeader
                                        className={`px-3 py-2 font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-transparent text-center text-sm whitespace-nowrap ${col.sortable ? 'cursor-pointer select-none' : ''} ${col.className || ''} ${responsiveClass}`}
                                        onClick={col.sortable && col.key ? () => handleSort(col.key) : undefined}
                                    >
                                        {col.title}
                                        {col.sortable && isActiveSort && (
                                            <span className="ml-1 text-xs">{sortOrder === 'asc' ? '▲' : '▼'}</span>
                                        )}
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                    </TableHeader>

                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="p-4 text-center">
                                    {t('common.loading')}
                                </TableCell>
                            </TableRow>
                        ) : displayedData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="p-4 text-center text-gray-500">
                                    {emptyMessage || t('common.noData')}
                                </TableCell>
                            </TableRow>
                        ) : (
                            displayedData.map((item, index) => (
                                <TableRow key={index}>
                                    {columns.map((col, colIndex) => (
                                        <TableCell
                                            key={colIndex}
                                            className={`px-3 py-2 text-sm align-top break-words whitespace-normal text-gray-800 dark:text-white ${col.className || ''} ${colIndex > 2 ? 'hidden lg:table-cell' : ''}`}
                                        >
                                            {col.render(item, index)}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {pagination && totalPages > 1 && (
                <div className="flex justify-end p-4 text-sm text-gray-500 gap-2">
                    <button
                        className="px-2 py-1 border rounded disabled:opacity-50"
                        onClick={() => pagination.onPageChange(pagination.page - 1)}
                        disabled={pagination.page === 1}
                    >
                        {t('common.prev')}
                    </button>
                    <span>
                        {t('common.page')} {pagination.page} / {totalPages}
                    </span>
                    <button
                        className="px-2 py-1 border rounded disabled:opacity-50"
                        onClick={() => pagination.onPageChange(pagination.page + 1)}
                        disabled={pagination.page === totalPages}
                    >
                        {t('common.next')}
                    </button>
                </div>
            )}
        </div>
    );
}
