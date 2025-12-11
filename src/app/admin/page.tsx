
'use client';

import { useEffect, useState } from 'react';
import { getAllUsers, UserSummary } from '@/lib/firestore-utils';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AdminGuard } from '@/components/admin/AdminGuard';

export default function AdminDashboard() {
    const [users, setUsers] = useState<UserSummary[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const data = await getAllUsers();
            setUsers(data);
            setLoading(false);
        }
        load();
    }, []);

    if (loading) return <div className="p-8 text-center">Loading users...</div>;

    return (
        <AdminGuard>
            <div className="container mx-auto py-8 px-4">
                <Card>
                    <CardHeader>
                        <CardTitle>User Data Admin</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User ID</TableHead>
                                    <TableHead>Last Active</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map(u => (
                                    <TableRow key={u.uid}>
                                        <TableCell className="font-mono text-xs">{u.uid}</TableCell>
                                        <TableCell>
                                            {u.lastActive?.toDate ? u.lastActive.toDate().toLocaleString() : 'N/A'}
                                        </TableCell>
                                        <TableCell>
                                            <Link href={`/admin/user/${u.uid}`} className="text-primary hover:underline font-medium">
                                                View Data
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {users.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center h-24 text-muted-foreground">
                                            No users found with saved data.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AdminGuard>
    );
}
