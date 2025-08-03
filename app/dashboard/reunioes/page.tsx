"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Edit, Trash2 } from "lucide-react"

export default function ReuniaoPage() {
  const [reunioes, setReunioes] = useState([
    { id: 1, nome: "Reunião Geral", data: "2025-01-25" },
    { id: 2, nome: "Treinamento", data: "2025-01-28" },
  ])

  const [novaReuniao, setNovaReuniao] = useState({ nome: "", data: "" })
  const [editandoReuniao, setEditandoReuniao] = useState(null)
  const [reuniaoSelecionada, setReuniaoSelecionada] = useState(null)

  const membros = [
    { id: 1, nome: "João Silva", unidade: "Jaguar", cargo: "Desbravador" },
    { id: 2, nome: "Maria Santos", unidade: "Jaguar", cargo: "Conselheiro" },
    { id: 3, nome: "Pedro Costa", unidade: "Gato do Mato", cargo: "Desbravador" },
  ]

  const adicionarReuniao = () => {
    if (novaReuniao.nome && novaReuniao.data) {
      setReunioes([
        ...reunioes,
        {
          id: Date.now(),
          nome: novaReuniao.nome,
          data: novaReuniao.data,
        },
      ])
      setNovaReuniao({ nome: "", data: "" })
    }
  }

  const removerReuniao = (id: number) => {
    setReunioes(reunioes.filter((r) => r.id !== id))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reuniões</h1>
        <p className="text-muted-foreground">Gerencie reuniões e chamadas</p>
      </div>

      <Tabs defaultValue="nova" className="space-y-4">
        <TabsList>
          <TabsTrigger value="nova">Nova</TabsTrigger>
          <TabsTrigger value="editar">Editar</TabsTrigger>
          <TabsTrigger value="chamada">Chamada</TabsTrigger>
        </TabsList>

        <TabsContent value="nova" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Nova Reunião
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome</Label>
                  <Input
                    id="nome"
                    value={novaReuniao.nome}
                    onChange={(e) => setNovaReuniao({ ...novaReuniao, nome: e.target.value })}
                    placeholder="Nome da reunião"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="data">Data</Label>
                  <Input
                    id="data"
                    type="date"
                    value={novaReuniao.data}
                    onChange={(e) => setNovaReuniao({ ...novaReuniao, data: e.target.value })}
                  />
                </div>
              </div>
              <Button onClick={adicionarReuniao}>Cadastrar</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="editar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5" />
                Editar Reunião
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Selecione a reunião</Label>
                <Select
                  onValueChange={(value) => setEditandoReuniao(reunioes.find((r) => r.id === Number.parseInt(value)))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Escolha uma reunião" />
                  </SelectTrigger>
                  <SelectContent>
                    {reunioes.map((reuniao) => (
                      <SelectItem key={reuniao.id} value={reuniao.id.toString()}>
                        {reuniao.nome} - {reuniao.data}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {editandoReuniao && (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Novo nome</Label>
                    <Input
                      value={editandoReuniao.nome}
                      onChange={(e) => setEditandoReuniao({ ...editandoReuniao, nome: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Nova data</Label>
                    <Input
                      type="date"
                      value={editandoReuniao.data}
                      onChange={(e) => setEditandoReuniao({ ...editandoReuniao, data: e.target.value })}
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button>Salvar edição</Button>
                <Button variant="destructive" onClick={() => editandoReuniao && removerReuniao(editandoReuniao.id)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remover reunião
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chamada" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Chamada</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Unidade</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a unidade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="jaguar">Jaguar</SelectItem>
                      <SelectItem value="gato-mato">Gato do Mato</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Reunião</Label>
                  <Select onValueChange={(value) => setReuniaoSelecionada(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a reunião" />
                    </SelectTrigger>
                    <SelectContent>
                      {reunioes.map((reuniao) => (
                        <SelectItem key={reuniao.id} value={reuniao.id.toString()}>
                          {reuniao.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {reuniaoSelecionada && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Lista de Presença</h3>
                  <div className="space-y-3">
                    {membros.map((membro) => (
                      <Card key={membro.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{membro.nome}</p>
                            <p className="text-sm text-muted-foreground">{membro.cargo}</p>
                          </div>
                          <div className="flex gap-4">
                            <div className="flex items-center space-x-2">
                              <Checkbox id={`presenca-${membro.id}`} />
                              <Label htmlFor={`presenca-${membro.id}`}>Presença</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id={`justificada-${membro.id}`} />
                              <Label htmlFor={`justificada-${membro.id}`}>Justificada</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id={`pontualidade-${membro.id}`} />
                              <Label htmlFor={`pontualidade-${membro.id}`}>Pontualidade</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id={`uniforme-${membro.id}`} />
                              <Label htmlFor={`uniforme-${membro.id}`}>Uniforme</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id={`modestia-${membro.id}`} />
                              <Label htmlFor={`modestia-${membro.id}`}>Modéstia</Label>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                  <Button>Salvar chamada</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
