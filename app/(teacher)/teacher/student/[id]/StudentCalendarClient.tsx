"use client";

import { useMock } from "@/contexts/MockContext";
import { useState } from "react";
import { format, startOfWeek, addDays, isSameDay, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus, Clock, CheckCircle2, Circle, ArrowLeft } from "lucide-react";
import { Task } from "@/lib/mock-data";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import TaskForm from "@/app/(student)/dashboard/_components/TaskForm";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";

interface StudentCalendarClientProps {
    studentId: string;
}

export default function StudentCalendarClient({ studentId }: StudentCalendarClientProps) {
    const { currentUser, getStudentTasks, updateTask } = useMock();

    const [currentViewDate, setCurrentViewDate] = useState(new Date());
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
    const [formDefaultDate, setFormDefaultDate] = useState<Date>(new Date());

    if (!currentUser) return null;
    const tasks = getStudentTasks(studentId);

    const startDate = startOfWeek(currentViewDate, { weekStartsOn: 0 });
    const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(startDate, i));

    const handleTaskClick = (task: Task) => {
        setEditingTask(task);
        setFormDefaultDate(parseISO(task.date));
        setIsFormOpen(true);
    };

    const handleNewTask = (day: Date) => {
        setEditingTask(undefined);
        setFormDefaultDate(day);
        setIsFormOpen(true);
    };

    const toggleTaskStatus = (e: React.MouseEvent, task: Task) => {
        e.stopPropagation();
        updateTask(task.id, { status: task.status === 'DONE' ? 'TODO' : 'DONE' });
    };

    return (
        <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col">
            <div className="flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <Link href="/teacher">
                        <Button variant="ghost" size="icon"><ArrowLeft /></Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Agenda do Aluno</h1>
                        <p className="text-muted-foreground">Gerencie a prática do aluno.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => setCurrentViewDate(addDays(currentViewDate, -7))}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="min-w-[150px] text-center font-medium">
                        {format(startDate, "MMMM yyyy", { locale: ptBR })}
                        <span className="text-xs text-muted-foreground block">
                            {format(startDate, "d")} - {format(addDays(startDate, 6), "d")}
                        </span>
                    </div>
                    <Button variant="outline" size="icon" onClick={() => setCurrentViewDate(addDays(currentViewDate, 7))}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-7 gap-4 flex-1 min-h-0">
                {weekDays.map((day) => {
                    const dayTasks = tasks.filter(t => isSameDay(parseISO(t.date), day));
                    const isToday = isSameDay(new Date(), day);

                    return (
                        <div key={day.toISOString()} className={cn("flex flex-col gap-3 rounded-xl border bg-card p-3 shadow-sm overflow-hidden", isToday && "ring-2 ring-primary ring-offset-2")}>
                            <div className="text-center pb-2 border-b shrink-0">
                                <div className="text-xs font-semibold text-muted-foreground uppercase">{format(day, "EEE", { locale: ptBR })}</div>
                                <div className={cn("text-2xl font-bold", isToday && "text-primary")}>{format(day, "d")}</div>
                            </div>

                            <ScrollArea className="flex-1 -mr-2 pr-2">
                                <div className="space-y-2 pb-2">
                                    {dayTasks.map(task => (
                                        <Card key={task.id} className="cursor-pointer hover:bg-accent transition-colors group relative overflow-hidden border-muted" onClick={() => handleTaskClick(task)}>
                                            <div className={cn("absolute left-0 top-0 bottom-0 w-1", task.status === 'DONE' ? "bg-green-500" : "bg-primary")}></div>
                                            <div className="p-3 pl-4">
                                                <div className="flex items-start justify-between gap-1 mb-1">
                                                    <span className={cn("font-medium text-sm leading-tight line-clamp-3", task.status === 'DONE' && "line-through text-muted-foreground")}>{task.title}</span>
                                                    <button onClick={(e) => toggleTaskStatus(e, task)} className="text-muted-foreground hover:text-green-500 transition-colors shrink-0">
                                                        {task.status === 'DONE' ? <CheckCircle2 size={16} className="text-green-500" /> : <Circle size={16} />}
                                                    </button>
                                                </div>
                                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                    <Clock size={12} />
                                                    <span>{task.durationMinutes} min</span>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                    <Button variant="ghost" className="w-full h-8 text-xs text-muted-foreground hover:text-primary dashed border border-dashed border-transparent hover:border-primary/50" onClick={() => handleNewTask(day)}>
                                        <Plus size={14} className="mr-1" /> Adicionar
                                    </Button>
                                </div>
                            </ScrollArea>
                        </div>
                    );
                })}
            </div>

            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent>
                    <TaskForm
                        initialData={editingTask}
                        defaultDate={formDefaultDate}
                        onClose={() => setIsFormOpen(false)}
                        studentId={studentId}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}
