"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { BarChart3, Users, Award } from "lucide-react"

export default function UnidadePage() {
  const [unidadeSelecionada, setUnidadeSelecionada] = useState("jaguar")

  const unidades = [
    { id: "jaguar", nome: "Jaguar", pontuacao: 85 },
    { id: "gato-mato", nome: "Gato do Mato", pontuacao: 72 },
  ]

  const membrosUnidade = [
    { id: 1, nome: "João Silva", cargo: "Desbravador", sgc: "12345" },
    { id: 2, nome: "Maria Santos", cargo: "Conselheiro", sgc: "54321" },
    { id: 3, nome: "Pedro Costa", cargo: "Desbravador", sgc: "67890" },
  ]

  const requisitos = [
    { id: 1, nome: "Req 1", status: "pendente", classe: "Regular" },
    { id: 2, nome: "Req 2", status: "aprovado", classe: "Regular" },
    { id: 3, nome: "Req 3", status: "avaliacao", classe: "Avançada" },
  ]

  const especialidades = [
    { id: 1, nome: "Internet", membros: ["João Silva", "Pedro Costa"], status: "aprovado" },
    { id: 2, nome: "Primeiros Socorros", membros: ["Maria Santos"], status: "avaliacao" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Unidade</h1>
          <p className="text-muted-foreground">Gerencie sua unidade e acompanhe o progresso</p>
        </div>
        <Select value={unidadeSelecionada} onValueChange={setUnidadeSelecionada}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {unidades.map((unidade) => (
              <SelectItem key={unidade.id} value={unidade.id}>
                {unidade.nome}
              </SelectItem>
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
            <div className="text-2xl font-bold">{unidades.find((u) => u.id === unidadeSelecionada)?.pontuacao}</div>
            <Progress value={unidades.find((u) => u.id === unidadeSelecionada)?.pontuacao} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Membros</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{membrosUnidade.length}</div>
            <p className="text-xs text-muted-foreground">Ativos na unidade</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Especialidades</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{especialidades.length}</div>
            <p className="text-xs text-muted-foreground">Em andamento</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pontuacao" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="pontuacao">Pontuação</TabsTrigger>
          <TabsTrigger value="classe">Classe</TabsTrigger>
          <TabsTrigger value="membros">Membros</TabsTrigger>
          <TabsTrigger value="progresso-classe">Progresso de classe</TabsTrigger>
          <TabsTrigger value="progresso-especialidade">Progresso de especialidade</TabsTrigger>
          <TabsTrigger value="atos">Atos</TabsTrigger>
        </TabsList>

        <TabsContent value="pontuacao" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pontuação da Unidade</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {unidades.map((unidade) => (
                  <div key={unidade.id} className="flex items-center justify-between p-4 border rounded">
                    <span className="font-medium">{unidade.nome}</span>
                    <div className="flex items-center gap-4">
                      <Progress value={unidade.pontuacao} className="w-32" />
                      <span className="font-bold">{unidade.pontuacao}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="membros" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Membros da Unidade</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Cargo: Desbravador</h4>
                  {membrosUnidade
                    .filter((m) => m.cargo === "Desbravador")
                    .map((membro) => (
                      <div key={membro.id} className="ml-4 p-2 bg-gray-50 rounded mb-2">
                        - {membro.nome} (SGC: {membro.sgc})
                      </div>
                    ))}
                </div>
                <div>
                  <h4 className="font-medium mb-2">Cargo: Conselheiro</h4>
                  {membrosUnidade
                    .filter((m) => m.cargo === "Conselheiro")
                    .map((membro) => (
                      <div key={membro.id} className="ml-4 p-2 bg-gray-50 rounded mb-2">
                        - {membro.nome} (SGC: {membro.sgc})
                      </div>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progresso-classe" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Progresso de Classes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Requisitos Pendentes</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Regular</span>
                      <div className="ml-4 space-y-1">
                        {requisitos
                          .filter((r) => r.classe === "Regular" && r.status === "pendente")
                          .map((req) => (
                            <div key={req.id} className="p-2 bg-yellow-50 rounded">
                              {req.nome}
                            </div>
                          ))}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium">Avançada</span>
                      <div className="ml-4 space-y-1">
                        {requisitos
                          .filter((r) => r.classe === "Avançada" && r.status === "pendente")
                          .map((req) => (
                            <div key={req.id} className="p-2 bg-yellow-50 rounded">
                              {req.nome}
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Requisitos Aguardando Avaliação</h4>
                  <div className="ml-4 space-y-1">
                    {requisitos
                      .filter((r) => r.status === "avaliacao")
                      .map((req) => (
                        <div key={req.id} className="p-2 bg-blue-50 rounded">
                          - {req.nome}
                        </div>
                      ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Aprovado</h4>
                  <div className="ml-4 space-y-1">
                    {requisitos
                      .filter((r) => r.status === "aprovado")
                      .map((req) => (
                        <div key={req.id} className="p-2 bg-green-50 rounded">
                          - {req.nome}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progresso-especialidade" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Registrar Especialidades</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Membros</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione os membros" />
                    </SelectTrigger>
                    <SelectContent>
                      {membrosUnidade.map((membro) => (
                        <SelectItem key={membro.id} value={membro.id.toString()}>
                          {membro.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Especialidade</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a especialidade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="internet">Internet</SelectItem>
                      <SelectItem value="primeiros-socorros">Primeiros Socorros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button>Registrar</Button>

              <div className="space-y-4">
                <h4 className="font-medium">Visualização de Especialidades Registradas na Unidade</h4>
                {especialidades.map((esp) => (
                  <div key={esp.id} className="border rounded p-4">
                    <h5 className="font-medium mb-2">{esp.nome}</h5>
                    <div className="space-y-2">
                      <div>
                        <Badge variant={esp.status === "aprovado" ? "default" : "secondary"}>
                          {esp.status === "aprovado" ? "Aprovado" : "Avaliação"}
                        </Badge>
                        <div className="ml-4 mt-1">
                          {esp.membros.map((membro, index) => (
                            <div key={index} className="text-sm">
                              - {membro}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="atos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Registrar Atos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="titulo-ato">Título do Ato</Label>
                <input id="titulo-ato" className="w-full p-2 border rounded" placeholder="Digite o título do ato" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao-ato">Descrição</Label>
                <Textarea id="descricao-ato" placeholder="Descrição do ato" rows={4} />
              </div>

              <div className="space-y-2">
                <Label>Selecione a Ata</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Escolha uma ata" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ata1">Ata da Reunião Geral</SelectItem>
                    <SelectItem value="ata2">Ata do Treinamento</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button>Salvar ato</Button>

              <div className="space-y-2">
                <h4 className="font-medium">Atos Registrados</h4>
                <div className="space-y-2">
                  <div className="p-3 bg-gray-50 rounded">
                    <strong>Especialidade Concluída</strong>
                    <p className="text-sm text-muted-foreground">Internet - João Silva completou todos os requisitos</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <strong>Classe Investida</strong>
                    <p className="text-sm text-muted-foreground">Maria Santos foi investida na classe Amigo</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
