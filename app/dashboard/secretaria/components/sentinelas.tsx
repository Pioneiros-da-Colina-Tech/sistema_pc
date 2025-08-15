"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

// Dados Mockados
const membrosMock = [
    { id: 1, nome: "João Silva" },
    { id: 2, nome: "Maria Santos" },
    { id: 3, nome: "Pedro Costa" },
    { id: 4, nome: "Ana Pereira" },
];
const classesMock = [ { id: 1, nome: "Amigo" }, { id: 2, nome: "Companheiro" }];
const especialidadesMock = [{ id: 1, nome: "Internet" }, { id: 2, nome: "Primeiros Socorros" }];

export default function SentinelasTab() {
    const [selectedEspecialidade, setSelectedEspecialidade] = useState<string | undefined>();
    const [selectedClasse, setSelectedClasse] = useState<string | undefined>();
    const [sentinelasEspecialidade, setSentinelasEspecialidade] = useState<number[]>([]);
    const [sentinelasClasse, setSentinelasClasse] = useState<number[]>([]);

    const handleAddSentinela = (type: 'classe' | 'especialidade', memberId: number) => {
        if (type === 'classe') {
            if (!sentinelasClasse.includes(memberId)) {
                setSentinelasClasse(prev => [...prev, memberId]);
            }
        } else {
            if (!sentinelasEspecialidade.includes(memberId)) {
                setSentinelasEspecialidade(prev => [...prev, memberId]);
            }
        }
    };

    const handleRemoveSentinela = (type: 'classe' | 'especialidade', memberId: number) => {
        if (type === 'classe') {
            setSentinelasClasse(prev => prev.filter(id => id !== memberId));
        } else {
            setSentinelasEspecialidade(prev => prev.filter(id => id !== memberId));
        }
    };

    // Filtra membros que ainda não foram adicionados
    const membrosDisponiveisClasse = membrosMock.filter(m => !sentinelasClasse.includes(m.id));
    const membrosDisponiveisEspecialidade = membrosMock.filter(m => !sentinelasEspecialidade.includes(m.id));

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
                <CardHeader><CardTitle>Sentinelas de Especialidade</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Especialidade</Label>
                        <Select onValueChange={setSelectedEspecialidade}>
                            <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                            <SelectContent>{especialidadesMock.map(esp => <SelectItem key={esp.id} value={esp.id.toString()}>{esp.nome}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                    {selectedEspecialidade && (
                        <div className="space-y-2">
                            <Label>Adicionar Membro</Label>
                            <Select onValueChange={(value) => handleAddSentinela('especialidade', parseInt(value))}>
                                <SelectTrigger><SelectValue placeholder="Selecione um membro..." /></SelectTrigger>
                                <SelectContent>
                                    {membrosDisponiveisEspecialidade.map(membro => (
                                        <SelectItem key={membro.id} value={membro.id.toString()}>{membro.nome}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <div className="pt-2">
                                <Label>Sentinelas Atuais:</Label>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {sentinelasEspecialidade.map(id => {
                                        const membro = membrosMock.find(m => m.id === id);
                                        return (
                                            <Badge key={id} variant="secondary">
                                                {membro?.nome}
                                                <button onClick={() => handleRemoveSentinela('especialidade', id)} className="ml-2 rounded-full hover:bg-muted-foreground/20">
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </Badge>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                    <Button disabled={!selectedEspecialidade}>Salvar</Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Sentinelas de Classe</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Classe</Label>
                        <Select onValueChange={setSelectedClasse}>
                            <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                            <SelectContent>{classesMock.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.nome}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                    {selectedClasse && (
                        <div className="space-y-2">
                            <Label>Adicionar Membro</Label>
                            <Select onValueChange={(value) => handleAddSentinela('classe', parseInt(value))}>
                                <SelectTrigger><SelectValue placeholder="Selecione um membro..." /></SelectTrigger>
                                <SelectContent>
                                    {membrosDisponiveisClasse.map(membro => (
                                        <SelectItem key={membro.id} value={membro.id.toString()}>{membro.nome}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <div className="pt-2">
                                <Label>Sentinelas Atuais:</Label>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {sentinelasClasse.map(id => {
                                        const membro = membrosMock.find(m => m.id === id);
                                        return (
                                            <Badge key={id} variant="secondary">
                                                {membro?.nome}
                                                <button onClick={() => handleRemoveSentinela('classe', id)} className="ml-2 rounded-full hover:bg-muted-foreground/20">
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </Badge>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                    <Button disabled={!selectedClasse}>Salvar</Button>
                </CardContent>
            </Card>
        </div>
    );
}