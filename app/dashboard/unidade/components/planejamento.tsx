"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { BookOpen, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

const reunioesMock = [
    { id: 1, nome: "Reunião Geral", data: "2025-01-25" },
    { id: 2, nome: "Treinamento", data: "2025-01-28" },
    { id: 3, nome: "Acampamento de Unidade", data: "2025-03-15" },
    { id: 4, nome: "Reunião de Pais", data: "2025-03-22" },
]

const requisitosClassesMock = [
    { id: 101, secao: "Geral", texto: "Ser membro ativo do Clube.", codigo_classe: "AM-001" },
    { id: 102, secao: "Descoberta Espiritual", texto: "Memorizar Voto e Lei.", codigo_classe: "AM-001" },
    { id: 201, secao: "Geral", texto: "Requisito avançado de Amigo.", codigo_classe: "AM-A-001" },
    { id: 301, secao: "Geral", texto: "Ser membro ativo do Clube.", codigo_classe: "CP-002" },
]

export default function PlanejamentoTab() {
    const [planejamentos, setPlanejamentos] = useState<{ id: number, reuniaoId: number, requisitoId: number }[]>([])
    const [planejamentoReuniao, setPlanejamentoReuniao] = useState<string | undefined>()
    const [planejamentoRequisito, setPlanejamentoRequisito] = useState<string | undefined>()
    const [currentDate, setCurrentDate] = useState(new Date(2025, 0, 1)); // Começa em Janeiro de 2025

    const handleSavePlanejamento = () => {
        if (!planejamentoReuniao || !planejamentoRequisito) {
            alert("Por favor, selecione a reunião e o requisito.");
            return;
        }
        const novoPlanejamento = {
            id: Date.now(),
            reuniaoId: parseInt(planejamentoReuniao),
            requisitoId: parseInt(planejamentoRequisito)
        };
        setPlanejamentos([...planejamentos, novoPlanejamento]);
        alert("Planejamento salvo com sucesso!");
    };

    const handleRemovePlanejamento = (id: number) => {
        setPlanejamentos(planejamentos.filter(p => p.id !== id));
    };

    // Lógica do Calendário
    const diasDaSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    const primeiroDiaDoMes = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const diasNoMes = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

    const changeMonth = (offset: number) => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Calendário de Planejamento</CardTitle>
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">{currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}</h3>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="icon" onClick={() => changeMonth(-1)}><ChevronLeft className="h-4 w-4"/></Button>
                            <Button variant="outline" size="icon" onClick={() => changeMonth(1)}><ChevronRight className="h-4 w-4"/></Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-7 gap-2 text-center">
                        {diasDaSemana.map(dia => <div key={dia} className="font-bold text-sm">{dia}</div>)}
                        {Array.from({ length: primeiroDiaDoMes }).map((_, i) => <div key={`empty-${i}`} />)}
                        {Array.from({ length: diasNoMes }).map((_, dia) => {
                            const diaAtual = dia + 1;
                            const dataCompleta = new Date(currentDate.getFullYear(), currentDate.getMonth(), diaAtual);
                            const dataString = dataCompleta.toISOString().split('T')[0];

                            const reunioesDoDia = reunioesMock.filter(r => r.data === dataString);
                            const temReuniao = reunioesDoDia.length > 0;
                            const temReuniaoPlanejada = temReuniao && reunioesDoDia.some(r => planejamentos.some(p => p.reuniaoId === r.id));

                            return (
                                <div key={diaAtual} className={cn("p-2 rounded-md h-20 flex flex-col items-start text-sm border", {
                                    "bg-blue-100 border-blue-200": temReuniao && !temReuniaoPlanejada,
                                    "bg-green-100 border-green-200": temReuniaoPlanejada,
                                })}>
                                    <span className="font-semibold">{diaAtual}</span>
                                    {reunioesDoDia.map(r => <span key={r.id} className="text-xs truncate">{r.nome}</span>)}
                                </div>
                            )
                        })}
                    </div>
                    <div className="flex items-center gap-4 mt-4 text-sm">
                        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-blue-100 rounded"/> Reunião sem requisito</div>
                        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-green-100 rounded"/> Reunião com requisito</div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2"><BookOpen/> Planejar Reunião</CardTitle><CardDescription>Vincule um requisito a uma reunião.</CardDescription></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2"><Label>Reunião</Label><Select onValueChange={setPlanejamentoReuniao}><SelectTrigger><SelectValue placeholder="Selecione a reunião" /></SelectTrigger><SelectContent>{reunioesMock.map((reuniao) => (<SelectItem key={reuniao.id} value={reuniao.id.toString()}>{reuniao.nome} ({new Date(reuniao.data).toLocaleDateString('pt-BR', {timeZone: 'UTC'})})</SelectItem>))}</SelectContent></Select></div>
                        <div className="space-y-2"><Label>Requisito de Classe</Label><Select onValueChange={setPlanejamentoRequisito}><SelectTrigger><SelectValue placeholder="Selecione o requisito" /></SelectTrigger><SelectContent>{requisitosClassesMock.map((req) => (<SelectItem key={req.id} value={req.id.toString()}>{req.texto}</SelectItem>))}</SelectContent></Select></div>
                        <Button onClick={handleSavePlanejamento}>Salvar Planejamento</Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>Planejamentos Salvos</CardTitle></CardHeader>
                    <CardContent className="space-y-2 max-h-72 overflow-y-auto">
                        {planejamentos.length === 0 ? (<p className="text-sm text-muted-foreground">Nenhum planejamento salvo.</p>) :
                            (planejamentos.map(p => {
                                const reuniao = reunioesMock.find(r => r.id === p.reuniaoId);
                                const requisito = requisitosClassesMock.find(r => r.id === p.requisitoId);
                                return (
                                    <div key={p.id} className="flex items-center justify-between p-3 border rounded-md">
                                        <div>
                                            <p className="font-semibold">{reuniao?.nome} - {new Date(reuniao!.data).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</p>
                                            <p className="text-sm text-muted-foreground">{requisito?.texto}</p>
                                        </div>
                                        <Button variant="ghost" size="sm" onClick={() => handleRemovePlanejamento(p.id)}><Trash2 className="h-4 w-4"/></Button>
                                    </div>
                                )
                            }))}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}