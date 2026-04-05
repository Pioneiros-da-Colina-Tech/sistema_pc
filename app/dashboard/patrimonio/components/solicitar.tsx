"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { AlertCircle } from "lucide-react"
import { heritageApi, meetingsApi, unitsApi, type HeritageItemAPI, type HeritageRequestAPI, type MeetingAPI, type UnitAPI } from "@/lib/api"

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    aprovado: "default",
    entregue: "default",
    devolvido: "outline",
    pendente: "secondary",
    reprovado: "destructive",
}

export default function SolicitarMateriaisTab() {
    const [itens, setItens] = useState<HeritageItemAPI[]>([])
    const [reunioes, setReunioes] = useState<MeetingAPI[]>([])
    const [unidades, setUnidades] = useState<UnitAPI[]>([])
    const [minhasSolicitacoes, setMinhasSolicitacoes] = useState<HeritageRequestAPI[]>([])
    const [carregando, setCarregando] = useState(true)

    const [reuniaoId, setReuniaoId] = useState("")
    const [unidadeId, setUnidadeId] = useState("")
    const [quantidades, setQuantidades] = useState<Record<string, number>>({})
    const [enviando, setEnviando] = useState(false)
    const [erro, setErro] = useState("")
    const [sucesso, setSucesso] = useState("")

    useEffect(() => {
        Promise.all([
            heritageApi.listItems({ page_size: 100 }),
            meetingsApi.list(),
            unitsApi.list(),
            heritageApi.listRequests(),
        ]).then(([itemsRes, meetingsRes, unitsRes, reqRes]) => {
            setItens(itemsRes.data.items)
            setReunioes(meetingsRes.data)
            setUnidades(unitsRes.data)
            setMinhasSolicitacoes(reqRes.data)
        }).catch(console.error).finally(() => setCarregando(false))
    }, [])

    const handleEnviar = async () => {
        const itensSolicitados = Object.entries(quantidades)
            .filter(([, qty]) => qty > 0)
            .map(([item_id, quantity]) => ({ item_id, quantity }))

        if (!reuniaoId || !unidadeId || itensSolicitados.length === 0) {
            setErro("Selecione reunião, unidade e ao menos um item com quantidade.")
            return
        }
        setErro("")
        setSucesso("")
        setEnviando(true)
        try {
            const res = await heritageApi.createRequest({
                meeting_id: reuniaoId,
                unit_id: unidadeId,
                items: itensSolicitados,
            })
            setMinhasSolicitacoes((prev) => [res.data, ...prev])
            setQuantidades({})
            setReuniaoId("")
            setUnidadeId("")
            setSucesso("Solicitação enviada com sucesso!")
        } catch (err) {
            setErro(err instanceof Error ? err.message : "Erro ao enviar solicitação.")
        } finally {
            setEnviando(false)
        }
    }

    if (carregando) return <p className="text-sm text-muted-foreground p-4">Carregando...</p>

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Solicitar Material do Patrimônio</CardTitle>
                    <CardDescription>Selecione a reunião, unidade e informe a quantidade necessária de cada item.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Reunião</Label>
                            <Select value={reuniaoId} onValueChange={setReuniaoId}>
                                <SelectTrigger><SelectValue placeholder="Selecione uma reunião..." /></SelectTrigger>
                                <SelectContent>
                                    {reunioes.map((r) => (
                                        <SelectItem key={r.id_} value={r.id_}>
                                            {r.name} — {new Date(r.date).toLocaleDateString("pt-BR", { timeZone: "UTC" })}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Unidade</Label>
                            <Select value={unidadeId} onValueChange={setUnidadeId}>
                                <SelectTrigger><SelectValue placeholder="Selecione a unidade..." /></SelectTrigger>
                                <SelectContent>
                                    {unidades.map((u) => (
                                        <SelectItem key={u.id_} value={u.id_}>{u.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {reuniaoId && unidadeId && (
                        <div className="pt-4 border-t space-y-3">
                            {itens.length === 0 ? (
                                <p className="text-sm text-muted-foreground">Nenhum item no patrimônio.</p>
                            ) : (
                                itens.map((item) => (
                                    <div key={item.id_} className="grid grid-cols-12 gap-4 items-center p-3 border rounded-md">
                                        <div className="col-span-7">
                                            <p className="font-medium">{item.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                Estoque total: {item.quantity} unidades
                                                {item.description && ` · ${item.description}`}
                                            </p>
                                        </div>
                                        <div className="col-span-3">
                                            <Input
                                                type="number"
                                                placeholder="Qtd."
                                                min="0"
                                                max={item.quantity}
                                                value={quantidades[item.id_] ?? ""}
                                                onChange={(e) => setQuantidades((prev) => ({
                                                    ...prev,
                                                    [item.id_]: parseInt(e.target.value) || 0,
                                                }))}
                                            />
                                        </div>
                                    </div>
                                ))
                            )}
                            {erro && <p className="text-sm text-red-600">{erro}</p>}
                            {sucesso && <p className="text-sm text-green-600">{sucesso}</p>}
                            <Button onClick={handleEnviar} disabled={enviando}>
                                {enviando ? "Enviando..." : "Enviar Solicitação"}
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Solicitações Enviadas</CardTitle>
                    <CardDescription>Acompanhe o status das suas solicitações.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {minhasSolicitacoes.length === 0 ? (
                        <p className="text-sm text-muted-foreground">Nenhuma solicitação enviada.</p>
                    ) : (
                        minhasSolicitacoes.map((sol) => {
                            const reuniao = reunioes.find((r) => r.id_ === sol.meeting_id)
                            const unidade = unidades.find((u) => u.id_ === sol.unit_id)
                            return (
                                <div key={sol.id_} className="border rounded-lg p-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-semibold mb-1">
                                                {reuniao?.name ?? sol.meeting_id}
                                                {unidade && <span className="text-muted-foreground font-normal"> · {unidade.name}</span>}
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
                                </div>
                            )
                        })
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
