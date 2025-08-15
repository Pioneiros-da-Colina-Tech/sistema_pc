"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users, Award, Calendar, TrendingUp, BarChart3, BookOpen, AlertTriangle } from "lucide-react"

export default function DashboardUnidadePage() {
  const [unidadeSelecionada, setUnidadeSelecionada] = useState("jaguar")

  const dadosUnidades = {
    jaguar: {
      nome: "Jaguar",
      totalMembros: 15,
      desbravadores: 12,
      conselheiros: 3,
      pontuacao: 85,
      especialidadesAndamento: 8,
      especialidadesConcluidas: 12,
      classesAndamento: 5, // Requisitos da classe que já foram iniciados
      classesTotal: 12,     // Total de requisitos da classe
      classesAtraso: 2,       // Requisitos planejados cuja data passou e não foram concluídos
      presencaMedia: 78,
      reunioesParticipadas: 10,
      totalReunioes: 12,
      atosRegistrados: 6,
      proximasAtividades: [
        { nome: "Especialidade Internet", data: "2025-01-30" },
        { nome: "Investidura Classe Amigo", data: "2025-02-05" },
      ],
      membrosDestaque: [
        { nome: "João Silva", motivo: "100% presença", tipo: "presenca" },
        { nome: "Maria Santos", motivo: "3 especialidades concluídas", tipo: "especialidade" },
      ],
      estatisticasMensais: {
        janeiro: { presenca: 78, especialidades: 3, classes: 2 },
        dezembro: { presenca: 82, especialidades: 2, classes: 1 },
        novembro: { presenca: 75, especialidades: 4, classes: 3 },
      },
    },
    "gato-mato": {
      nome: "Gato do Mato",
      totalMembros: 12,
      desbravadores: 9,
      conselheiros: 3,
      pontuacao: 72,
      especialidadesAndamento: 6,
      especialidadesConcluidas: 8,
      classesAndamento: 4,
      classesTotal: 10,
      classesAtraso: 1,
      presencaMedia: 85,
      reunioesParticipadas: 11,
      totalReunioes: 12,
      atosRegistrados: 4,
      proximasAtividades: [
        { nome: "Acampamento Regional", data: "2025-02-15" },
        { nome: "Especialidade Primeiros Socorros", data: "2025-02-20" },
      ],
      membrosDestaque: [
        { nome: "Pedro Costa", motivo: "Líder em especialidades", tipo: "lideranca" },
        { nome: "Ana Oliveira", motivo: "Melhor conselheiro", tipo: "conselheiro" },
      ],
      estatisticasMensais: {
        janeiro: { presenca: 85, especialidades: 2, classes: 1 },
        dezembro: { presenca: 88, especialidades: 3, classes: 2 },
        novembro: { presenca: 80, especialidades: 1, classes: 1 },
      },
    },
  }

  const unidadeAtual = dadosUnidades[unidadeSelecionada as keyof typeof dadosUnidades]
  const classesFaltantes = unidadeAtual.classesTotal - unidadeAtual.classesAndamento;
  const progressoClasseGeral = (unidadeAtual.classesAndamento / unidadeAtual.classesTotal) * 100;


  return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard por Unidade</h1>
            <p className="text-muted-foreground">Visão detalhada do desempenho da unidade</p>
          </div>
          <Select value={unidadeSelecionada} onValueChange={setUnidadeSelecionada}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="jaguar">Jaguar</SelectItem>
              <SelectItem value="gato-mato">Gato do Mato</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Cards de Estatísticas Principais */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total de Membros</CardTitle><Users className="h-4 w-4 text-muted-foreground" /></CardHeader>
            <CardContent><div className="text-2xl font-bold">{unidadeAtual.totalMembros}</div><div className="flex gap-2 text-xs text-muted-foreground mt-1"><span>{unidadeAtual.desbravadores} Desbravadores</span><span>•</span><span>{unidadeAtual.conselheiros} Conselheiros</span></div></CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Pontuação</CardTitle><BarChart3 className="h-4 w-4 text-muted-foreground" /></CardHeader>
            <CardContent><div className="text-2xl font-bold">{unidadeAtual.pontuacao}</div><Progress value={unidadeAtual.pontuacao} className="mt-2" /></CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Presença Média</CardTitle><TrendingUp className="h-4 w-4 text-muted-foreground" /></CardHeader>
            <CardContent><div className="text-2xl font-bold">{unidadeAtual.presencaMedia}%</div><p className="text-xs text-muted-foreground">{unidadeAtual.reunioesParticipadas}/{unidadeAtual.totalReunioes} reuniões</p></CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Especialidades</CardTitle><Award className="h-4 w-4 text-muted-foreground" /></CardHeader>
            <CardContent><div className="text-2xl font-bold">{unidadeAtual.especialidadesConcluidas}</div><p className="text-xs text-muted-foreground">{unidadeAtual.especialidadesAndamento} em andamento</p></CardContent>
          </Card>
        </div>

        {/* Gráficos e Progresso */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Progresso de Classes e Especialidades</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1"><span className="text-sm font-medium">Progresso Geral da Classe</span><span className="text-sm text-muted-foreground">{unidadeAtual.classesAndamento} de {unidadeAtual.classesTotal} requisitos iniciados</span></div>
                <Progress value={progressoClasseGeral} className="h-2"/>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="p-4 bg-gray-50 rounded-lg text-center"><p className="text-sm font-medium flex items-center justify-center gap-2"><BookOpen className="h-4 w-4"/>Faltantes</p><p className="text-2xl font-bold">{classesFaltantes}</p></div>
                <div className="p-4 bg-yellow-50 rounded-lg text-center"><p className="text-sm font-medium flex items-center justify-center gap-2"><AlertTriangle className="h-4 w-4"/>Em Atraso</p><p className="text-2xl font-bold">{unidadeAtual.classesAtraso}</p></div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2"><span className="text-sm font-medium">Especialidades</span><span className="text-sm text-muted-foreground">{unidadeAtual.especialidadesConcluidas} concluídas, {unidadeAtual.especialidadesAndamento} em andamento</span></div>
                <Progress value={(unidadeAtual.especialidadesConcluidas / (unidadeAtual.especialidadesConcluidas + unidadeAtual.especialidadesAndamento)) * 100} className="h-2"/>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Próximas Atividades</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {unidadeAtual.proximasAtividades.map((atividade, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div className="flex items-center gap-3"><Calendar className="h-4 w-4 text-muted-foreground" /><span className="font-medium">{atividade.nome}</span></div>
                      <span className="text-sm text-muted-foreground">{new Date(atividade.data).toLocaleDateString("pt-BR")}</span>
                    </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t">
                <h4 className="font-medium mb-3">Membros em Destaque</h4>
                <div className="space-y-2">
                  {unidadeAtual.membrosDestaque.map((membro, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded">
                        <span className="font-medium">{membro.nome}</span>
                        <Badge variant="outline" className="text-xs">{membro.motivo}</Badge>
                      </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Estatísticas Mensais */}
        <Card>
          <CardHeader>
            <CardTitle>Evolução Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2"><h4 className="font-medium">Janeiro 2025</h4><div className="space-y-1 text-sm"><div className="flex justify-between"><span>Presença:</span><span className="font-medium">{unidadeAtual.estatisticasMensais.janeiro.presenca}%</span></div><div className="flex justify-between"><span>Especialidades:</span><span className="font-medium">{unidadeAtual.estatisticasMensais.janeiro.especialidades}</span></div><div className="flex justify-between"><span>Classes:</span><span className="font-medium">{unidadeAtual.estatisticasMensais.janeiro.classes}</span></div></div></div>
              <div className="space-y-2"><h4 className="font-medium">Dezembro 2024</h4><div className="space-y-1 text-sm"><div className="flex justify-between"><span>Presença:</span><span className="font-medium">{unidadeAtual.estatisticasMensais.dezembro.presenca}%</span></div><div className="flex justify-between"><span>Especialidades:</span><span className="font-medium">{unidadeAtual.estatisticasMensais.dezembro.especialidades}</span></div><div className="flex justify-between"><span>Classes:</span><span className="font-medium">{unidadeAtual.estatisticasMensais.dezembro.classes}</span></div></div></div>
              <div className="space-y-2"><h4 className="font-medium">Novembro 2024</h4><div className="space-y-1 text-sm"><div className="flex justify-between"><span>Presença:</span><span className="font-medium">{unidadeAtual.estatisticasMensais.novembro.presenca}%</span></div><div className="flex justify-between"><span>Especialidades:</span><span className="font-medium">{unidadeAtual.estatisticasMensais.novembro.especialidades}</span></div><div className="flex justify-between"><span>Classes:</span><span className="font-medium">{unidadeAtual.estatisticasMensais.novembro.classes}</span></div></div></div>
            </div>
          </CardContent>
        </Card>
      </div>
  )
}