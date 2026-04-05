"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import NovaReuniaoTab from "./components/nova-reuniao"
import EditarReuniaoTab from "./components/editar-reuniao"
import ChamadaTab from "./components/chamada"
import { meetingsApi } from "@/lib/api"

export interface Reuniao {
  id: string
  nome: string
  data: string
}

export default function ReuniaoPage() {
  const [reunioes, setReunioes] = useState<Reuniao[]>([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    meetingsApi
      .list()
      .then((res) => {
        const mapped = res.data.map((m) => ({
          id: m.id_,
          nome: m.name,
          data: m.date,
        }))
        setReunioes(mapped)
      })
      .catch(console.error)
      .finally(() => setCarregando(false))
  }, [])

  return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Reuniões</h1>
          <p className="text-muted-foreground">Gerencie reuniões e chamadas</p>
        </div>

        {carregando ? (
          <p className="text-muted-foreground">Carregando reuniões...</p>
        ) : (
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
              <ChamadaTab reunioes={reunioes} />
            </TabsContent>
          </Tabs>
        )}
      </div>
  )
}
