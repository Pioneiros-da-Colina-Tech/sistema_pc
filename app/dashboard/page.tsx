"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CalendarDays, Users, Star, Archive, Newspaper, Ticket } from "lucide-react"

// --- Dados Mockados ---
const proximasReunioes = [
  { data: "2025-09-15", nome: "Reunião de Unidade" },
  { data: "2025-09-22", nome: "Treinamento de Primeiros Socorros" },
  { data: "2025-10-01", nome: "Reunião com os Pais" },
]

const recados = [
  { id: 1, titulo: "Ajustes no Calendário", data: "Hoje" },
  { id: 2, titulo: "Novo Manual de Uniformes", data: "Ontem" },
  { id: 3, titulo: "Inscrições Abertas para o Camporee", data: "3 dias atrás" },
]

const eventos = [
  { id: 1, nome: "Camporee Regional", inscritos: 35, vagas: 50 },
  { id: 2, nome: "Treinamento de Liderança", inscritos: 18, vagas: 20 },
]

// --- Componente do Calendário ---
function CalendarioReunioes() {
  // Lógica simples para gerar um calendário para o mês atual (Setembro 2025)
  const ano = 2025;
  const mes = 8; // 0-indexado, então 8 = Setembro
  const diasNoMes = new Date(ano, mes + 1, 0).getDate();
  const primeiroDia = new Date(ano, mes, 1).getDay(); // 0 = Domingo, 1 = Segunda...

  const dias = Array.from({ length: primeiroDia }, (_, i) => <div key={`empty-${i}`}></div>);
  for (let dia = 1; dia <= diasNoMes; dia++) {
    const dataAtual = `${ano}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
    const reuniaoDoDia = proximasReunioes.find(r => r.data === dataAtual);
    dias.push(
        <div key={dia} className={`text-center p-2 rounded-lg ${reuniaoDoDia ? 'bg-primary text-primary-foreground' : ''}`}>
          <p className="font-semibold">{dia}</p>
          {reuniaoDoDia && <p className="text-xs truncate">{reuniaoDoDia.nome}</p>}
        </div>
    );
  }

  return (
      <div>
        <div className="grid grid-cols-7 gap-2 text-sm text-center text-muted-foreground mb-2">
          <span>Dom</span><span>Seg</span><span>Ter</span><span>Qua</span><span>Qui</span><span>Sex</span><span>Sáb</span>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {dias}
        </div>
      </div>
  )
}

export default function DashboardHome() {
  return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Bem-vindo ao sistema Pioneiros da Colina</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Próxima Reunião</CardTitle><CalendarDays className="h-4 w-4 text-muted-foreground" /></CardHeader>
            <CardContent><div className="text-2xl font-bold">15/09</div><p className="text-xs text-muted-foreground">Reunião de Unidade</p></CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Membros Ativos</CardTitle><Users className="h-4 w-4 text-muted-foreground" /></CardHeader>
            <CardContent><div className="text-2xl font-bold">45</div><p className="text-xs text-muted-foreground">Registrados no clube</p></CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Pontuação Média</CardTitle><Star className="h-4 w-4 text-muted-foreground" /></CardHeader>
            <CardContent><div className="text-2xl font-bold">82 Pontos</div><p className="text-xs text-muted-foreground">Média das unidades</p></CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Itens no Patrimônio</CardTitle><Archive className="h-4 w-4 text-muted-foreground" /></CardHeader>
            <CardContent><div className="text-2xl font-bold">28</div><p className="text-xs text-muted-foreground">Itens catalogados</p></CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Próximas Reuniões</CardTitle>
              <CardDescription>Calendário de Setembro 2025</CardDescription>
            </CardHeader>
            <CardContent>
              <CalendarioReunioes />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Painel de Eventos</CardTitle>
              <CardDescription>Acompanhe as inscrições para os próximos eventos.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {eventos.map(evento => (
                  <div key={evento.id}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold">{evento.nome}</span>
                      <span className="text-sm text-muted-foreground">{evento.inscritos} / {evento.vagas} vagas</span>
                    </div>
                    <Progress value={(evento.inscritos / evento.vagas) * 100}/>
                  </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Newspaper/> Mural de Recados da Regional</CardTitle>
            <CardDescription>Últimos comunicados e atividades importantes do sistema.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recados.map(recado => (
                  <div key={recado.id} className="flex justify-between items-center p-3 bg-secondary/50 rounded-md">
                    <span className="font-medium">{recado.titulo}</span>
                    <span className="text-sm text-muted-foreground">{recado.data}</span>
                  </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
  )
}