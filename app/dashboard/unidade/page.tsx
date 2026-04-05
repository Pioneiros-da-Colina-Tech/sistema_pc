"use client"

import { useEffect, useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { BarChart3, Users, Award, Star, UserCheck, GraduationCap, FileText, Calendar } from "lucide-react"
import { Combobox, type ComboboxOption } from "@/components/ui/combobox"
import { Label } from "@/components/ui/label"
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

  const unidadeOptions: ComboboxOption[] = useMemo(() =>
    unidades.map((u) => ({ value: u.id_, label: u.name })),
    [unidades]
  )

  const membrosDaUnidade: MembroUnidade[] = membrosRaw.map((m) => ({
    id: m.user_id,
    nome: m.user_name ?? m.user_document,
    cargo: m.role,
    codigo_sgc: m.user_codigo_sgc ?? "",
  }))

  if (carregando) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
        <span className="ml-2 text-muted-foreground">Carregando...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Card className="border-0 bg-transparent shadow-none">
          <CardHeader className="px-0 pt-0 pb-0">
            <CardTitle className="text-2xl font-bold">Unidade</CardTitle>
            <CardDescription className="text-base">
              Gerencie sua unidade e acompanhe o progresso
            </CardDescription>
          </CardHeader>
        </Card>
        <div className="w-full sm:w-64 space-y-1">
          <Label className="text-sm font-medium">Selecionar Unidade</Label>
          <Combobox
            options={unidadeOptions}
            value={unidadeSelecionada}
            onValueChange={setUnidadeSelecionada}
            placeholder="Buscar unidade..."
            searchPlaceholder="Digite para buscar..."
            emptyMessage="Nenhuma unidade encontrada."
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Star className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-2xl font-bold">{pontuacao ?? "—"}</p>
              <p className="text-sm text-muted-foreground">Pontuacao</p>
              <Progress value={pontuacao ?? 0} max={100} className="mt-2 h-1.5" />
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
              <Users className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{membrosDaUnidade.length}</p>
              <p className="text-sm text-muted-foreground">Membros Ativos</p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10">
              <Award className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">—</p>
              <p className="text-sm text-muted-foreground">Especialidades</p>
            </div>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="progresso-classe" className="space-y-6">
        <TabsList className="h-auto p-1 bg-muted/50 flex flex-wrap gap-1">
          <TabsTrigger
            value="pontuacao"
            className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm px-3 py-2"
          >
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Pontuacao</span>
          </TabsTrigger>
          <TabsTrigger
            value="membros"
            className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm px-3 py-2"
          >
            <UserCheck className="h-4 w-4" />
            <span className="hidden sm:inline">Membros</span>
          </TabsTrigger>
          <TabsTrigger
            value="progresso-classe"
            className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm px-3 py-2"
          >
            <GraduationCap className="h-4 w-4" />
            <span className="hidden sm:inline">Classes</span>
          </TabsTrigger>
          <TabsTrigger
            value="progresso-especialidade"
            className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm px-3 py-2"
          >
            <Award className="h-4 w-4" />
            <span className="hidden sm:inline">Especialidades</span>
          </TabsTrigger>
          <TabsTrigger
            value="atos"
            className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm px-3 py-2"
          >
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Atos</span>
          </TabsTrigger>
          <TabsTrigger
            value="planejamento"
            className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm px-3 py-2"
          >
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Planejamento</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pontuacao" className="mt-6">
          <PontuacaoTab membrosDaUnidade={membrosDaUnidade} pontuacaoTotal={pontuacao} />
        </TabsContent>

        <TabsContent value="membros" className="mt-6">
          <MembrosUnidadeTab membrosDaUnidade={membrosDaUnidade} />
        </TabsContent>

        <TabsContent value="progresso-classe" className="mt-6">
          <ProgressoClasseTab membrosDaUnidade={membrosDaUnidade} />
        </TabsContent>

        <TabsContent value="progresso-especialidade" className="mt-6">
          <ProgressoEspecialidadeTab membrosDaUnidade={membrosDaUnidade} />
        </TabsContent>

        <TabsContent value="atos" className="mt-6">
          <AtosTab />
        </TabsContent>

        <TabsContent value="planejamento" className="mt-6">
          <PlanejamentoTab reunioes={reunioes} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
