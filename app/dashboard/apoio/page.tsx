import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, Mail, Calendar } from "lucide-react"

export default function ApoioPage() {
  const eventos = [
    { id: 1, nome: "Camporee Regional", data: "2025-03-15", local: "Campo de Aventuras", status: "confirmado" },
    {
      id: 2,
      nome: "Treinamento de Liderança",
      data: "2025-02-20",
      local: "Sede Regional",
      status: "inscricoes-abertas",
    },
    { id: 3, nome: "Festival de Talentos", data: "2025-04-10", local: "Centro de Convenções", status: "planejamento" },
  ]

  const contatos = [
    { nome: "Pastor Regional", telefone: "(11) 99999-9999", email: "pastor@regiao.com" },
    { nome: "Coordenador de Atividades", telefone: "(11) 88888-8888", email: "atividades@regiao.com" },
    { nome: "Secretaria Regional", telefone: "(11) 77777-7777", email: "secretaria@regiao.com" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Apoio Regional</h1>
        <p className="text-muted-foreground">Informações e suporte da região</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eventos Regionais</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{eventos.length}</div>
            <p className="text-xs text-muted-foreground">Próximos eventos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clubes na Região</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Clubes ativos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Suporte</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24/7</div>
            <p className="text-xs text-muted-foreground">Disponível</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Próximos Eventos Regionais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {eventos.map((evento) => (
                <div key={evento.id} className="border rounded p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{evento.nome}</h4>
                    <Badge
                      variant={
                        evento.status === "confirmado"
                          ? "default"
                          : evento.status === "inscricoes-abertas"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {evento.status === "confirmado"
                        ? "Confirmado"
                        : evento.status === "inscricoes-abertas"
                          ? "Inscrições Abertas"
                          : "Em Planejamento"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(evento.data).toLocaleDateString("pt-BR")}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {evento.local}
                    </div>
                  </div>
                  {evento.status === "inscricoes-abertas" && (
                    <Button size="sm" className="w-full">
                      Inscrever-se
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contatos Regionais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {contatos.map((contato, index) => (
                <div key={index} className="border rounded p-4 space-y-2">
                  <h4 className="font-medium">{contato.nome}</h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {contato.telefone}
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {contato.email}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recursos e Documentos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Button variant="outline" className="h-20 flex-col bg-transparent">
              <span className="font-medium">Manual do Desbravador</span>
              <span className="text-xs text-muted-foreground">PDF - 2.5MB</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col bg-transparent">
              <span className="font-medium">Regulamentos</span>
              <span className="text-xs text-muted-foreground">PDF - 1.8MB</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col bg-transparent">
              <span className="font-medium">Formulários</span>
              <span className="text-xs text-muted-foreground">ZIP - 3.2MB</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col bg-transparent">
              <span className="font-medium">Especialidades</span>
              <span className="text-xs text-muted-foreground">PDF - 4.1MB</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col bg-transparent">
              <span className="font-medium">Classes Progressivas</span>
              <span className="text-xs text-muted-foreground">PDF - 2.9MB</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col bg-transparent">
              <span className="font-medium">Calendário Regional</span>
              <span className="text-xs text-muted-foreground">PDF - 1.2MB</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
