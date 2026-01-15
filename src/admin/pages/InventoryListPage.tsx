import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Archive,
    Plus,
    Search,
    AlertCircle,
    Pencil,
    Trash2,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import { adminApiService, InventoryItem } from '../services/adminApiService';
import { formatCurrency } from '../utils/adminHelpers';

const InventoryListPage: React.FC = () => {
    const navigate = useNavigate();

    const [q, setQ] = useState('');
    const [page, setPage] = useState(1);
    const limit = 10;

    const [items, setItems] = useState<InventoryItem[]>([]);
    const [total, setTotal] = useState(0);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const totalPages = useMemo(
        () => Math.max(1, Math.ceil(total / limit)),
        [total, limit]
    );

    const load = async () => {
        try {
            setLoading(true);
            setError('');

            const res = await adminApiService.getInventoryItems({
                page,
                limit,
                q,
            });

            if (!res.success) {
                setError(res.message || 'Failed to load inventory');
                return;
            }

            setItems(res.data.items || []);
            setTotal(Number(res.data.total || 0));
        } catch (e: any) {
            setError(e?.message || 'Failed to load inventory');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    const onSearch = () => {
        setPage(1);
        load();
    };

    const onDelete = async (id: number) => {
        const ok = window.confirm('Delete this inventory item? This cannot be undone.');
        if (!ok) return;

        try {
            setLoading(true);
            setError('');
            const res = await adminApiService.deleteInventoryItem(String(id));
            if (!res.success) {
                setError(res.message || 'Failed to delete item');
                return;
            }
            // If last item on page deleted, move back a page if needed
            if (items.length === 1 && page > 1) setPage(page - 1);
            else load();
        } catch (e: any) {
            setError(e?.message || 'Failed to delete item');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <div className="flex items-center space-x-3 mb-2">
                            <Archive className="h-8 w-8 text-blue-600" />
                            <h1 className="text-3xl font-bold text-gray-900">Inventory</h1>
                        </div>
                        <p className="text-gray-600">View, edit and manage your inventory items.</p>
                    </div>

                    {/* ✅ Add Inventory button */}
                    <button
                        onClick={() => navigate('/admin/inventory-entry')}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Add Inventory</span>
                    </button>
                </div>

                {/* Search */}
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
                        <div className="flex-1 relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && onSearch()}
                                placeholder="Search by name, brand, category..."
                                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <button
                            onClick={onSearch}
                            className="px-5 py-3 bg-gray-900 hover:bg-black text-white rounded-lg transition-colors"
                        >
                            Search
                        </button>
                    </div>

                    {error && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                            <AlertCircle className="h-5 w-5 text-red-500" />
                            <span className="text-red-700">{error}</span>
                        </div>
                    )}
                </div>

                {/* Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Items ({total})
                        </h2>

                        {/* Pagination */}
                        <div className="flex items-center gap-2">
                            <button
                                disabled={page <= 1}
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                className="p-2 rounded-lg border border-gray-200 disabled:opacity-50"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                            <span className="text-sm text-gray-700">
                                Page <b>{page}</b> / {totalPages}
                            </span>
                            <button
                                disabled={page >= totalPages}
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                className="p-2 rounded-lg border border-gray-200 disabled:opacity-50"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="p-8">
                            <LoadingSpinner text="Loading inventory..." />
                        </div>
                    ) : items.length === 0 ? (
                        <div className="p-10 text-center text-gray-500">
                            No inventory items found.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Item
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Category
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Brand
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Stock
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Price
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="bg-white divide-y divide-gray-200">
                                    {items.map((it) => (
                                        <tr key={it.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={(it.imageUrls?.[0] || it.image_urls?.[0] || '/justshopnship/placeholder.png') as string}
                                                        alt={it.name}
                                                        className="w-12 h-12 rounded-lg object-cover border"
                                                    />
                                                    <div>
                                                        <div className="text-sm font-semibold text-gray-900">{it.name}</div>
                                                        <div className="text-xs text-gray-500">ID: {it.id}</div>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 text-sm text-gray-700">
                                                {it.category || '-'}
                                                {it.sub_category ? (
                                                    <div className="text-xs text-gray-500">{it.sub_category}</div>
                                                ) : null}
                                            </td>

                                            <td className="px-6 py-4 text-sm text-gray-700">
                                                {it.brand || '-'}
                                            </td>

                                            <td className="px-6 py-4 text-sm text-gray-700">
                                                {it.quantity ?? '-'}
                                            </td>

                                            <td className="px-6 py-4 text-sm text-gray-700">
                                                {formatCurrency(Number(it.price || 0))}
                                            </td>

                                            <td className="px-6 py-4 text-sm font-medium">
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={() => navigate(`/admin/inventory/${it.id}/edit`)}
                                                        className="flex items-center gap-1 text-blue-600 hover:text-blue-900"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                        Edit
                                                    </button>

                                                    <button
                                                        onClick={() => onDelete(it.id)}
                                                        className="flex items-center gap-1 text-red-600 hover:text-red-900"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>

                            </table>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default InventoryListPage;