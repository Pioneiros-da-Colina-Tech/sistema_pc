"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { MinusCircle, PlusCircle } from "lucide-react"
import { unitsApi, scoresApi, type UnitAPI, type UnitMemberAPI } from "@/lib/api"
import type { Reuniao } from "../page"

interface ChamadaTabProps {
    reunioes: Reuniao[]
}

interface Pontuacao {
    presenca: number       // 10 = presente, 5 = justificado, 0 = ausente
    pontualidade: number
    uniforme: number
    modestia: number
}

type ChamadaMap = Record<string, Pontuacao>

const SCORE_STEP = 5
const clamp = (v: number) => Math.min(10, Math.max(0, v))

export default function ChamadaTab({ reunioes }: ChamadaTabProps) {
    const [unidades, setUnidades] = useState<UnitAPI[]>([])
    const [membros, setMembros] = useState<UnitMemberAPI[]>([])
    const [unidadeSelecionada, setUnidadeSelecionada] = useState<string | null>(null)
    const [reuniaoSelecionada, setReuniaoSelecionada] = useState<string | null>(null)
    const [chamada, setChamada] = useState<ChamadaMap>({})
    const [salvando, setSalvando] = useState(false)
    const [erro, setErro] = useState("")
    const [sucesso, setSucesso] = useState("")

    useEffect(() => {
        unitsApi.list().then((res) => setUnidades(res.data)).catch(console.error)
    }, [])

    useEffect(() => {
        if (!unidadeSelecionada) return
        setMembros([])
        setChamada({})
        unitsApi
            .getMembers(unidadeSelecionada)
            .then((res) => setMembros(res.data))
            .catch(console.error)
    }, [unidadeSelecionada])

    const handlePresente = (userId: string, isPresent: boolean) => {
        setChamada((prev) => {
            const next = { ...prev }
            if (isPresent) {
                next[userId] = { presenca: 10, pontualidade: 10, uniforme: 10, modestia: 10 }
            } else {
                delete next[userId]
            }
            return next
        })
    }

    const handleJustificado = (userId: string, isJustified: boolean) => {
        setChamada((prev) => {
            const next = { ...prev }
            if (isJustified) {
                next[userId] = { presenca: 5, pontualidade: 10, uniforme: 10, modestia: 10 }
            } else {
                delete next[userId]
            }
            return next
        })
    }

    const adjustScore = (
        userId: string,
        field: "pontualidade" | "uniforme" | "modestia",
        delta: number
    ) => {
        setChamada((prev) => {
            if (!prev[userId]) return prev
            return {
                ...prev,
                [userId]: { ...prev[userId], [field]: clamp(prev[userId][field] + delta) },
            }
        })
    }

    const salvarChamada = async () => {
        if (!reuniaoSelecionada || membros.length === 0) return
        setErro("")
        setSucesso("")
        setSalvando(true)
        try {
            const scores = membros.map((m) => {
                const p = chamada[m.user_id]
                return {
                    user_id: m.user_id,
                    presenca: p ? p.presenca : 0,
                    pontualidade: p ? p.pontualidade : 0,
                    uniforme: p ? p.uniforme : 0,
                    modestia: p ? p.modestia : 0,
                }
            })
            await scoresApi.submitMeetingScores(reuniaoSelecionada, scores)
            setSucesso("Chamada salva com sucesso!")
        } catch (err) {
            setErro(err instanceof Error ? err.message : "Erro ao salvar chamada.")
        } finally {
            setSalvando(false)
        }
    }

    const statusOf = (userId: string): "presente" | "justificado" | "ausente" => {
        const p = chamada[userId]
        if (!p) return "ausente"
        return p.presenca >= 10 ? "presente" : "justificado"
    }

    const badgeVariant: Record<string, "default" | "secondary" | "destructive"> = {
        presente: "default",
        justificado: "secondary",
        ausente: "destructive",
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Chamada</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label>Unidade</Label>
                        <Select onValueChange={setUnidadeSelecionada}>
                            <SelectTrigger><SelectValue placeholder="Selecione a unidade" /></SelectTrigger>
                            <SelectContent>
                                {unidades.map((u) => (
                                    <SelectItem key={u.id_} value={u.id_}>{u.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Reunião</Label>
                        <Select onValueChange={setReuniaoSelecionada}>
                            <SelectTrigger><SelectValue placeholder="Selecione a reunião" /></SelectTrigger>
                            <SelectContent>
                                {reunioes.map((r) => (
                                    <SelectItem key={r.id} value={r.id}>{r.nome} — {r.data}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {unidadeSelecionada && reuniaoSelecionada && (
                    <div className="space-y-4">
                        <h3 className="font-semibold">Lista de Presença</h3>

                        {membros.length === 0 ? (
                            <p className="text-sm text-muted-foreground">Nenhum membro nesta unidade.</p>
                        ) : (
                            <div className="space-y-3">
                                {membros.map((membro) => {
                                    const status = statusOf(membro.user_id)
                                    const p = chamada[membro.user_id]
                                    const isPresente = status === "presente"
                                    const isJustificado = status === "justificado"

                                    return (
                                        <Card key={membro.user_id} className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium">{membro.user_name ?? membro.user_document}</p>
                                                    <p className="text-sm text-muted-foreground capitalize">{membro.role}</p>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <Badge variant={badgeVariant[status]}>
                                                        {status === "presente" ? "Presente" : status === "justificado" ? "Justificado" : "Ausente"}
                                                    </Badge>
                                                    <div className="flex items-center gap-2">
                                                        <Checkbox
                                                            id={`presente-${membro.user_id}`}
                                                            checked={isPresente}
                                                            onCheckedChange={(v) => handlePresente(membro.user_id, !!v)}
                                                        />
                                                        <Label htmlFor={`presente-${membro.user_id}`}>Presente</Label>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Checkbox
                                                            id={`justi-${membro.user_id}`}
                                                            checked={isJustificado}
                                                            onCheckedChange={(v) => handleJustificado(membro.user_id, !!v)}
                                                        />
                                                        <Label htmlFor={`justi-${membro.user_id}`}>Justificado</Label>
                                                    </div>
                                                </div>
                                            </div>

                                            {p && p.presenca > 0 && (
                                                <div className="flex flex-wrap gap-6 pt-4 mt-4 border-t">
                                                    {(["pontualidade", "uniforme", "modestia"] as const).map((field) => (
                                                        <div key={field} className="flex items-center gap-2">
                                                            <Label className="capitalize">{field}:</Label>
                                                            <Button
                                                                size="icon" variant="ghost" className="h-6 w-6"
                                                                onClick={() => adjustScore(membro.user_id, field, SCORE_STEP)}
                                                            >
                                                                <PlusCircle className="h-4 w-4" />
                                                            </Button>
                                                            <Badge>{p[field]}</Badge>
                                                            <Button
                                                                size="icon" variant="ghost" className="h-6 w-6"
                                                                onClick={() => adjustScore(membro.user_id, field, -SCORE_STEP)}
                                                            >
                                                                <MinusCircle className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </Card>
                                    )
                                })}
                            </div>
                        )}

                        {erro && <p className="text-sm text-red-600">{erro}</p>}
                        {sucesso && <p className="text-sm text-green-600">{sucesso}</p>}
                        <Button
                            onClick={salvarChamada}
                            disabled={salvando || membros.length === 0}
                        >
                            {salvando ? "Salvando..." : "Salvar chamada"}
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
