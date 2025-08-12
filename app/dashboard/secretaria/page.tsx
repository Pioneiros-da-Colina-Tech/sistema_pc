"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import MembrosTab from "./components/membros"
import AtasTab from "./components/atas"
import AssociacoesTab from "./components/associacoes"
import SentinelasTab from "./components/sentinelas"

export default function SecretariaPage() {
  return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Secretaria</h1>
          <p className="text-muted-foreground">Gerencie membros, classes e especialidades</p>
        </div>

        <Tabs defaultValue="membros" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="membros">Membros</TabsTrigger>
            <TabsTrigger value="atas">Atas e Atos</TabsTrigger>
            <TabsTrigger value="classes-especialidades">Classes e Especialidades</TabsTrigger>
            <TabsTrigger value="sentinelas">Sentinelas</TabsTrigger>
          </TabsList>

          <TabsContent value="membros" className="space-y-4">
            <MembrosTab />
          </TabsContent>
          <TabsContent value="atas" className="space-y-4">
            <AtasTab />
          </TabsContent>
          <TabsContent value="classes-especialidades" className="space-y-4">
            <AssociacoesTab />
          </TabsContent>
          <TabsContent value="sentinelas" className="space-y-4">
            <SentinelasTab />
          </TabsContent>
        </Tabs>
      </div>
  )
}