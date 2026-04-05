"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircle } from "lucide-react"
import { unitsApi, usersApi, scoresApi, type UnitAPI, type UserAPI } from "@/lib/api"

export default function Bonus() {
    const [tipo, setTipo] = useState<"unidade" | "membro">("unidade")
    const [unidades, setUnidades] = useState<UnitAPI[]>([])
    const [membros, setMembros] = useState<UserAPI[]>([])
    const [alvoId, setAlvoId] = useState<string | undefined>()
    const [pontos, setPontos] = useState("")
    const [descricao, setDescricao] = useState("")
    const [ano, setAno] = useState(new Date().getFullYear().toString())
    const [semestre, setSemestre] = useState("1")
    const [salvando, setSalvando] = useState(false)
    const [erro, setErro] = useState("")
    const [sucesso, setSucesso] = useState("")

    useEffect(() => {
        unitsApi.list().then((res) => setUnidades(res.data)).catch(console.error)
        usersApi.list(undefined, 0, 100).then((res) => setMembros(res.data.items)).catch(console.error)
    }, [])

    useEffect(() => {
        setAlvoId(undefined)
    }, [tipo])

    const handleSubmit = async () => {
        if (!alvoId || !pontos || !descricao) {
            setErro("Preencha todos os campos.")
            return
        }
        const pts = Number(pontos)
        if (isNaN(pts)) {
            setErro("Pontos deve ser um número.")
            return
        }
        setErro("")
        setSucesso("")
        setSalvando(true)
        try {
            await scoresApi.createBonus({
                ...(tipo === "unidade" ? { unit_id: alvoId } : { user_id: alvoId }),
                points: pts,
                description: descricao,
                year: ano,
                semester: Number(semestre),
            })
            setSucesso("Bônus lançado com sucesso!")
            setPontos("")
            setDescricao("")
            setAlvoId(undefined)
        } catch (err) {
            setErro(err instanceof Error ? err.message : "Erro ao lançar bônus.")
        } finally {
            setSalvando(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <PlusCircle /> Lançar Ponto Bônus
                </CardTitle>
                <CardDescription>Adicione pontos por unidade ou por membro individualmente.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label>Período — Ano</Label>
                        <Select value={ano} onValueChange={setAno}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="2026">2026</SelectItem>
                                <SelectItem value="2025">2025</SelectItem>
                                <SelectItem value="2024">2024</SelectItem>
                                <SelectItem value="2023">2023</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Semestre</Label>
                        <Select value={semestre} onValueChange={setSemestre}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">1º Semestre</SelectItem>
                                <SelectItem value="2">2º Semestre</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Tipo de Lançamento</Label>
                        <Select value={tipo} onValueChange={(v: "unidade" | "membro") => setTipo(v)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="unidade">Por Unidade</SelectItem>
                                <SelectItem value="membro">Por Membro</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {tipo === "unidade" && (
                    <div className="space-y-2">
                        <Label>Unidade</Label>
                        <Select value={alvoId} onValueChange={setAlvoId}>
                            <SelectTrigger className="w-64"><SelectValue placeholder="Selecione a unidade" /></SelectTrigger>
                            <SelectContent>
                                {unidades.map((u) => (
                                    <SelectItem key={u.id_} value={u.id_}>{u.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}

                {tipo === "membro" && (
                    <div className="space-y-2">
                        <Label>Membro</Label>
                        <Select value={alvoId} onValueChange={setAlvoId}>
                            <SelectTrigger className="w-64"><SelectValue placeholder="Selecione o membro" /></SelectTrigger>
                            <SelectContent>
                                {membros.map((m) => (
                                    <SelectItem key={m.id_} value={m.id_}>
                                        {m.name ?? m.document}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="pontos">Pontos</Label>
                        <Input
                            id="pontos"
                            type="number"
                            placeholder="Ex: 50"
                            value={pontos}
                            onChange={(e) => setPontos(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="descricao">Descrição</Label>
                        <Textarea
                            id="descricao"
                            placeholder="Descreva o motivo do bônus"
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                        />
                    </div>
                </div>

                {erro && <p className="text-sm text-red-600">{erro}</p>}
                {sucesso && <p className="text-sm text-green-600">{sucesso}</p>}
                <Button onClick={handleSubmit} disabled={salvando}>
                    {salvando ? "Lançando..." : "Lançar Bônus"}
                </Button>
            </CardContent>
        </Card>
    )
}
