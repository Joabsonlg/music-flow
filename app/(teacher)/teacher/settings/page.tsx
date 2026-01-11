
"use client";

import { useMock } from "@/contexts/MockContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Copy, Users, Key } from "lucide-react";
import { toast } from "sonner";

export default function TeacherSettingsPage() {
    const { currentUser, getStudentsForTeacher } = useMock();

    if (!currentUser) return null;

    const students = getStudentsForTeacher(currentUser.id);
    const inviteCode = currentUser.inviteCode || 'N/A';

    const copyCode = () => {
        // Fallback for browsers without clipboard API
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(inviteCode);
            toast.success("Código copiado!");
        } else {
            // Fallback using textarea
            const textArea = document.createElement("textarea");
            textArea.value = inviteCode;
            textArea.style.position = "fixed";
            textArea.style.left = "-999999px";
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand("copy");
                toast.success("Código copiado!");
            } catch (err) {
                toast.error("Não foi possível copiar");
            }
            document.body.removeChild(textArea);
        }
    };

    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
                <p className="text-muted-foreground">Gerencie seu código de convite.</p>
            </div>

            {/* Profile Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Meu Perfil</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                        <AvatarImage src={currentUser.avatarUrl} />
                        <AvatarFallback className="text-lg">{currentUser.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-lg font-medium">{currentUser.name}</p>
                        <p className="text-sm text-muted-foreground">{currentUser.email}</p>
                    </div>
                </CardContent>
            </Card>

            {/* Invite Code Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Key className="h-5 w-5" />
                        Código de Convite
                    </CardTitle>
                    <CardDescription>
                        Compartilhe este código com seus alunos para que eles possam se vincular a você.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="flex-1 p-4 rounded-lg bg-primary/10 border border-primary/20 font-mono text-2xl font-bold text-center tracking-widest text-primary">
                            {inviteCode}
                        </div>
                        <Button size="lg" variant="outline" onClick={copyCode}>
                            <Copy className="h-5 w-5" />
                        </Button>
                    </div>
                    <p className="text-sm text-muted-foreground text-center">
                        O aluno deve inserir este código na seção "Configurações" {">"} "Vínculo com Professor"
                    </p>
                </CardContent>
            </Card>

            {/* Students List */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Alunos Vinculados ({students.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {students.length > 0 ? (
                        <div className="space-y-3">
                            {students.map(student => (
                                <div key={student.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                                    <Avatar>
                                        <AvatarImage src={student.avatarUrl} />
                                        <AvatarFallback>{student.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium">{student.name}</p>
                                        <p className="text-sm text-muted-foreground">{student.email}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-4 rounded-lg bg-muted/50 border border-dashed text-center text-muted-foreground">
                            Nenhum aluno vinculado ainda.
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
