"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Award, BookOpen, Lock } from "lucide-react"

export default function PainelPage() {
  const [usuario] = useState({
    nome: "João Silva",
    usuario: "joao.silva",
    senha: "******",
  })

  const [minhasClasses] = useState([
    { id: 1, nome: "Internet", codigo: "AP-034", status: "concluida" },
    { id: 2, nome: "Primeiros Socorros", codigo: "PS-001", status: "em-andamento" },
  ])

  const [minhasEspecialidades] = useState([
    { id: 1, nome: "Amigo", codigo: "AM-001", status: "investida" },
    { id: 2, nome: "Companheiro", codigo: "CP-002", status: "em-avaliacao" },
  ])

  const [mestrados] = useState([
    {
      id: 1,
      nome: "Especialidades Técnicas",
      progresso: 2,
      total: 7,
      especialidades: ["Internet", "Computação"],
      status: "em-andamento",
    },
    {
      id: 2,
      nome: "Especialidades de Saúde",
      progresso: 7,
      total: 7,
      especialidades: [
        "Primeiros Socorros",
        "Enfermagem",
        "Nutrição",
        "Saúde e Exercício",
        "Temperança",
        "Drogas e Álcool",
        "Prevenção de Acidentes",
      ],
      status: "concluido",
    },
    {
      id: 3,
      nome: "Especialidades da Natureza",
      progresso: 7,
      total: 7,
      especialidades: ["Ecologia", "Mamíferos", "Aves", "Insetos", "Flores", "Árvores", "Sementes"],
      status: "entregue",
    },
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Meu Painel</h1>
        <p className="text-muted-foreground">Acompanhe seu progresso pessoal</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Classes</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{minhasClasses.length}</div>
            <p className="text-xs text-muted-foreground">Em progresso</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Especialidades</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{minhasEspecialidades.length}</div>
            <p className="text-xs text-muted-foreground">Registradas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mestrados</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mestrados.filter((m) => m.status === "concluido" || m.status === "entregue").length}
            </div>
            <p className="text-xs text-muted-foreground">Concluídos</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="especialidades" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="especialidades">Especialidades</TabsTrigger>
          <TabsTrigger value="classes">Classes</TabsTrigger>
          <TabsTrigger value="alterar-senha">Alterar senha</TabsTrigger>
          <TabsTrigger value="mestrados">Mestrados</TabsTrigger>
        </TabsList>

        <TabsContent value="especialidades" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Minhas Especialidades</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-medium">Especialidades Registradas</h4>
                  <div className="space-y-2">
                    {minhasEspecialidades.map((esp) => (
                      <div key={esp.id} className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center gap-3">
                          <span className="font-medium">{esp.nome}</span>
                          <Badge variant="outline">{esp.codigo}</Badge>
                        </div>
                        <Badge variant={esp.status === "investida" ? "default" : "secondary"}>
                          {esp.status === "investida" ? "Investida" : "Em Avaliação"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Novas Especialidades (Avaliação)</h4>
                  <div className="flex gap-2">
                    <select className="flex-1 p-2 border rounded">
                      <option>Selecione uma especialidade</option>
                      <option>Computação</option>
                      <option>Fotografia</option>
                      <option>Arte Culinária</option>
                    </select>
                    <Button>Registrar</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="classes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Minhas Classes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-medium">Classes Registradas</h4>
                  <div className="space-y-2">
                    {minhasClasses.map((classe) => (
                      <div key={classe.id} className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center gap-3">
                          <span className="font-medium">{classe.nome}</span>
                          <Badge variant="outline">{classe.codigo}</Badge>
                        </div>
                        <Badge variant={classe.status === "concluida" ? "default" : "secondary"}>
                          {classe.status === "concluida" ? "Concluída" : "Em Andamento"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Novas Classes (Avaliação)</h4>
                  <div className="flex gap-2">
                    <select className="flex-1 p-2 border rounded">
                      <option>Selecione uma classe</option>
                      <option>Companheiro</option>
                      <option>Pesquisador</option>
                      <option>Pioneiro</option>
                    </select>
                    <Button>Registrar</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alterar-senha" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Alterar Usuário e Senha
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="usuario">Usuário</Label>
                <Input id="usuario" value={usuario.usuario} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="senha">Senha</Label>
                <Input id="senha" type="password" value={usuario.senha} />
              </div>
              <Button>Salvar alterações</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mestrados" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mestrados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mestrados.map((mestrado) => (
                  <Card key={mestrado.id} className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{mestrado.nome}</h4>
                        <Badge
                          variant={
                            mestrado.status === "entregue"
                              ? "default"
                              : mestrado.status === "concluido"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {mestrado.status === "entregue"
                            ? "Entregue"
                            : mestrado.status === "concluido"
                              ? "Concluído"
                              : "Em Andamento"}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>
                            {mestrado.progresso}/{mestrado.total}
                          </span>
                          <span>{Math.round((mestrado.progresso / mestrado.total) * 100)}%</span>
                        </div>
                        <Progress value={(mestrado.progresso / mestrado.total) * 100} />
                      </div>

                      <div className="space-y-2">
                        <h5 className="text-sm font-medium">Especialidades:</h5>
                        <div className="flex flex-wrap gap-1">
                          {mestrado.especialidades.map((esp, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {esp}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {mestrado.status === "concluido" && <Button size="sm">Solicitar</Button>}
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
