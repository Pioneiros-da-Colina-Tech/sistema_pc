"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Users, FileText, Plus, Upload, Trash2, Search, Filter } from "lucide-react"

export default function SecretariaPage() {
  const [membros] = useState([
    {
      id: 1,
      nome: "João Silva",
      cpf: "123.456.789-00",
      sgc: "12345",
      unidade: "Jaguar",
      cargo: "Desbravador",
      nascimento: "2010-05-15",
    },
    {
      id: 2,
      nome: "Maria Santos",
      cpf: "987.654.321-00",
      sgc: "54321",
      unidade: "Jaguar",
      cargo: "Conselheiro",
      nascimento: "1995-08-20",
    },
    {
      id: 3,
      nome: "Pedro Costa",
      cpf: "111.222.333-44",
      sgc: "67890",
      unidade: "Gato do Mato",
      cargo: "Desbravador",
      nascimento: "2011-03-10",
    },
    {
      id: 4,
      nome: "Ana Oliveira",
      cpf: "555.666.777-88",
      sgc: "11111",
      unidade: "Gato do Mato",
      cargo: "Conselheiro",
      nascimento: "1992-12-05",
    },
    {
      id: 5,
      nome: "Carlos Ferreira",
      cpf: "999.888.777-66",
      sgc: "22222",
      unidade: "Jaguar",
      cargo: "Desbravador",
      nascimento: "2009-07-22",
    },
  ])

  const [classes] = useState([
    { id: 1, nome: "Amigo", codigo: "AM-001" },
    { id: 2, nome: "Companheiro", codigo: "CP-002" },
  ])

  const [especialidades] = useState([
    { id: 1, nome: "Internet", codigo: "AP-034", area: "ADRA" },
    { id: 2, nome: "Primeiros Socorros", codigo: "PS-001", area: "Saúde" },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [filtroUnidade, setFiltroUnidade] = useState("todas")
  const [filtroTipo, setFiltroTipo] = useState("todos")

  const membrosFiltrados = membros.filter((membro) => {
    const matchesSearch =
      membro.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      membro.cpf.includes(searchTerm) ||
      membro.sgc.includes(searchTerm)

    const matchesUnidade = filtroUnidade === "todas" || membro.unidade === filtroUnidade
    const matchesTipo = filtroTipo === "todos" || membro.cargo === filtroTipo

    return matchesSearch && matchesUnidade && matchesTipo
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Secretaria</h1>
        <p className="text-muted-foreground">Gerencie membros, classes e especialidades</p>
      </div>

      <Tabs defaultValue="membros" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="membros">Membros</TabsTrigger>
          <TabsTrigger value="atas">Atas e Atos</TabsTrigger>
          <TabsTrigger value="novo">Novo</TabsTrigger>
          <TabsTrigger value="classes">Classes e Especialidades</TabsTrigger>
          <TabsTrigger value="sentinelas">Sentinelas</TabsTrigger>
        </TabsList>

        <TabsContent value="membros" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Gerenciar Membros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Membro
                  </Button>
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Importar Membros
                  </Button>
                </div>

                {/* Barra de Pesquisa e Filtros */}
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por nome, CPF ou SGC..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <Select value={filtroUnidade} onValueChange={setFiltroUnidade}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filtrar por unidade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">Todas as Unidades</SelectItem>
                      <SelectItem value="Jaguar">Jaguar</SelectItem>
                      <SelectItem value="Gato do Mato">Gato do Mato</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filtrar por cargo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os Cargos</SelectItem>
                      <SelectItem value="Desbravador">Desbravador</SelectItem>
                      <SelectItem value="Conselheiro">Conselheiro</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("")
                      setFiltroUnidade("todas")
                      setFiltroTipo("todos")
                    }}
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Limpar Filtros
                  </Button>
                </div>

                {/* Estatísticas */}
                <div className="grid gap-4 md:grid-cols-3">
                  <Card className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{membrosFiltrados.length}</div>
                      <p className="text-sm text-muted-foreground">Membros Encontrados</p>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {membrosFiltrados.filter((m) => m.cargo === "Desbravador").length}
                      </div>
                      <p className="text-sm text-muted-foreground">Desbravadores</p>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {membrosFiltrados.filter((m) => m.cargo === "Conselheiro").length}
                      </div>
                      <p className="text-sm text-muted-foreground">Conselheiros</p>
                    </div>
                  </Card>
                </div>

                {/* Lista de Membros */}
                <div className="space-y-3">
                  {membrosFiltrados.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Nenhum membro encontrado com os filtros aplicados.</p>
                    </div>
                  ) : (
                    membrosFiltrados.map((membro) => (
                      <Card key={membro.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="font-medium">{membro.nome}</p>
                            <div className="flex gap-4 text-sm text-muted-foreground">
                              <span>CPF: {membro.cpf}</span>
                              <span>SGC: {membro.sgc}</span>
                              <span>Unidade: {membro.unidade}</span>
                              <Badge variant="secondary">{membro.cargo}</Badge>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              Editar
                            </Button>
                            <Button size="sm" variant="outline">
                              Documentos
                            </Button>
                            <Button size="sm" variant="destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="atas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Atas e Atos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="titulo-ata">Título da Ata</Label>
                  <Input id="titulo-ata" placeholder="Digite o título da ata" />
                </div>
                <div className="space-y-2">
                  <Label>Reunião</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a reunião" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="reuniao1">Reunião Geral</SelectItem>
                      <SelectItem value="reuniao2">Treinamento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea id="descricao" placeholder="Descrição da ata" rows={4} />
              </div>

              <Button>Salvar ata</Button>

              <div className="space-y-3">
                <h3 className="font-semibold">Atos Registrados</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <div>
                      <span className="font-medium">Jaguar</span> -<span className="ml-2">Especialidade concluída</span>
                    </div>
                    <span className="text-sm text-muted-foreground">Internet - João Silva</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <div>
                      <span className="font-medium">Gato do Mato</span> -<span className="ml-2">Classe investida</span>
                    </div>
                    <span className="text-sm text-muted-foreground">Amigo - Maria Santos</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="classes" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Classes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Nome da classe</Label>
                    <Input placeholder="Ex: Amigo" />
                  </div>
                  <div className="space-y-2">
                    <Label>Código da classe</Label>
                    <Input placeholder="Ex: AM-001" />
                  </div>
                </div>
                <Button>Cadastrar Classe</Button>

                <div className="space-y-2">
                  <h4 className="font-medium">Classes Cadastradas</h4>
                  {classes.map((classe) => (
                    <div key={classe.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>{classe.nome}</span>
                      <Badge variant="outline">{classe.codigo}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Especialidades</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Nome da especialidade</Label>
                    <Input placeholder="Ex: Internet" />
                  </div>
                  <div className="space-y-2">
                    <Label>Código da especialidade</Label>
                    <Input placeholder="Ex: AP-034" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Área da especialidade</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a área" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="adra">ADRA</SelectItem>
                      <SelectItem value="saude">Saúde</SelectItem>
                      <SelectItem value="natureza">Natureza</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button>Cadastrar Especialidade</Button>

                <div className="space-y-2">
                  <h4 className="font-medium">Especialidades Cadastradas</h4>
                  {especialidades.map((esp) => (
                    <div key={esp.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <div>
                        <span>{esp.nome}</span>
                        <Badge variant="outline" className="ml-2">
                          {esp.area}
                        </Badge>
                      </div>
                      <Badge variant="outline">{esp.codigo}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
