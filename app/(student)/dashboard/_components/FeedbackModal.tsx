
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (feedback: { rating: number; comment?: string }) => void;
    taskTitle: string;
}

export default function FeedbackModal({ isOpen, onClose, onSubmit, taskTitle }: FeedbackModalProps) {
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [comment, setComment] = useState("");

    const handleSubmit = () => {
        if (rating === 0) return;
        onSubmit({ rating, comment: comment.trim() || undefined });
        setRating(0);
        setComment("");
        onClose();
    };

    const handleSkip = () => {
        onSubmit({ rating: 3 }); // Default rating if skipped
        setRating(0);
        setComment("");
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>🎉 Sessão Concluída!</DialogTitle>
                    <DialogDescription className="text-base">
                        <span className="font-medium text-foreground">{taskTitle}</span>
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Star Rating */}
                    <div className="space-y-3">
                        <Label className="text-base">Como foi seu foco/rendimento?</Label>
                        <div className="flex items-center justify-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoveredRating(star)}
                                    onMouseLeave={() => setHoveredRating(0)}
                                    className="p-1 transition-transform hover:scale-110 focus:outline-none"
                                >
                                    <Star
                                        size={32}
                                        className={cn(
                                            "transition-colors",
                                            (hoveredRating || rating) >= star
                                                ? "fill-yellow-400 text-yellow-400"
                                                : "text-muted-foreground/40"
                                        )}
                                    />
                                </button>
                            ))}
                        </div>
                        <div className="text-center text-sm text-muted-foreground">
                            {rating === 1 && "Preciso melhorar"}
                            {rating === 2 && "Poderia ser melhor"}
                            {rating === 3 && "Foi ok"}
                            {rating === 4 && "Foi bom!"}
                            {rating === 5 && "Excelente! 🔥"}
                        </div>
                    </div>

                    {/* Comment */}
                    <div className="space-y-2">
                        <Label htmlFor="comment">Como foi o estudo? (opcional)</Label>
                        <Textarea
                            id="comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Anotações, dificuldades, conquistas..."
                            className="min-h-[80px] resize-none"
                        />
                    </div>
                </div>

                <DialogFooter className="flex-col sm:flex-row gap-2">
                    <Button variant="ghost" onClick={handleSkip} className="text-muted-foreground">
                        Pular
                    </Button>
                    <Button onClick={handleSubmit} disabled={rating === 0}>
                        Salvar Feedback
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
