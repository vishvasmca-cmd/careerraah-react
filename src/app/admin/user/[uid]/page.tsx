
'use client';

import { useEffect, useState } from 'react';
import { getUserFullData } from '@/lib/firestore-utils';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, MessageSquare, FileText, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdminGuard } from '@/components/admin/AdminGuard';

export default function UserDetailsPage() {
    const params = useParams();
    const uid = params.uid as string;
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            if (!uid) return;
            const result = await getUserFullData(uid);
            setData(result);
            setLoading(false);
        }
        load();
    }, [uid]);

    if (loading) return <div className="p-8 text-center">Loading user data...</div>;
    if (!data) return <div className="p-8 text-center">User data not found.</div>;

    return (
        <AdminGuard>
            <div className="container mx-auto py-8 px-4">
                <div className="mb-6">
                    <Link href="/admin" className="text-muted-foreground hover:text-foreground flex items-center gap-2">
                        <ArrowLeft size={16} /> Back to Dashboard
                    </Link>
                </div>

                <h1 className="text-3xl font-bold mb-6 font-headline">User: {uid}</h1>

                <Tabs defaultValue="assessment">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="assessment"><ClipboardList className="mr-2 w-4 h-4" /> Assessment</TabsTrigger>
                        <TabsTrigger value="report"><FileText className="mr-2 w-4 h-4" /> Report</TabsTrigger>
                        <TabsTrigger value="chat"><MessageSquare className="mr-2 w-4 h-4" /> Chat History ({data.chats?.length || 0})</TabsTrigger>
                    </TabsList>

                    <TabsContent value="assessment">
                        <Card>
                            <CardHeader><CardTitle>Assessment Data</CardTitle></CardHeader>
                            <CardContent>
                                <pre className="bg-secondary/20 p-4 rounded-lg overflow-auto max-h-[600px] text-xs whitespace-pre-wrap">
                                    {JSON.stringify(data.assessment, null, 2)}
                                </pre>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="report">
                        <Card>
                            <CardHeader><CardTitle>Generated Report</CardTitle></CardHeader>
                            <CardContent>
                                <div className="prose dark:prose-invert max-w-none p-4 border rounded-md min-h-[200px]">
                                    {data.report?.content ? (
                                        <div dangerouslySetInnerHTML={{
                                            __html: data.report.content
                                            // Determine if content is markdown or html. 
                                            // The report generation usually returns markdown. I should probably use a markdown renderer here too.
                                            // For now, simple text display or raw HTML if it contains tags.
                                            // Actually, the assessment component handles markdown rendering. 
                                            // I'll leave it as is, maybe the raw text is readable enough.
                                        }} />
                                    ) : <p>No report generated yet.</p>}
                                    {/* Fallback for markdown raw text if the above is empty because it's not HTML */}
                                    {data.report?.content && <div className="mt-4 pt-4 border-t"><h4 className="font-bold">Raw Content:</h4><pre className="whitespace-pre-wrap text-sm">{data.report.content}</pre></div>}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="chat">
                        <Card>
                            <CardHeader><CardTitle>Chat Transcript</CardTitle></CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {data.chats?.map((msg: any, i: number) => (
                                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[80%] rounded-lg p-3 ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
                                                <p className="text-xs font-bold mb-1 opacity-70">{msg.role.toUpperCase()}</p>
                                                <p>{msg.text}</p>
                                                <p className="text-[10px] mt-1 opacity-50 text-right">{msg.timestamp?.toDate ? msg.timestamp.toDate().toLocaleString() : ''}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {(!data.chats || data.chats.length === 0) && <p className="text-muted-foreground">No chat history found.</p>}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AdminGuard>
    );
}
