"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"

interface Reuniao {
    id: number;
    nome: string;
    data: string;
}

interface NovaReuniaoTabProps {
    reunioes: Reuniao[];
    setReunioes: React.Dispatch<React.SetStateAction<Reuniao[]>>;
}

export default function NovaReuniaoTab({ reunioes, setReunioes }: NovaReuniaoTabProps) {
    const [novaReuniao, setNovaReuniao] = useState({ nome: "", data: "" })

    const adicionarReuniao = () => {
        if (novaReuniao.nome && novaReuniao.data) {
            setReunioes([
                ...reunioes,
                {
                    id: Date.now(),
                    ...novaReuniao,
                },
            ])
            setNovaReuniao({ nome: "", data: "" })
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
                <Button onClick={adicionarReuniao}>Cadastrar</Button>
            </CardContent>
        </Card>
    )
}