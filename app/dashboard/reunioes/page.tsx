"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarPlus, Edit, ClipboardList, Loader2 } from "lucide-react"
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
      <Card className="border-0 bg-transparent shadow-none">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-2xl font-bold">Reunioes</CardTitle>
          <CardDescription className="text-base">
            Gerencie reunioes e faca a chamada dos membros
          </CardDescription>
        </CardHeader>
      </Card>

      {carregando ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Carregando reunioes...</span>
        </div>
      ) : (
        <Tabs defaultValue="nova" className="space-y-6">
          <TabsList className="h-auto p-1 bg-muted/50 flex flex-wrap gap-1">
            <TabsTrigger
              value="nova"
              className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm px-4 py-2.5"
            >
              <CalendarPlus className="h-4 w-4" />
              <span>Nova Reuniao</span>
            </TabsTrigger>
            <TabsTrigger
              value="editar"
              className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm px-4 py-2.5"
            >
              <Edit className="h-4 w-4" />
              <span>Editar</span>
            </TabsTrigger>
            <TabsTrigger
              value="chamada"
              className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm px-4 py-2.5"
            >
              <ClipboardList className="h-4 w-4" />
              <span>Chamada</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="nova" className="mt-6">
            <NovaReuniaoTab reunioes={reunioes} setReunioes={setReunioes} />
          </TabsContent>

          <TabsContent value="editar" className="mt-6">
            <EditarReuniaoTab reunioes={reunioes} setReunioes={setReunioes} />
          </TabsContent>

          <TabsContent value="chamada" className="mt-6">
            <ChamadaTab reunioes={reunioes} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
