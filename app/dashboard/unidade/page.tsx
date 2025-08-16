"use client"

import { useState } from "react"
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

// --- Dados Mockados ---
const unidadesMock = [
  { id: "jaguar", nome: "Jaguar", pontuacao: 85, codigo_classe_regular: "AM-001", codigo_classe_avancada: "AM-A-001" },
  { id: "gato-mato", nome: "Gato do Mato", pontuacao: 72, codigo_classe_regular: "CP-002", codigo_classe_avancada: "CP-A-002" },
]

const membrosMock = [
  { id: 1, codigo_sgc: "12345", nome: "João Silva", cargo: "Desbravador", id_unidade: "jaguar" },
  { id: 2, codigo_sgc: "54321", nome: "Maria Santos", cargo: "Conselheiro", id_unidade: "jaguar" },
  { id: 3, codigo_sgc: "67890", nome: "Pedro Costa", cargo: "Desbravador", id_unidade: "gato-mato" },
]

const especialidadesMock = [
  { id: 1, nome: "Internet", membros: ["João Silva", "Pedro Costa"], status: "aprovado" },
  { id: 2, nome: "Primeiros Socorros", membros: ["Maria Santos"], status: "avaliacao" },
]
// --- Fim dos Dados Mockados ---

export default function UnidadePage() {
  const [unidadeSelecionada, setUnidadeSelecionada] = useState("jaguar")

  const unidadeAtual = unidadesMock.find((u) => u.id === unidadeSelecionada)
  const membrosDaUnidade = membrosMock.filter((m) => m.id_unidade === unidadeSelecionada)

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
              {unidadesMock.map((unidade) => (<SelectItem key={unidade.id} value={unidade.id}>{unidade.nome}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Pontuação</CardTitle><BarChart3 className="h-4 w-4 text-muted-foreground" /></CardHeader>
            <CardContent><div className="text-2xl font-bold">{unidadeAtual?.pontuacao}</div><Progress value={unidadeAtual?.pontuacao} className="mt-2" /></CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Membros</CardTitle><Users className="h-4 w-4 text-muted-foreground" /></CardHeader>
            <CardContent><div className="text-2xl font-bold">{membrosDaUnidade.length}</div><p className="text-xs text-muted-foreground">Ativos na unidade</p></CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Especialidades</CardTitle><Award className="h-4 w-4 text-muted-foreground" /></CardHeader>
            <CardContent><div className="text-2xl font-bold">{especialidadesMock.length}</div><p className="text-xs text-muted-foreground">Em andamento</p></CardContent>
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
            <PontuacaoTab membrosDaUnidade={membrosDaUnidade} unidadeAtual={unidadeAtual} />
          </TabsContent>

          <TabsContent value="membros" className="space-y-4">
            <MembrosUnidadeTab membrosDaUnidade={membrosDaUnidade} />
          </TabsContent>

          <TabsContent value="progresso-classe" className="space-y-4">
            <ProgressoClasseTab membrosDaUnidade={membrosDaUnidade} unidadeAtual={unidadeAtual} />
          </TabsContent>

          <TabsContent value="progresso-especialidade" className="space-y-4">
            <ProgressoEspecialidadeTab membrosDaUnidade={membrosDaUnidade} />
          </TabsContent>

          <TabsContent value="atos" className="space-y-4">
            <AtosTab />
          </TabsContent>

          <TabsContent value="planejamento" className="space-y-4">
            <PlanejamentoTab />
          </TabsContent>
        </Tabs>
      </div>
  )
}