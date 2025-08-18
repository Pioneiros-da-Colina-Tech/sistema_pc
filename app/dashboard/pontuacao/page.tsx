"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import Ranking from "./components/ranking"
import Bonus from "./components/bonus"

export default function PontuacaoPage() {
    const [filtroAno, setFiltroAno] = useState(new Date().getFullYear().toString())
    const [filtroSemestre, setFiltroSemestre] = useState("1")

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
                        <Select value={filtroAno} onValueChange={setFiltroAno}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="2025">2025</SelectItem>
                                <SelectItem value="2024">2024</SelectItem>
                                <SelectItem value="2023">2023</SelectItem>
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
                    <Ranking filtroAno={filtroAno} filtroSemestre={filtroSemestre} />
                </TabsContent>
                <TabsContent value="bonus">
                    <Bonus />
                </TabsContent>
            </Tabs>
        </div>
    )
}