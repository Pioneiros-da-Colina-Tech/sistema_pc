"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CalendarDays, Users, Star, Archive, Newspaper, TrendingUp, Clock, Calendar } from "lucide-react"

// --- Mock Data ---
const proximasReunioes = [
  { data: "2025-09-15", nome: "Reuniao de Unidade" },
  { data: "2025-09-22", nome: "Treinamento de Primeiros Socorros" },
  { data: "2025-10-01", nome: "Reuniao com os Pais" },
]

const recados = [
  { id: 1, titulo: "Ajustes no Calendario", data: "Hoje", tipo: "info" },
  { id: 2, titulo: "Novo Manual de Uniformes", data: "Ontem", tipo: "update" },
  { id: 3, titulo: "Inscricoes Abertas para o Camporee", data: "3 dias atras", tipo: "event" },
]

const eventos = [
  { id: 1, nome: "Camporee Regional", inscritos: 35, vagas: 50, data: "15 Out" },
  { id: 2, nome: "Treinamento de Lideranca", inscritos: 18, vagas: 20, data: "28 Set" },
]

// --- Calendar Component ---
function CalendarioReunioes() {
  const ano = 2025
  const mes = 8 // 0-indexed, so 8 = September
  const diasNoMes = new Date(ano, mes + 1, 0).getDate()
  const primeiroDia = new Date(ano, mes, 1).getDay()

  const dias = Array.from({ length: primeiroDia }, (_, i) => <div key={`empty-${i}`}></div>)
  for (let dia = 1; dia <= diasNoMes; dia++) {
    const dataAtual = `${ano}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`
    const reuniaoDoDia = proximasReunioes.find(r => r.data === dataAtual)
    dias.push(
      <div 
        key={dia} 
        className={`text-center p-2 rounded-lg transition-colors ${
          reuniaoDoDia 
            ? 'bg-primary text-primary-foreground font-medium' 
            : 'hover:bg-muted/50'
        }`}
      >
        <p className="text-sm">{dia}</p>
        {reuniaoDoDia && <p className="text-xs truncate mt-0.5">{reuniaoDoDia.nome}</p>}
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-7 gap-1 text-xs text-center text-muted-foreground mb-2 font-medium">
        <span>Dom</span><span>Seg</span><span>Ter</span><span>Qua</span><span>Qui</span><span>Sex</span><span>Sab</span>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {dias}
      </div>
    </div>
  )
}

export default function DashboardHome() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Bem-vindo ao Dashboard</h1>
        <p className="text-muted-foreground">Acompanhe as atividades do clube Pioneiros da Colina</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <CalendarDays className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">15/09</p>
              <p className="text-sm text-muted-foreground">Proxima Reuniao</p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
              <Users className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">45</p>
              <p className="text-sm text-muted-foreground">Membros Ativos</p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10">
              <Star className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">82 pts</p>
              <p className="text-sm text-muted-foreground">Pontuacao Media</p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
              <Archive className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold">28</p>
              <p className="text-sm text-muted-foreground">Itens Patrimonio</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Calendar Card */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Proximas Reunioes</CardTitle>
                <CardDescription>Calendario de Setembro 2025</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <CalendarioReunioes />
          </CardContent>
        </Card>

        {/* Events Card */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                <TrendingUp className="h-5 w-5 text-success" />
              </div>
              <div>
                <CardTitle className="text-lg">Painel de Eventos</CardTitle>
                <CardDescription>Acompanhe as inscricoes para os proximos eventos</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {eventos.map(evento => (
              <div key={evento.id} className="p-4 rounded-lg bg-muted/30">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <span className="font-semibold">{evento.nome}</span>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Clock className="h-3 w-3" />
                      {evento.data}
                    </p>
                  </div>
                  <Badge variant="secondary">
                    {evento.inscritos} / {evento.vagas}
                  </Badge>
                </div>
                <Progress value={(evento.inscritos / evento.vagas) * 100} className="h-2"/>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* News Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Newspaper className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Mural de Recados</CardTitle>
              <CardDescription>Ultimos comunicados e atividades importantes</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recados.map(recado => (
              <div key={recado.id} className="flex justify-between items-center p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span className="font-medium">{recado.titulo}</span>
                </div>
                <span className="text-sm text-muted-foreground">{recado.data}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
