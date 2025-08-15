"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import NovaReuniaoTab from "./components/nova-reuniao"
import EditarReuniaoTab from "./components/editar-reuniao"
import ChamadaTab from "./components/chamada"

export default function ReuniaoPage() {
  const [reunioes, setReunioes] = useState([
    { id: 1, nome: "Reunião Geral", data: "2025-01-25" },
    { id: 2, nome: "Treinamento", data: "2025-01-28" },
  ])

  const membros = [
    { id: 1, nome: "João Silva", unidade: "Jaguar", cargo: "Desbravador" },
    { id: 2, nome: "Maria Santos", unidade: "Jaguar", cargo: "Conselheiro" },
    { id: 3, nome: "Pedro Costa", unidade: "Gato do Mato", cargo: "Desbravador" },
  ]

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
            <NovaReuniaoTab reunioes={reunioes} setReunioes={setReunioes} />
          </TabsContent>

          <TabsContent value="editar" className="space-y-4">
            <EditarReuniaoTab reunioes={reunioes} setReunioes={setReunioes} />
          </TabsContent>

          <TabsContent value="chamada" className="space-y-4">
            <ChamadaTab reunioes={reunioes} membros={membros} />
          </TabsContent>
        </Tabs>
      </div>
  )
}