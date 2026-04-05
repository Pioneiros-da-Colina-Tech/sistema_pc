"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { MeetingAPI } from "@/lib/api"

const requisitosClassesMock = [
    { id: 101, secao: "Geral", texto: "Ser membro ativo do Clube." },
    { id: 102, secao: "Descoberta Espiritual", texto: "Memorizar Voto e Lei." },
    { id: 103, secao: "Saúde", texto: "Demonstrar hábitos de saúde física." },
    { id: 201, secao: "Avançado", texto: "Requisito avançado de Amigo." },
    { id: 202, secao: "Avançado", texto: "Completar projeto de serviço." },
]

interface Planejamento {
    id: string
    reuniaoId: string
    requisitoId: number
}

export default function PlanejamentoTab({ reunioes }: { reunioes: MeetingAPI[] }) {
    const [planejamentos, setPlanejamentos] = useState<Planejamento[]>([])
    const [planejamentoReuniao, setPlanejamentoReuniao] = useState<string>("")
    const [planejamentoRequisito, setPlanejamentoRequisito] = useState<string>("")
    const [currentDate, setCurrentDate] = useState(() => new Date())

    const handleSavePlanejamento = () => {
        if (!planejamentoReuniao || !planejamentoRequisito) return
        setPlanejamentos((prev) => [
            ...prev,
            { id: crypto.randomUUID(), reuniaoId: planejamentoReuniao, requisitoId: parseInt(planejamentoRequisito) },
        ])
        setPlanejamentoReuniao("")
        setPlanejamentoRequisito("")
    }

    const handleRemovePlanejamento = (id: string) => {
        setPlanejamentos((prev) => prev.filter((p) => p.id !== id))
    }

    const diasDaSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
    const primeiroDiaDoMes = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()
    const diasNoMes = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()

    const changeMonth = (offset: number) => {
        setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + offset, 1))
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Calendário de Planejamento</CardTitle>
                        <div className="flex items-center gap-2">
                            <span className="text-base font-semibold capitalize">
                                {currentDate.toLocaleString("pt-BR", { month: "long", year: "numeric" })}
                            </span>
                            <Button variant="outline" size="icon" onClick={() => changeMonth(-1)}><ChevronLeft className="h-4 w-4" /></Button>
                            <Button variant="outline" size="icon" onClick={() => changeMonth(1)}><ChevronRight className="h-4 w-4" /></Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-7 gap-1 text-center mb-2">
                        {diasDaSemana.map((dia) => (
                            <div key={dia} className="font-bold text-xs text-muted-foreground py-1">{dia}</div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                        {Array.from({ length: primeiroDiaDoMes }).map((_, i) => (
                            <div key={`empty-${i}`} />
                        ))}
                        {Array.from({ length: diasNoMes }).map((_, i) => {
                            const diaAtual = i + 1
                            const dataString = new Date(currentDate.getFullYear(), currentDate.getMonth(), diaAtual)
                                .toISOString().split("T")[0]
                            const reunioesDoDia = reunioes.filter((r) => r.date === dataString)
                            const temReuniao = reunioesDoDia.length > 0
                            const temPlanejamento = temReuniao && reunioesDoDia.some((r) =>
                                planejamentos.some((p) => p.reuniaoId === r.id_)
                            )
                            return (
                                <div
                                    key={diaAtual}
                                    className={cn(
                                        "p-1 rounded-md min-h-14 flex flex-col items-start text-xs border",
                                        temPlanejamento ? "bg-green-100 border-green-300" :
                                        temReuniao ? "bg-blue-100 border-blue-300" :
                                        "border-transparent"
                                    )}
                                >
                                    <span className="font-semibold text-sm">{diaAtual}</span>
                                    {reunioesDoDia.map((r) => (
                                        <span key={r.id_} className="truncate w-full text-muted-foreground">{r.name}</span>
                                    ))}
                                </div>
                            )
                        })}
                    </div>
                    <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded" /> Reunião</div>
                        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-green-100 border border-green-300 rounded" /> Com requisito</div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><BookOpen className="h-4 w-4" /> Planejar Reunião</CardTitle>
                        <CardDescription>Vincule um requisito a uma reunião.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Reunião</Label>
                            <Select value={planejamentoReuniao} onValueChange={setPlanejamentoReuniao}>
                                <SelectTrigger><SelectValue placeholder="Selecione a reunião" /></SelectTrigger>
                                <SelectContent>
                                    {reunioes.length === 0
                                        ? <SelectItem value="none" disabled>Nenhuma reunião cadastrada</SelectItem>
                                        : reunioes.map((r) => (
                                            <SelectItem key={r.id_} value={r.id_}>
                                                {r.name} — {new Date(r.date).toLocaleDateString("pt-BR", { timeZone: "UTC" })}
                                            </SelectItem>
                                        ))
                                    }
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Requisito de Classe</Label>
                            <Select value={planejamentoRequisito} onValueChange={setPlanejamentoRequisito}>
                                <SelectTrigger><SelectValue placeholder="Selecione o requisito" /></SelectTrigger>
                                <SelectContent>
                                    {requisitosClassesMock.map((req) => (
                                        <SelectItem key={req.id} value={req.id.toString()}>{req.texto}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button onClick={handleSavePlanejamento} disabled={!planejamentoReuniao || !planejamentoRequisito}>
                            Salvar Planejamento
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle>Planejamentos Salvos</CardTitle></CardHeader>
                    <CardContent className="space-y-2 max-h-72 overflow-y-auto">
                        {planejamentos.length === 0 ? (
                            <p className="text-sm text-muted-foreground">Nenhum planejamento salvo.</p>
                        ) : (
                            planejamentos.map((p) => {
                                const reuniao = reunioes.find((r) => r.id_ === p.reuniaoId)
                                const requisito = requisitosClassesMock.find((r) => r.id === p.requisitoId)
                                return (
                                    <div key={p.id} className="flex items-center justify-between p-3 border rounded-md gap-2">
                                        <div className="flex-1">
                                            <p className="font-semibold text-sm">
                                                {reuniao?.name} — {reuniao && new Date(reuniao.date).toLocaleDateString("pt-BR", { timeZone: "UTC" })}
                                            </p>
                                            <p className="text-sm text-muted-foreground">{requisito?.texto}</p>
                                            {requisito && <Badge variant="outline" className="text-xs mt-1">{requisito.secao}</Badge>}
                                        </div>
                                        <Button variant="ghost" size="sm" onClick={() => handleRemovePlanejamento(p.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )
                            })
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
