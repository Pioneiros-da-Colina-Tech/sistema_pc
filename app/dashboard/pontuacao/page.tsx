"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Trophy, PlusCircle, Filter } from "lucide-react"
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
      <Card className="border-0 bg-transparent shadow-none">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-2xl font-bold">Pontuacao</CardTitle>
          <CardDescription className="text-base">
            Acompanhe o ranking e adicione pontos bonus
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Filter className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-lg">Filtros</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-end gap-4">
            <div className="w-40 space-y-2">
              <Label className="text-sm font-medium">Ano</Label>
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
            <div className="w-48 space-y-2">
              <Label className="text-sm font-medium">Semestre</Label>
              <Select value={filtroSemestre} onValueChange={setFiltroSemestre}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1o Semestre</SelectItem>
                  <SelectItem value="2">2o Semestre</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="ranking" className="space-y-6">
        <TabsList className="h-auto p-1 bg-muted/50 flex flex-wrap gap-1">
          <TabsTrigger
            value="ranking"
            className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm px-4 py-2.5"
          >
            <Trophy className="h-4 w-4" />
            <span>Ranking e Pontuacao</span>
          </TabsTrigger>
          <TabsTrigger
            value="bonus"
            className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm px-4 py-2.5"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Lancar Bonus</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="ranking" className="mt-6">
          {filtroAno ? (
            <Ranking filtroAno={filtroAno} filtroSemestre={filtroSemestre} />
          ) : (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">Selecione um ano para ver o ranking.</p>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="bonus" className="mt-6">
          <Bonus />
        </TabsContent>
      </Tabs>
    </div>
  )
}
