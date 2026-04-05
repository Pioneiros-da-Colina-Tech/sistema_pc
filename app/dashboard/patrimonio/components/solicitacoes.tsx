"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Check, X, ArrowRight, CornerDownLeft, AlertCircle } from "lucide-react"
import { heritageApi, meetingsApi, unitsApi, type HeritageRequestAPI, type MeetingAPI, type RequestStatus, type UnitAPI } from "@/lib/api"

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    aprovado: "default",
    entregue: "default",
    devolvido: "outline",
    pendente: "secondary",
    reprovado: "destructive",
}

export default function SolicitacoesTab() {
    const [solicitacoes, setSolicitacoes] = useState<HeritageRequestAPI[]>([])
    const [reunioes, setReunioes] = useState<MeetingAPI[]>([])
    const [unidades, setUnidades] = useState<UnitAPI[]>([])
    const [carregando, setCarregando] = useState(true)
    const [reprovingId, setReprovingId] = useState<string | null>(null)
    const [reprovalReason, setReprovalReason] = useState("")

    useEffect(() => {
        Promise.all([
            heritageApi.listRequests(),
            meetingsApi.list(),
            unitsApi.list(),
        ]).then(([reqRes, meetingsRes, unitsRes]) => {
            setSolicitacoes(reqRes.data)
            setReunioes(meetingsRes.data)
            setUnidades(unitsRes.data)
        }).catch(console.error).finally(() => setCarregando(false))
    }, [])

    const handleStatusChange = async (id: string, status: RequestStatus, reason?: string) => {
        try {
            const res = await heritageApi.updateRequestStatus(id, status, reason)
            setSolicitacoes((prev) => prev.map((s) => s.id_ === id ? res.data : s))
        } catch (err) {
            console.error(err)
        }
        setReprovingId(null)
        setReprovalReason("")
    }

    const renderActions = (sol: HeritageRequestAPI) => {
        switch (sol.status) {
            case "pendente":
                return (
                    <>
                        <Button size="sm" variant="outline" onClick={() => handleStatusChange(sol.id_, "aprovado")}>
                            <Check className="h-4 w-4 mr-2" />Aprovar
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => setReprovingId(sol.id_)}>
                            <X className="h-4 w-4 mr-2" />Reprovar
                        </Button>
                    </>
                )
            case "aprovado":
                return (
                    <Button size="sm" onClick={() => handleStatusChange(sol.id_, "entregue")}>
                        <ArrowRight className="h-4 w-4 mr-2" />Marcar Entregue
                    </Button>
                )
            case "entregue":
                return (
                    <Button size="sm" variant="outline" onClick={() => handleStatusChange(sol.id_, "devolvido")}>
                        <CornerDownLeft className="h-4 w-4 mr-2" />Marcar Devolvido
                    </Button>
                )
            default:
                return null
        }
    }

    // Group by meeting
    const porReuniao = reunioes
        .map((r) => ({ reuniao: r, solicitacoes: solicitacoes.filter((s) => s.meeting_id === r.id_) }))
        .filter((g) => g.solicitacoes.length > 0)

    const semReuniao = solicitacoes.filter((s) => !reunioes.find((r) => r.id_ === s.meeting_id))

    if (carregando) return <p className="text-sm text-muted-foreground p-4">Carregando...</p>

    return (
        <Card>
            <CardHeader>
                <CardTitle>Solicitações de Materiais</CardTitle>
                <CardDescription>Aprove, gerencie a entrega e a devolução dos materiais solicitados.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {solicitacoes.length === 0 && (
                    <p className="text-sm text-muted-foreground">Nenhuma solicitação registrada.</p>
                )}

                {porReuniao.map(({ reuniao, solicitacoes: sols }) => (
                    <Card key={reuniao.id_} className="overflow-hidden">
                        <CardHeader className="bg-muted/50 py-3">
                            <CardTitle className="text-base">{reuniao.name}</CardTitle>
                            <CardDescription>{new Date(reuniao.date).toLocaleDateString("pt-BR", { timeZone: "UTC" })}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 space-y-4">
                            {sols.map((sol) => {
                                const unidade = unidades.find((u) => u.id_ === sol.unit_id)
                                return (
                                    <div key={sol.id_} className="border rounded-lg p-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-semibold mb-2">
                                                    Unidade: {unidade?.name ?? sol.unit_id}
                                                </h4>
                                                <ul className="list-disc pl-5 text-sm text-muted-foreground">
                                                    {sol.items.map((item) => (
                                                        <li key={item.id_}>{item.item_name ?? item.item_id} (Qtd: {item.quantity})</li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <Badge variant={statusVariant[sol.status] ?? "outline"}>{sol.status}</Badge>
                                        </div>

                                        {sol.status === "reprovado" && sol.rejection_reason && (
                                            <div className="mt-3 pt-3 border-t text-sm text-red-600 flex items-center gap-2">
                                                <AlertCircle className="h-4 w-4 shrink-0" />
                                                <span><span className="font-semibold">Motivo:</span> {sol.rejection_reason}</span>
                                            </div>
                                        )}

                                        {reprovingId !== sol.id_ && (
                                            <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                                                {renderActions(sol)}
                                            </div>
                                        )}

                                        {reprovingId === sol.id_ && (
                                            <div className="mt-4 pt-4 border-t space-y-2">
                                                <Label>Motivo da Reprovação</Label>
                                                <Input
                                                    value={reprovalReason}
                                                    onChange={(e) => setReprovalReason(e.target.value)}
                                                    placeholder="Descreva o motivo..."
                                                />
                                                <div className="flex justify-end gap-2">
                                                    <Button size="sm" variant="ghost" onClick={() => setReprovingId(null)}>Cancelar</Button>
                                                    <Button size="sm" variant="destructive" onClick={() => handleStatusChange(sol.id_, "reprovado", reprovalReason)}>
                                                        Confirmar Reprovação
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </CardContent>
                    </Card>
                ))}

                {semReuniao.map((sol) => (
                    <p key={sol.id_} className="text-xs text-muted-foreground">Solicitação sem reunião: {sol.id_}</p>
                ))}
            </CardContent>
        </Card>
    )
}
