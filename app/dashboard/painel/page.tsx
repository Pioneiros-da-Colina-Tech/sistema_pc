"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Award, BookOpen, Trophy, FileText, RefreshCw, Calendar, DollarSign, KeyRound } from "lucide-react"

import EspecialidadesTab from "./components/especialidades"
import ClassesTab from "./components/classes"
import MestradosTab from "./components/mestrados"
import EventosTab from "./components/eventos"
import FinanceiroTab from "./components/financeiro"
import AlterarSenhaTab from "./components/alterar-senha"
import DocumentosTab from "./components/documentos"
import RematriculaTab from "./components/rematricula"

// Mock data for summary cards
const minhasClassesMock = [
  { id: 1, nome: "Amigo", codigo: "AM-001", status: "investida" },
  { id: 2, nome: "Companheiro", codigo: "CP-002", status: "em-avaliacao" },
]
const minhasEspecialidadesMock = [
  { id: 1, nome: "Internet", codigo: "AP-034", status: "concluida" },
  { id: 2, nome: "Primeiros Socorros", codigo: "PS-001", status: "em-andamento" },
]
const mestradosMock = [
  { id: 1, nome: "Especialidades Tecnicas", progresso: 2, total: 7, status: "em-andamento" },
  { id: 2, nome: "Especialidades de Saude", progresso: 7, total: 7, status: "concluido" },
]

export default function PainelPage() {
  return (
    <div className="space-y-6">
      <Card className="border-0 bg-transparent shadow-none">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-2xl font-bold">Meu Painel</CardTitle>
          <CardDescription className="text-base">
            Acompanhe seu progresso pessoal e gerencie suas informacoes
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{minhasClassesMock.length}</p>
              <p className="text-sm text-muted-foreground">Classes Registradas</p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
              <Award className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{minhasEspecialidadesMock.length}</p>
              <p className="text-sm text-muted-foreground">Especialidades</p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10">
              <Trophy className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">{mestradosMock.filter((m) => m.status === "concluido").length}</p>
              <p className="text-sm text-muted-foreground">Mestrados Concluidos</p>
            </div>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="especialidades" className="space-y-6">
        <TabsList className="h-auto p-1 bg-muted/50 flex flex-wrap gap-1">
          <TabsTrigger
            value="especialidades"
            className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm px-3 py-2"
          >
            <Award className="h-4 w-4" />
            <span className="hidden sm:inline">Especialidades</span>
          </TabsTrigger>
          <TabsTrigger
            value="classes"
            className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm px-3 py-2"
          >
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Classes</span>
          </TabsTrigger>
          <TabsTrigger
            value="mestrados"
            className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm px-3 py-2"
          >
            <Trophy className="h-4 w-4" />
            <span className="hidden sm:inline">Mestrados</span>
          </TabsTrigger>
          <TabsTrigger
            value="documentos"
            className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm px-3 py-2"
          >
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Documentos</span>
          </TabsTrigger>
          <TabsTrigger
            value="rematricula"
            className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm px-3 py-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="hidden sm:inline">Rematricula</span>
          </TabsTrigger>
          <TabsTrigger
            value="eventos"
            className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm px-3 py-2"
          >
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Eventos</span>
          </TabsTrigger>
          <TabsTrigger
            value="financeiro"
            className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm px-3 py-2"
          >
            <DollarSign className="h-4 w-4" />
            <span className="hidden sm:inline">Financeiro</span>
          </TabsTrigger>
          <TabsTrigger
            value="alterar-senha"
            className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm px-3 py-2"
          >
            <KeyRound className="h-4 w-4" />
            <span className="hidden sm:inline">Senha</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="especialidades" className="mt-6">
          <EspecialidadesTab />
        </TabsContent>
        <TabsContent value="classes" className="mt-6">
          <ClassesTab />
        </TabsContent>
        <TabsContent value="mestrados" className="mt-6">
          <MestradosTab />
        </TabsContent>
        <TabsContent value="documentos" className="mt-6">
          <DocumentosTab />
        </TabsContent>
        <TabsContent value="rematricula" className="mt-6">
          <RematriculaTab />
        </TabsContent>
        <TabsContent value="eventos" className="mt-6">
          <EventosTab />
        </TabsContent>
        <TabsContent value="financeiro" className="mt-6">
          <FinanceiroTab />
        </TabsContent>
        <TabsContent value="alterar-senha" className="mt-6">
          <AlterarSenhaTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
