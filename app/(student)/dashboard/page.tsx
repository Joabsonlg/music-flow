
"use client";

import { useMock } from "@/contexts/MockContext";
import { useState } from "react";
import { format, startOfWeek, addDays, isSameDay, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus, Clock, CheckCircle2, Circle, Star, ChevronDown } from "lucide-react";
import { Task } from "@/lib/mock-data";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import TaskForm from "./_components/TaskForm";
import FeedbackModal from "./_components/FeedbackModal";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export default function DashboardPage() {
    const { currentUser, getStudentTasks, updateTask } = useMock();
    const [currentViewDate, setCurrentViewDate] = useState(new Date());
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
    const [formDefaultDate, setFormDefaultDate] = useState<Date>(new Date());

    // Feedback modal state
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
    const [taskForFeedback, setTaskForFeedback] = useState<Task | null>(null);

    // Mobile: track which day is expanded
    const [expandedDay, setExpandedDay] = useState<string | null>(new Date().toISOString().split('T')[0]);

    if (!currentUser) return null;
    const tasks = getStudentTasks(currentUser.id);

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

        if (task.status === 'TODO') {
            // Opening feedback modal when completing a task
            setTaskForFeedback(task);
            setIsFeedbackOpen(true);
        } else {
            // Simply mark as TODO if already done
            updateTask(task.id, { status: 'TODO', feedback: undefined });
        }
    };

    const handleFeedbackSubmit = (feedback: { rating: number; comment?: string }) => {
        if (taskForFeedback) {
            updateTask(taskForFeedback.id, {
                status: 'DONE',
                feedback
            });
        }
        setTaskForFeedback(null);
    };

    // Desktop Calendar View
    const DesktopCalendar = () => (
        <div className="hidden md:grid md:grid-cols-7 gap-4 flex-1 min-h-0">
            {weekDays.map((day) => {
                const dayTasks = tasks.filter(t => isSameDay(parseISO(t.date), day));
                const isToday = isSameDay(new Date(), day);

                return (
                    <div key={day.toISOString()} className={cn("flex flex-col gap-3 rounded-xl border bg-card p-3 shadow-sm overflow-hidden", isToday && "border-2 border-primary")}>
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
                                                <span className={cn("font-medium text-sm leading-tight line-clamp-2", task.status === 'DONE' && "line-through text-muted-foreground")}>{task.title}</span>
                                                <button onClick={(e) => toggleTaskStatus(e, task)} className="text-muted-foreground hover:text-green-500 transition-colors shrink-0">
                                                    {task.status === 'DONE' ? <CheckCircle2 size={16} className="text-green-500" /> : <Circle size={16} />}
                                                </button>
                                            </div>
                                            <div className="flex items-center justify-between gap-1 text-xs text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <Clock size={12} />
                                                    {task.durationMinutes} min
                                                </span>
                                                {task.feedback && (
                                                    <span className="flex items-center gap-0.5">
                                                        {Array.from({ length: task.feedback.rating }).map((_, i) => (
                                                            <Star key={i} size={10} className="fill-yellow-400 text-yellow-400" />
                                                        ))}
                                                    </span>
                                                )}
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
    );

    // Mobile List View with Collapsible Days
    const MobileCalendar = () => (
        <div className="md:hidden flex flex-col gap-2 overflow-y-auto flex-1 p-1">
            {weekDays.map((day) => {
                const dayKey = format(day, 'yyyy-MM-dd');
                const dayTasks = tasks.filter(t => isSameDay(parseISO(t.date), day));
                const isToday = isSameDay(new Date(), day);
                const isExpanded = expandedDay === dayKey;
                const taskCount = dayTasks.length;
                const doneCount = dayTasks.filter(t => t.status === 'DONE').length;

                return (
                    <Collapsible
                        key={day.toISOString()}
                        open={isExpanded}
                        onOpenChange={(open) => setExpandedDay(open ? dayKey : null)}
                    >
                        <div className={cn(
                            "rounded-lg bg-card overflow-hidden",
                            isToday && "ring-2 ring-primary"
                        )}>
                            <CollapsibleTrigger className="w-full">
                                <div className="flex items-center justify-between p-3">
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "text-2xl font-bold w-10 text-center",
                                            isToday ? "text-primary" : "text-foreground"
                                        )}>
                                            {format(day, "d")}
                                        </div>
                                        <div className="text-left">
                                            <div className={cn(
                                                "font-medium capitalize",
                                                isToday && "text-primary"
                                            )}>{format(day, "EEEE", { locale: ptBR })}</div>
                                            <div className="text-xs text-muted-foreground">
                                                {taskCount === 0 ? "Nenhuma sessão" :
                                                    `${taskCount} ${taskCount === 1 ? 'sessão' : 'sessões'}${doneCount > 0 ? ` • ${doneCount} ✓` : ''}`
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <ChevronDown className={cn(
                                        "h-5 w-5 text-muted-foreground transition-transform",
                                        isExpanded && "rotate-180"
                                    )} />
                                </div>
                            </CollapsibleTrigger>

                            <CollapsibleContent>
                                <div className="px-3 pb-3 space-y-2 pt-2">
                                    {dayTasks.map(task => (
                                        <div key={task.id} className="cursor-pointer hover:bg-accent/50 transition-colors relative overflow-hidden rounded-lg bg-muted/30" onClick={() => handleTaskClick(task)}>
                                            <div className={cn("absolute left-0 top-0 bottom-0 w-1 rounded-l", task.status === 'DONE' ? "bg-green-500" : "bg-primary")}></div>
                                            <div className="p-3 pl-4">
                                                <div className="flex items-start justify-between gap-2 mb-1">
                                                    <span className={cn("font-medium text-sm leading-tight", task.status === 'DONE' && "line-through text-muted-foreground")}>{task.title}</span>
                                                    <button onClick={(e) => toggleTaskStatus(e, task)} className="text-muted-foreground hover:text-green-500 transition-colors shrink-0">
                                                        {task.status === 'DONE' ? <CheckCircle2 size={18} className="text-green-500" /> : <Circle size={18} />}
                                                    </button>
                                                </div>
                                                <div className="flex items-center justify-between gap-1 text-xs text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <Clock size={12} />
                                                        {task.durationMinutes} min
                                                    </span>
                                                    {task.feedback && (
                                                        <span className="flex items-center gap-0.5">
                                                            {Array.from({ length: task.feedback.rating }).map((_, i) => (
                                                                <Star key={i} size={10} className="fill-yellow-400 text-yellow-400" />
                                                            ))}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <button className="w-full h-9 text-sm text-muted-foreground hover:text-primary flex items-center justify-center gap-2 rounded-lg hover:bg-muted/50 transition-colors" onClick={() => handleNewTask(day)}>
                                        <Plus size={16} /> Adicionar
                                    </button>
                                </div>
                            </CollapsibleContent>
                        </div>
                    </Collapsible>
                );
            })}
        </div>
    );

    return (
        <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Agenda de Estudos</h1>
                    <p className="text-muted-foreground">Foque no processo.</p>
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

            <DesktopCalendar />
            <MobileCalendar />

            {/* Task Form Modal */}
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent>
                    <TaskForm
                        initialData={editingTask}
                        defaultDate={formDefaultDate}
                        onClose={() => setIsFormOpen(false)}
                    />
                </DialogContent>
            </Dialog>

            {/* Feedback Modal */}
            <FeedbackModal
                isOpen={isFeedbackOpen}
                onClose={() => {
                    setIsFeedbackOpen(false);
                    setTaskForFeedback(null);
                }}
                onSubmit={handleFeedbackSubmit}
                taskTitle={taskForFeedback?.title || ""}
            />
        </div>
    );
}
