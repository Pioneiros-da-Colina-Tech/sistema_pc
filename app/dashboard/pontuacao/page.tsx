"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import Ranking from "./components/ranking"
import Bonus from "./components/bonus"
import { clubYearsApi } from "@/lib/api"

export default function PontuacaoPage() {
    const [anosDisponiveis, setAnosDisponiveis] = useState<string[]>([])
    const [filtroAno, setFiltroAno] = useState("")
    const [filtroSemestre, setFiltroSemestre] = useState("1")

    useEffect(() => {
        clubYearsApi.list().then((res) => {
            const anos = res.data
                .map((cy) => cy.id_)
                .sort((a, b) => b.localeCompare(a))
            setAnosDisponiveis(anos)
            if (anos.length > 0) setFiltroAno(anos[0])
        }).catch(console.error)
    }, [])

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Pontuação</h1>
                <p className="text-muted-foreground">
                    Acompanhe o ranking e adicione pontos bônus.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Filtros</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center gap-4">
                    <div className="w-40">
                        <Label>Ano</Label>
                        <Select value={filtroAno} onValueChange={setFiltroAno} disabled={anosDisponiveis.length === 0}>
                            <SelectTrigger>
                                <SelectValue placeholder={anosDisponiveis.length === 0 ? "Carregando..." : "Selecione"} />
                            </SelectTrigger>
                            <SelectContent>
                                {anosDisponiveis.map((ano) => (
                                    <SelectItem key={ano} value={ano}>{ano}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="w-48">
                        <Label>Semestre</Label>
                        <Select value={filtroSemestre} onValueChange={setFiltroSemestre}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">1º Semestre</SelectItem>
                                <SelectItem value="2">2º Semestre</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            <Tabs defaultValue="ranking">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="ranking">Ranking e Pontuação</TabsTrigger>
                    <TabsTrigger value="bonus">Lançar Bônus</TabsTrigger>
                </TabsList>
                <TabsContent value="ranking">
                    {filtroAno
                        ? <Ranking filtroAno={filtroAno} filtroSemestre={filtroSemestre} />
                        : <p className="text-sm text-muted-foreground py-4">Selecione um ano para ver o ranking.</p>
                    }
                </TabsContent>
                <TabsContent value="bonus">
                    <Bonus />
                </TabsContent>
            </Tabs>
        </div>
    )
}