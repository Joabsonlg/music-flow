
"use client";

import { useMock } from "@/contexts/MockContext";
import { useState } from "react";
import { Task } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, X, Star, MessageSquare, FileText, Link as LinkIcon, ExternalLink, Repeat, Trash2 } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';
import { addDays, isBefore, parseISO, getDay, format } from 'date-fns';
import { cn } from "@/lib/utils";

interface TaskFormProps {
    initialData?: Task;
    defaultDate?: Date;
    onClose: () => void;
    studentId?: string;
}

const WEEKDAYS = [
    { value: 0, label: 'Dom', short: 'D' },
    { value: 1, label: 'Seg', short: 'S' },
    { value: 2, label: 'Ter', short: 'T' },
    { value: 3, label: 'Qua', short: 'Q' },
    { value: 4, label: 'Qui', short: 'Q' },
    { value: 5, label: 'Sex', short: 'S' },
    { value: 6, label: 'Sáb', short: 'S' },
];

export default function TaskForm({ initialData, defaultDate, onClose, studentId }: TaskFormProps) {
    const { addTask, updateTask, deleteTask, currentUser } = useMock();
    const isCompleted = initialData?.status === 'DONE';

    const [formData, setFormData] = useState<Partial<Task>>({
        title: initialData?.title || '',
        durationMinutes: initialData?.durationMinutes || 30,
        objective: initialData?.objective || '',
        date: initialData?.date || defaultDate?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
        materials: initialData?.materials || [],
        status: initialData?.status || 'TODO',
    });

    const [newLink, setNewLink] = useState('');

    // Recurrence state
    const [isRecurring, setIsRecurring] = useState(false);
    const [selectedDays, setSelectedDays] = useState<number[]>([]);
    const [endDate, setEndDate] = useState('');

    const toggleDay = (day: number) => {
        setSelectedDays(prev =>
            prev.includes(day)
                ? prev.filter(d => d !== day)
                : [...prev, day]
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser || isCompleted) return;

        if (initialData) {
            updateTask(initialData.id, formData);
            onClose();
            return;
        }

        // If recurring, create multiple tasks
        if (isRecurring && selectedDays.length > 0 && endDate) {
            const startDateParsed = parseISO(formData.date!);
            const endDateParsed = parseISO(endDate);
            let currentDate = startDateParsed;

            while (isBefore(currentDate, addDays(endDateParsed, 1))) {
                const dayOfWeek = getDay(currentDate);

                if (selectedDays.includes(dayOfWeek)) {
                    addTask({
                        id: uuidv4(),
                        studentId: studentId || currentUser.id,
                        createdByUserId: currentUser.id,
                        title: formData.title!,
                        date: format(currentDate, 'yyyy-MM-dd'),
                        durationMinutes: formData.durationMinutes!,
                        objective: formData.objective!,
                        status: 'TODO',
                        materials: formData.materials!,
                    });
                }

                currentDate = addDays(currentDate, 1);
            }
        } else {
            // Single task
            addTask({
                id: uuidv4(),
                studentId: studentId || currentUser.id,
                createdByUserId: currentUser.id,
                title: formData.title!,
                date: formData.date!,
                durationMinutes: formData.durationMinutes!,
                objective: formData.objective!,
                status: 'TODO',
                materials: formData.materials!,
            });
        }

        onClose();
    };

    const addMaterial = () => {
        if (!newLink || isCompleted) return;
        setFormData(prev => ({
            ...prev,
            materials: [...(prev.materials || []), {
                id: uuidv4(),
                title: 'Link',
                type: 'LINK',
                url: newLink
            }]
        }));
        setNewLink('');
    };

    const handleDelete = () => {
        if (!initialData) return;
        if (confirm('Tem certeza que deseja excluir esta sessão?')) {
            deleteTask(initialData.id);
            onClose();
        }
    };

    return (
        <div className="grid gap-4 py-4 max-h-[80vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle>
                    {isCompleted ? '✅ Sessão Concluída' : initialData ? 'Editar Sessão' : 'Nova Sessão de Estudo'}
                </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="title">Título</Label>
                    <Input
                        id="title"
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                        required
                        placeholder="Ex: Escalas Maiores"
                        disabled={isCompleted}
                        className={isCompleted ? "bg-muted" : ""}
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="date">{isRecurring ? 'Data Inicial' : 'Data'}</Label>
                        <Input
                            id="date"
                            type="date"
                            value={formData.date?.split('T')[0]}
                            onChange={e => setFormData({ ...formData, date: e.target.value })}
                            required
                            disabled={isCompleted}
                            className={isCompleted ? "bg-muted" : ""}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="duration">Duração (min)</Label>
                        <Input
                            id="duration"
                            type="number"
                            value={formData.durationMinutes}
                            onChange={e => setFormData({ ...formData, durationMinutes: parseInt(e.target.value) })}
                            required
                            disabled={isCompleted}
                            className={isCompleted ? "bg-muted" : ""}
                        />
                    </div>
                </div>

                {/* Recurrence Section - Only for new tasks */}
                {!initialData && !isCompleted && (
                    <div className="space-y-3 p-3 rounded-lg border bg-muted/30">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="recurring"
                                checked={isRecurring}
                                onCheckedChange={(checked) => setIsRecurring(checked === true)}
                            />
                            <Label htmlFor="recurring" className="flex items-center gap-2 cursor-pointer">
                                <Repeat size={16} />
                                Repetir semanalmente
                            </Label>
                        </div>

                        {isRecurring && (
                            <div className="space-y-3 pt-2">
                                <div className="space-y-2">
                                    <Label className="text-sm">Dias da semana</Label>
                                    <div className="flex gap-1">
                                        {WEEKDAYS.map((day) => (
                                            <button
                                                key={day.value}
                                                type="button"
                                                onClick={() => toggleDay(day.value)}
                                                className={cn(
                                                    "w-9 h-9 rounded-full text-sm font-medium transition-colors",
                                                    selectedDays.includes(day.value)
                                                        ? "bg-primary text-primary-foreground"
                                                        : "bg-muted hover:bg-muted/80 text-muted-foreground"
                                                )}
                                                title={day.label}
                                            >
                                                {day.short}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="endDate">Repetir até</Label>
                                    <Input
                                        id="endDate"
                                        type="date"
                                        value={endDate}
                                        onChange={e => setEndDate(e.target.value)}
                                        min={formData.date}
                                        required={isRecurring}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <div className="grid gap-2">
                    <Label htmlFor="objective">Objetivo (O Porquê)</Label>
                    <Textarea
                        id="objective"
                        value={formData.objective}
                        onChange={e => setFormData({ ...formData, objective: e.target.value })}
                        placeholder="Por que você está praticando isso?"
                        required
                        disabled={isCompleted}
                        className={isCompleted ? "bg-muted resize-none" : ""}
                    />
                </div>

                {/* Materials Section - Editable */}
                {!isCompleted && (
                    <div className="grid gap-2">
                        <Label>Materiais</Label>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Cole a URL..."
                                value={newLink}
                                onChange={e => setNewLink(e.target.value)}
                            />
                            <Button type="button" variant="secondary" onClick={addMaterial}><Plus size={16} /></Button>
                        </div>
                        <div className="space-y-1 mt-2">
                            {formData.materials?.map((m, i) => (
                                <div key={i} className="flex items-center justify-between text-sm bg-muted p-2 rounded">
                                    <span className="truncate max-w-[200px]">{m.url}</span>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setFormData({
                                            ...formData,
                                            materials: formData.materials?.filter((_, idx) => idx !== i)
                                        })}
                                    >
                                        <X size={14} />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Materials Section - Read Only for Completed Tasks */}
                {isCompleted && initialData?.materials && initialData.materials.length > 0 && (
                    <div className="grid gap-2">
                        <Label className="flex items-center gap-2">
                            <FileText size={16} />
                            Materiais Utilizados
                        </Label>
                        <div className="space-y-2">
                            {initialData.materials.map((m, i) => (
                                <a
                                    key={i}
                                    href={m.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-sm group"
                                >
                                    {m.type === 'PDF' ? (
                                        <FileText size={16} className="text-muted-foreground shrink-0" />
                                    ) : (
                                        <LinkIcon size={16} className="text-muted-foreground shrink-0" />
                                    )}
                                    <span className="truncate flex-1">{m.title || m.url}</span>
                                    <ExternalLink size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                {/* Feedback Section - Only for completed tasks */}
                {isCompleted && initialData?.feedback && (
                    <div className="border-t pt-4 mt-2 space-y-3">
                        <Label className="text-base font-semibold flex items-center gap-2">
                            <MessageSquare size={16} />
                            Feedback da Sessão
                        </Label>

                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Avaliação:</span>
                            <div className="flex items-center gap-0.5">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                        key={i}
                                        size={18}
                                        className={i < initialData.feedback!.rating
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "text-muted-foreground/30"
                                        }
                                    />
                                ))}
                            </div>
                        </div>

                        {initialData.feedback.comment && (
                            <div className="bg-muted/50 rounded-lg p-3">
                                <p className="text-sm italic text-muted-foreground">
                                    "{initialData.feedback.comment}"
                                </p>
                            </div>
                        )}
                    </div>
                )}

                <DialogFooter className="flex-row justify-between sm:justify-between">
                    {initialData && (
                        <Button type="button" variant="ghost" onClick={handleDelete} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                            <Trash2 size={16} className="mr-2" />
                            Excluir
                        </Button>
                    )}
                    <div className="flex gap-2">
                        {isCompleted ? (
                            <Button type="button" variant="outline" onClick={onClose}>
                                Fechar
                            </Button>
                        ) : (
                            <Button type="submit">
                                {isRecurring && selectedDays.length > 0 ? 'Criar Sessões' : 'Salvar Sessão'}
                            </Button>
                        )}
                    </div>
                </DialogFooter>
            </form>
        </div>
    );
}
