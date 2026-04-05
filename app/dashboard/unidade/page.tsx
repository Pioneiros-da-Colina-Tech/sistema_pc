"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { BarChart3, Users, Award } from "lucide-react"
import PontuacaoTab from "./components/pontuacao"
import MembrosUnidadeTab from "./components/membros"
import ProgressoClasseTab from "./components/progresso-classe"
import ProgressoEspecialidadeTab from "./components/progresso-especialidade"
import AtosTab from "./components/atos"
import PlanejamentoTab from "./components/planejamento"
import { unitsApi, scoresApi, meetingsApi, type UnitAPI, type UnitMemberAPI, type MeetingAPI } from "@/lib/api"

export type MembroUnidade = {
  id: string
  nome: string
  cargo: string
  codigo_sgc: string
}

export default function UnidadePage() {
  const [unidades, setUnidades] = useState<UnitAPI[]>([])
  const [unidadeSelecionada, setUnidadeSelecionada] = useState<string>("")
  const [membrosRaw, setMembrosRaw] = useState<UnitMemberAPI[]>([])
  const [reunioes, setReunioes] = useState<MeetingAPI[]>([])
  const [pontuacao, setPontuacao] = useState<number | null>(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    Promise.all([
      unitsApi.list(),
      meetingsApi.list(),
    ]).then(([unitsRes, meetingsRes]) => {
      const units = unitsRes.data
      setUnidades(units)
      setReunioes(meetingsRes.data)
      if (units.length > 0) setUnidadeSelecionada(units[0].id_)
    }).catch(console.error).finally(() => setCarregando(false))
  }, [])

  useEffect(() => {
    if (!unidadeSelecionada) return
    const clubYear = new Date().getFullYear().toString()
    unitsApi.getMembers(unidadeSelecionada, clubYear)
      .then((res) => setMembrosRaw(res.data))
      .catch(console.error)

    const currentYear = new Date().getFullYear().toString()
    scoresApi.getRanking(currentYear, 1)
      .then((res) => {
        const entry = res.data.units.find((u) => u.unit_id === unidadeSelecionada)
        setPontuacao(entry?.total ?? null)
      })
      .catch(() => setPontuacao(null))
  }, [unidadeSelecionada])

  const membrosDaUnidade: MembroUnidade[] = membrosRaw.map((m) => ({
    id: m.user_id,
    nome: m.user_name ?? m.user_document,
    cargo: m.role,
    codigo_sgc: m.user_codigo_sgc ?? "",
  }))

  const unidadeAtual = unidades.find((u) => u.id_ === unidadeSelecionada)

  if (carregando) {
    return <p className="text-muted-foreground p-8">Carregando...</p>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Unidade</h1>
          <p className="text-muted-foreground">Gerencie sua unidade e acompanhe o progresso</p>
        </div>
        <Select value={unidadeSelecionada} onValueChange={setUnidadeSelecionada}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            {unidades.map((u) => (
              <SelectItem key={u.id_} value={u.id_}>{u.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pontuação</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pontuacao ?? "—"}</div>
            <Progress value={pontuacao ?? 0} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Membros</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{membrosDaUnidade.length}</div>
            <p className="text-xs text-muted-foreground">Ativos na unidade</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Especialidades</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">—</div>
            <p className="text-xs text-muted-foreground">Em andamento</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="progresso-classe" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="pontuacao">Pontuação</TabsTrigger>
          <TabsTrigger value="membros">Membros</TabsTrigger>
          <TabsTrigger value="progresso-classe">Progresso de Classe</TabsTrigger>
          <TabsTrigger value="progresso-especialidade">Especialidades</TabsTrigger>
          <TabsTrigger value="atos">Atos</TabsTrigger>
          <TabsTrigger value="planejamento">Planejamento</TabsTrigger>
        </TabsList>

        <TabsContent value="pontuacao" className="space-y-4">
          <PontuacaoTab membrosDaUnidade={membrosDaUnidade} pontuacaoTotal={pontuacao} />
        </TabsContent>

        <TabsContent value="membros" className="space-y-4">
          <MembrosUnidadeTab membrosDaUnidade={membrosDaUnidade} />
        </TabsContent>

        <TabsContent value="progresso-classe" className="space-y-4">
          <ProgressoClasseTab membrosDaUnidade={membrosDaUnidade} />
        </TabsContent>

        <TabsContent value="progresso-especialidade" className="space-y-4">
          <ProgressoEspecialidadeTab membrosDaUnidade={membrosDaUnidade} />
        </TabsContent>

        <TabsContent value="atos" className="space-y-4">
          <AtosTab />
        </TabsContent>

        <TabsContent value="planejamento" className="space-y-4">
          <PlanejamentoTab reunioes={reunioes} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
