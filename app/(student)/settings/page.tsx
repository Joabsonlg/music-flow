
"use client";

import { useMock } from "@/contexts/MockContext";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCheck, UserX, Link2 } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
    const { currentUser, users, linkToTeacher, unlinkFromTeacher } = useMock();
    const [inviteCode, setInviteCode] = useState("");

    if (!currentUser) return null;

    const linkedTeacher = currentUser.teacherId
        ? users.find(u => u.id === currentUser.teacherId)
        : null;

    const handleLink = () => {
        if (!inviteCode.trim()) {
            toast.error("Digite um código de convite");
            return;
        }

        const success = linkToTeacher(inviteCode.trim());
        if (success) {
            toast.success("Vinculado ao professor com sucesso!");
            setInviteCode("");
        } else {
            toast.error("Código de convite inválido");
        }
    };

    const handleUnlink = () => {
        unlinkFromTeacher();
        toast.success("Desvinculado do professor");
    };

    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
                <p className="text-muted-foreground">Gerencie seu perfil e vínculo com professor.</p>
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

            {/* Teacher Link Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Link2 className="h-5 w-5" />
                        Vínculo com Professor
                    </CardTitle>
                    <CardDescription>
                        Vincule-se a um professor para que ele possa acompanhar seu progresso e atribuir tarefas.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {linkedTeacher ? (
                        <div className="flex items-center justify-between p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                            <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarImage src={linkedTeacher.avatarUrl} />
                                    <AvatarFallback>{linkedTeacher.name[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium flex items-center gap-2">
                                        <UserCheck className="h-4 w-4 text-green-500" />
                                        {linkedTeacher.name}
                                    </p>
                                    <p className="text-sm text-muted-foreground">{linkedTeacher.email}</p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" onClick={handleUnlink}>
                                <UserX className="h-4 w-4 mr-2" />
                                Desvincular
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="p-4 rounded-lg bg-muted/50 border border-dashed text-center">
                                <p className="text-muted-foreground">Você ainda não está vinculado a nenhum professor.</p>
                            </div>
                            <div className="flex gap-2">
                                <div className="flex-1">
                                    <Label htmlFor="inviteCode" className="sr-only">Código de Convite</Label>
                                    <Input
                                        id="inviteCode"
                                        placeholder="Digite o código de convite do professor"
                                        value={inviteCode}
                                        onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                                        onKeyDown={(e) => e.key === 'Enter' && handleLink()}
                                    />
                                </div>
                                <Button onClick={handleLink}>Vincular</Button>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                💡 Dica: Peça o código de convite ao seu professor. Exemplo: <code className="bg-muted px-1 rounded">MAESTRO123</code>
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
