"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

const membrosMock = [
    { id: 1, nome: "João Silva" },
    { id: 2, nome: "Maria Santos" },
];
const classesMock = [ { id: 1, nome: "Amigo" }, { id: 2, nome: "Companheiro" }];
const especialidadesMock = [{ id: 1, nome: "Internet" }, { id: 2, nome: "Primeiros Socorros" }];

export default function SentinelasTab() {
    const [selectedEspecialidade, setSelectedEspecialidade] = useState<string | undefined>();
    const [selectedClasse, setSelectedClasse] = useState<string | undefined>();
    const [sentinelasEspecialidade, setSentinelasEspecialidade] = useState<number[]>([]);
    const [sentinelasClasse, setSentinelasClasse] = useState<number[]>([]);

    const handleEspecialidadeCheck = (memberId: number) => {setSentinelasEspecialidade(prev => prev.includes(memberId) ? prev.filter(id => id !== memberId) : [...prev, memberId]);};
    const handleClasseCheck = (memberId: number) => {setSentinelasClasse(prev => prev.includes(memberId) ? prev.filter(id => id !== memberId) : [...prev, memberId]);};

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card><CardHeader><CardTitle>Sentinelas de Especialidade</CardTitle></CardHeader><CardContent className="space-y-4"><div className="space-y-2"><Label>Especialidade</Label><Select onValueChange={setSelectedEspecialidade}><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger><SelectContent>{especialidadesMock.map(esp => <SelectItem key={esp.id} value={esp.id.toString()}>{esp.nome}</SelectItem>)}</SelectContent></Select></div>{selectedEspecialidade && (<div className="space-y-2"><Label>Membros</Label><div className="p-3 border rounded-md max-h-48 overflow-y-auto">{membrosMock.map(membro => (<div key={membro.id} className="flex items-center space-x-2 my-1"><Checkbox id={`esp-${membro.id}`} checked={sentinelasEspecialidade.includes(membro.id)} onCheckedChange={() => handleEspecialidadeCheck(membro.id)}/><Label htmlFor={`esp-${membro.id}`}>{membro.nome}</Label></div>))}</div></div>)}<Button disabled={!selectedEspecialidade}>Salvar</Button></CardContent></Card>
            <Card><CardHeader><CardTitle>Sentinelas de Classe</CardTitle></CardHeader><CardContent className="space-y-4"><div className="space-y-2"><Label>Classe</Label><Select onValueChange={setSelectedClasse}><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger><SelectContent>{classesMock.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.nome}</SelectItem>)}</SelectContent></Select></div>{selectedClasse && (<div className="space-y-2"><Label>Membros</Label><div className="p-3 border rounded-md max-h-48 overflow-y-auto">{membrosMock.map(membro => (<div key={membro.id} className="flex items-center space-x-2 my-1"><Checkbox id={`cls-${membro.id}`} checked={sentinelasClasse.includes(membro.id)} onCheckedChange={() => handleClasseCheck(membro.id)}/><Label htmlFor={`cls-${membro.id}`}>{membro.nome}</Label></div>))}</div></div>)}<Button disabled={!selectedClasse}>Salvar</Button></CardContent></Card>
        </div>
    );
}