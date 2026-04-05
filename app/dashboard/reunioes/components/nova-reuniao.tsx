"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import { meetingsApi } from "@/lib/api"
import type { Reuniao } from "../page"

interface NovaReuniaoTabProps {
    reunioes: Reuniao[]
    setReunioes: React.Dispatch<React.SetStateAction<Reuniao[]>>
}

export default function NovaReuniaoTab({ reunioes, setReunioes }: NovaReuniaoTabProps) {
    const [novaReuniao, setNovaReuniao] = useState({ nome: "", data: "" })
    const [salvando, setSalvando] = useState(false)
    const [erro, setErro] = useState("")

    const adicionarReuniao = async () => {
        if (!novaReuniao.nome || !novaReuniao.data) return
        setErro("")
        setSalvando(true)
        try {
            const res = await meetingsApi.create(novaReuniao.nome, novaReuniao.data)
            setReunioes([
                ...reunioes,
                { id: res.data.id_, nome: res.data.name, data: res.data.date },
            ])
            setNovaReuniao({ nome: "", data: "" })
        } catch (err) {
            setErro(err instanceof Error ? err.message : "Erro ao criar reunião.")
        } finally {
            setSalvando(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Nova Reunião
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="nome">Nome</Label>
                        <Input
                            id="nome"
                            value={novaReuniao.nome}
                            onChange={(e) => setNovaReuniao({ ...novaReuniao, nome: e.target.value })}
                            placeholder="Nome da reunião"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="data">Data</Label>
                        <Input
                            id="data"
                            type="date"
                            value={novaReuniao.data}
                            onChange={(e) => setNovaReuniao({ ...novaReuniao, data: e.target.value })}
                        />
                    </div>
                </div>
                {erro && <p className="text-sm text-red-600">{erro}</p>}
                <Button onClick={adicionarReuniao} disabled={salvando}>
                    {salvando ? "Cadastrando..." : "Cadastrar"}
                </Button>
            </CardContent>
        </Card>
    )
}
