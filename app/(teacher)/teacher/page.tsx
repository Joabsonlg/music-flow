
"use client";

import { useMock } from "@/contexts/MockContext";
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ChevronRight, Search } from "lucide-react";
import Link from "next/link";

export default function TeacherDashboard() {
    const { currentUser, getStudentsForTeacher } = useMock();
    const [searchQuery, setSearchQuery] = useState("");

    if (!currentUser) return null;
    const allStudents = getStudentsForTeacher(currentUser.id);

    // Filter students based on search query
    const students = useMemo(() => {
        if (!searchQuery.trim()) return allStudents;
        const query = searchQuery.toLowerCase();
        return allStudents.filter(student =>
            student.name.toLowerCase().includes(query) ||
            student.email.toLowerCase().includes(query)
        );
    }, [allStudents, searchQuery]);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Meus Alunos</h1>
                <p className="text-muted-foreground">Gerencie rotinas de prática e acompanhe o progresso.</p>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Buscar alunos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* Results Count */}
            {searchQuery && (
                <p className="text-sm text-muted-foreground">
                    {students.length} {students.length === 1 ? 'aluno encontrado' : 'alunos encontrados'}
                </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {students.map(student => (
                    <Link key={student.id} href={`/teacher/student/${student.id}`}>
                        <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
                            <CardHeader className="flex flex-row items-center gap-4">
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={student.avatarUrl} />
                                    <AvatarFallback>{student.name[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <CardTitle>{student.name}</CardTitle>
                                    <CardDescription>{student.email}</CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent className="flex justify-between items-center text-sm text-muted-foreground">
                                <span>Ver Calendário</span>
                                <ChevronRight className="h-4 w-4" />
                            </CardContent>
                        </Card>
                    </Link>
                ))}
                {students.length === 0 && (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                        {searchQuery
                            ? "Nenhum aluno encontrado."
                            : "Nenhum aluno vinculado ainda. Compartilhe seu código de convite."
                        }
                    </div>
                )}
            </div>
        </div>
    );
}
