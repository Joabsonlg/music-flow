
"use client";

import { useMock } from "@/contexts/MockContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Music, Users, Settings } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
    const { currentUser, logout } = useMock();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!currentUser) router.push('/');
        else if (currentUser.role === 'STUDENT') router.push('/dashboard');
    }, [currentUser, router]);

    if (!currentUser || currentUser.role !== 'TEACHER') return null;

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <div className="flex items-center gap-2 md:gap-6">
                        <Link href="/teacher" className="text-xl font-bold flex items-center gap-2 text-primary">
                            <Music className="w-6 h-6" />
                            <span className="hidden sm:inline">Opus Professor</span>
                        </Link>
                        <nav className="flex items-center gap-1">
                            <Link href="/teacher">
                                <Button variant={pathname === '/teacher' ? 'secondary' : 'ghost'} className="gap-2 px-2 md:px-4" size={pathname === '/teacher' ? 'default' : 'sm'}>
                                    <Users className="w-4 h-4" />
                                    <span className="hidden md:inline">Meus Alunos</span>
                                </Button>
                            </Link>
                            <Link href="/teacher/settings">
                                <Button variant={pathname === '/teacher/settings' ? 'secondary' : 'ghost'} className="gap-2 px-2 md:px-4" size={pathname === '/teacher/settings' ? 'default' : 'sm'}>
                                    <Settings className="w-4 h-4" />
                                    <span className="hidden md:inline">Configurações</span>
                                </Button>
                            </Link>
                        </nav>
                    </div>
                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <div className="flex items-center gap-3 pl-2 md:pl-4 border-l">
                            <div className="text-right hidden lg:block">
                                <p className="text-sm font-medium leading-none">{currentUser.name}</p>
                                <p className="text-xs text-muted-foreground">Professor</p>
                            </div>
                            <Avatar>
                                <AvatarImage src={currentUser.avatarUrl} />
                                <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
                            </Avatar>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => { logout(); router.push('/'); }}>
                            <LogOut className="w-4 h-4 text-muted-foreground" />
                        </Button>
                    </div>
                </div>
            </header>
            <main className="flex-1 container mx-auto py-8 px-4">
                {children}
            </main>
        </div>
    );
}
