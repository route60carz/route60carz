'use client'

import React, { useState, useEffect } from 'react';
import type { Car } from '@/components/inventory/CarCard';
import CarForm from '@/components/admin/CarForm';
import { Plus, Pencil, Trash2, Search, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminCarsClient({ initialCars }: { initialCars: Car[] }) {
    const router = useRouter();
    const [cars, setCars] = useState<Car[]>(initialCars);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingCar, setEditingCar] = useState<Car | null>(null);
    const [deleting, setDeleting] = useState<string | null>(null);

    useEffect(() => {
        setCars(initialCars);
    }, [initialCars]);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this car?')) return;

        setDeleting(id);
        try {
            const res = await fetch(`/api/cars/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setCars(prev => prev.filter(c => c.id !== id));
            } else {
                const data = await res.json();
                alert('Failed to delete car: ' + (data.error || 'Unknown error'));
            }
        } catch (err) {
            alert('Failed to delete car: ' + (err instanceof Error ? err.message : 'Unknown error'));
        }
        setDeleting(null);
    };

    const handleEdit = (car: Car) => {
        setEditingCar(car);
        setShowForm(true);
    };

    const handleAdd = () => {
        setEditingCar(null);
        setShowForm(true);
    };

    const handleFormClose = () => {
        setShowForm(false);
        setEditingCar(null);
    };

    const handleFormSave = () => {
        handleFormClose();
        router.refresh();
    };

    const handleStatusToggle = async (car: Car) => {
        const statusOrder = ['available', 'pending', 'sold'];
        const currentIdx = statusOrder.indexOf(car.status);
        const nextStatus = statusOrder[(currentIdx + 1) % statusOrder.length];

        try {
            const res = await fetch(`/api/cars/${car.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: nextStatus }),
            });

            if (res.ok) {
                setCars(prev => prev.map(c => c.id === car.id ? { ...c, status: nextStatus } : c));
            }
        } catch (err) {
            console.error('Failed to update status:', err);
        }
    };

    const filtered = cars.filter(car => {
        const q = searchQuery.toLowerCase();
        return !q || `${car.make} ${car.model} ${car.city}`.toLowerCase().includes(q);
    });

    const statusColors: Record<string, string> = {
        available: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        sold: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <h1 className="text-2xl font-bold text-white">Manage Cars</h1>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-black font-bold text-sm hover:bg-primary/80 transition-colors"
                >
                    <Plus size={16} />
                    Add Car
                </button>
            </div>

            {/* Search */}
            <div className="relative mb-6 max-w-md">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search cars..."
                    className="w-full bg-white/5 text-white pl-10 pr-4 py-2.5 rounded-xl border border-white/10 focus:border-primary focus:outline-none text-sm"
                />
            </div>

            {/* Loading */}
            {loading && (
                <div className="flex items-center justify-center py-20">
                    <Loader2 size={32} className="text-primary animate-spin" />
                </div>
            )}

            {/* Table */}
            {!loading && (
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Car</th>
                                <th>Year</th>
                                <th>Price</th>
                                <th>City</th>
                                <th>Fuel</th>
                                <th>Status</th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((car) => (
                                <tr key={car.id}>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            {car.image_url && (
                                                <div className="w-12 h-8 rounded-lg overflow-hidden bg-zinc-800 flex-shrink-0">
                                                    <img
                                                        src={car.image_url}
                                                        alt={`${car.make} ${car.model}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            )}
                                            <span className="font-medium text-white">
                                                {car.make} {car.model}
                                            </span>
                                        </div>
                                    </td>
                                    <td>{car.year}</td>
                                    <td className="font-mono">₹{Number(car.price).toLocaleString('en-IN')}</td>
                                    <td>{car.city}</td>
                                    <td>{car.fuel_type}</td>
                                    <td>
                                        <button
                                            onClick={() => handleStatusToggle(car)}
                                            className={`px-2.5 py-1 rounded-full text-xs font-bold border cursor-pointer ${statusColors[car.status] || ''}`}
                                        >
                                            {car.status}
                                        </button>
                                    </td>
                                    <td>
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleEdit(car)}
                                                className="p-2 rounded-lg text-secondary hover:text-white hover:bg-white/5 transition-colors"
                                                title="Edit"
                                            >
                                                <Pencil size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(car.id)}
                                                disabled={deleting === car.id}
                                                className="p-2 rounded-lg text-secondary hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                                                title="Delete"
                                            >
                                                {deleting === car.id ? (
                                                    <Loader2 size={14} className="animate-spin" />
                                                ) : (
                                                    <Trash2 size={14} />
                                                )}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filtered.length === 0 && (
                        <div className="text-center py-12 text-secondary">
                            {searchQuery ? 'No cars match your search.' : 'No cars yet. Add your first car!'}
                        </div>
                    )}
                </div>
            )}

            {/* Car Form Modal */}
            {showForm && (
                <CarForm
                    car={editingCar}
                    onClose={handleFormClose}
                    onSave={handleFormSave}
                />
            )}
        </div>
    );
}
