
"use client";

import { useMock } from "@/contexts/MockContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Music } from "lucide-react";

export default function LoginPage() {
  const { login, currentUser } = useMock();
  const router = useRouter();

  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'STUDENT') router.push('/dashboard');
      else router.push('/teacher');
    }
  }, [currentUser, router]);

  const handleLogin = (role: 'STUDENT' | 'TEACHER') => {
    if (role === 'STUDENT') {
      login('alice@example.com');
    } else {
      login('john@maestro.com');
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-muted/30">
      <div className="mb-8 flex items-center gap-2">
        <div className="p-3 bg-primary rounded-xl text-primary-foreground">
          <Music size={32} />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Music Flow</h1>
      </div>

      <Card className="w-full max-w-md shadow-lg border-muted/60">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl">Bem-vindo de volta</CardTitle>
          <CardDescription>Selecione seu perfil para continuar praticando.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button size="lg" className="w-full text-lg h-14" onClick={() => handleLogin('STUDENT')}>
            Sou Aluno
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Ou
              </span>
            </div>
          </div>
          <Button variant="outline" size="lg" className="w-full text-lg h-14" onClick={() => handleLogin('TEACHER')}>
            Sou Professor
          </Button>
        </CardContent>
      </Card>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Opus Planner MVP &copy; {new Date().getFullYear()}
      </p>
    </div>
  );
}
