'use client'

import React, { useEffect, useState } from 'react';
import { Loader2, Users as UsersIcon, Mail, Calendar, Shield, User } from 'lucide-react';

interface Profile {
    id: string;
    email: string;
    full_name: string;
    role: 'user' | 'admin';
    created_at: string;
    last_login_at?: string;
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/profiles');
            const data = await res.json();

            if (!res.ok) {
                setError(`Failed to load users: ${data.error || 'Unknown error'}`);
            } else {
                setUsers(Array.isArray(data) ? data : []);
            }
        } catch (err) {
            setError(`Failed to load users: ${err instanceof Error ? err.message : 'Unknown error'}`);
            console.error('Error fetching users:', err);
        }
        setLoading(false);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 size={32} className="text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <UsersIcon size={24} className="text-primary" />
                        Users
                    </h1>
                    <p className="text-secondary text-sm mt-1">
                        View all registered users
                    </p>
                </div>
                <div className="text-sm text-secondary">
                    {users.length} total users
                </div>
            </div>

            {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                    {error}
                </div>
            )}

            {users.length === 0 ? (
                <div className="text-center py-20">
                    <User size={48} className="text-secondary mx-auto mb-4" />
                    <p className="text-secondary">No users found</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="text-left py-4 px-4 text-xs text-secondary uppercase tracking-widest font-medium">
                                    User
                                </th>
                                <th className="text-left py-4 px-4 text-xs text-secondary uppercase tracking-widest font-medium">
                                    Email
                                </th>
                                <th className="text-left py-4 px-4 text-xs text-secondary uppercase tracking-widest font-medium">
                                    Role
                                </th>
                                <th className="text-left py-4 px-4 text-xs text-secondary uppercase tracking-widest font-medium">
                                    Last Login
                                </th>
                                <th className="text-left py-4 px-4 text-xs text-secondary uppercase tracking-widest font-medium">
                                    Joined
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr
                                    key={user.id}
                                    className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                                >
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                                <span className="text-primary font-bold text-sm">
                                                    {(user.full_name || user.email || 'U')[0].toUpperCase()}
                                                </span>
                                            </div>
                                            <span className="text-white font-medium">
                                                {user.full_name || 'N/A'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-2 text-secondary">
                                            <Mail size={14} />
                                            {user.email}
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${user.role === 'admin'
                                            ? 'bg-primary/20 text-primary'
                                            : 'bg-white/10 text-secondary'
                                            }`}>
                                            {user.role === 'admin' && <Shield size={12} />}
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-secondary text-sm">
                                        {user.last_login_at ? formatDate(user.last_login_at) : 'Never'}
                                    </td>
                                    <td className="py-4 px-4 text-secondary text-sm">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} />
                                            {formatDate(user.created_at)}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
