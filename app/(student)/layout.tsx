
"use client";

import { useMock } from "@/contexts/MockContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Calendar, Library, Music, Settings } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
    const { currentUser, logout } = useMock();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!currentUser) router.push('/');
        else if (currentUser.role === 'TEACHER') router.push('/teacher');
    }, [currentUser, router]);

    if (!currentUser || currentUser.role !== 'STUDENT') return null;

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <div className="flex items-center gap-2 md:gap-8">
                        <Link href="/dashboard" className="text-xl font-bold flex items-center gap-2 text-primary">
                            <Music className="w-6 h-6" />
                            <span className="hidden sm:inline">Music Flow</span>
                        </Link>
                        <nav className="flex items-center gap-1">
                            <Link href="/dashboard">
                                <Button variant={pathname === '/dashboard' ? 'secondary' : 'ghost'} className="gap-2 px-2 md:px-4" size={pathname === '/dashboard' ? 'default' : 'sm'}>
                                    <Calendar className="w-4 h-4" />
                                    <span className="hidden md:inline">Agenda</span>
                                </Button>
                            </Link>
                            <Link href="/library">
                                <Button variant={pathname === '/library' ? 'secondary' : 'ghost'} className="gap-2 px-2 md:px-4" size={pathname === '/library' ? 'default' : 'sm'}>
                                    <Library className="w-4 h-4" />
                                    <span className="hidden md:inline">Biblioteca</span>
                                </Button>
                            </Link>
                            <Link href="/settings">
                                <Button variant={pathname === '/settings' ? 'secondary' : 'ghost'} className="gap-2 px-2 md:px-4" size={pathname === '/settings' ? 'default' : 'sm'}>
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
                                <p className="text-xs text-muted-foreground">Aluno</p>
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
