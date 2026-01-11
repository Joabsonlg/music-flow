
"use client";

import { useMock } from "@/contexts/MockContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, FileText, Link as LinkIcon, ExternalLink, Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";

export default function LibraryPage() {
    const { files, addFile, currentUser } = useMock();
    const [isOpen, setIsOpen] = useState(false);
    const [newFile, setNewFile] = useState({ title: '', url: '', type: 'PDF' as 'PDF' | 'LINK' });
    const [searchQuery, setSearchQuery] = useState("");

    if (!currentUser) return null;

    // Filter files based on search query
    const filteredFiles = useMemo(() => {
        if (!searchQuery.trim()) return files;
        const query = searchQuery.toLowerCase();
        return files.filter(file =>
            file.title.toLowerCase().includes(query) ||
            file.type.toLowerCase().includes(query)
        );
    }, [files, searchQuery]);

    const handleAdd = () => {
        if (!newFile.title || !newFile.url) return;
        addFile({
            id: uuidv4(),
            title: newFile.title,
            url: newFile.url,
            type: newFile.type,
            uploadedBy: currentUser.id
        });
        setNewFile({ title: '', url: '', type: 'PDF' });
        setIsOpen(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Biblioteca</h1>
                    <p className="text-muted-foreground">Sua coleção de partituras e recursos.</p>
                </div>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button><Plus className="mr-2 h-4 w-4" /> Adicionar Material</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Adicionar Novo Material</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label>Título</Label>
                                <Input value={newFile.title} onChange={e => setNewFile({ ...newFile, title: e.target.value })} placeholder="Ex: Exercícios Hanon" />
                            </div>
                            <div className="grid gap-2">
                                <Label>Tipo</Label>
                                <Select value={newFile.type} onValueChange={(v: 'PDF' | 'LINK') => setNewFile({ ...newFile, type: v })}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="PDF">PDF</SelectItem>
                                        <SelectItem value="LINK">Link (Vídeo/Áudio)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label>URL</Label>
                                <Input value={newFile.url} onChange={e => setNewFile({ ...newFile, url: e.target.value })} placeholder="https://..." />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleAdd}>Adicionar à Biblioteca</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Buscar materiais..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* Results Count */}
            {searchQuery && (
                <p className="text-sm text-muted-foreground">
                    {filteredFiles.length} {filteredFiles.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
                </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredFiles.map(file => (
                    <Card key={file.id} className="group relative hover:shadow-md transition-shadow">
                        <CardContent className="p-4 flex flex-col items-center text-center gap-3">
                            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                                {file.type === 'PDF' ? <FileText size={24} /> : <LinkIcon size={24} />}
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-medium leading-none truncate w-full max-w-[200px]" title={file.title}>{file.title}</h3>
                                <p className="text-xs text-muted-foreground">{file.type}</p>
                            </div>
                            <Button variant="outline" size="sm" className="w-full mt-2" asChild>
                                <a href={file.url} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="mr-2 h-3 w-3" /> Abrir
                                </a>
                            </Button>
                        </CardContent>
                    </Card>
                ))}

                {filteredFiles.length === 0 && (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                        {searchQuery ? "Nenhum material encontrado." : "Nenhum material na biblioteca ainda."}
                    </div>
                )}
            </div>
        </div>
    );
}
