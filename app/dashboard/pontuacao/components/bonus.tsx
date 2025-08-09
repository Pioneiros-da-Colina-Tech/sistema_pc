"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircle } from "lucide-react"


const unidadesMock = [
  { id: 1, nome: "Jaguar" },
  { id: 2, nome: "Gato do Mato" },
]

const membrosMock = [
  { id: 1, codigo_sgc: "12345", nome: "João Silva", id_unidade: 1 },
  { id: 2, codigo_sgc: "54321", nome: "Maria Santos", id_unidade: 1 },
  { id: 3, codigo_sgc: "67890", nome: "Pedro Costa", id_unidade: 2 },
]

export default function Bonus() {
  const [tipo, setTipo] = useState<"unidade" | "membro">("unidade")
  const [unidadeId, setUnidadeId] = useState<string | undefined>()
  const [membroId, setMembroId] = useState<string | undefined>()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><PlusCircle /> Lançar Ponto Bônus</CardTitle>
        <CardDescription>Adicione pontos por unidade ou por membro individualmente.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
            <Label>Tipo de Lançamento</Label>
            <Select onValueChange={(value: "unidade" | "membro") => setTipo(value)} defaultValue="unidade">
                <SelectTrigger className="w-64">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="unidade">Por Unidade</SelectItem>
                    <SelectItem value="membro">Por Membro</SelectItem>
                </SelectContent>
            </Select>
        </div>

        {tipo === "unidade" && (
            <div className="space-y-2">
                <Label>Unidade</Label>
                <Select onValueChange={setUnidadeId}>
                    <SelectTrigger className="w-64">
                        <SelectValue placeholder="Selecione a unidade" />
                    </SelectTrigger>
                    <SelectContent>
                        {unidadesMock.map(u => <SelectItem key={u.id} value={u.id.toString()}>{u.nome}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
        )}

        {tipo === "membro" && (
            <div className="space-y-2">
                <Label>Membro</Label>
                <Select onValueChange={setMembroId}>
                    <SelectTrigger className="w-64">
                        <SelectValue placeholder="Selecione o membro" />
                    </SelectTrigger>
                    <SelectContent>
                        {membrosMock.map(m => <SelectItem key={m.id} value={m.id.toString()}>{m.nome}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="pontos">Pontos</Label>
                <Input id="pontos" type="number" placeholder="Ex: 50" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea id="descricao" placeholder="Descreva o motivo do bônus" />
            </div>
        </div>
        <Button>Lançar Bônus</Button>
      </CardContent>
    </Card>
  )
}