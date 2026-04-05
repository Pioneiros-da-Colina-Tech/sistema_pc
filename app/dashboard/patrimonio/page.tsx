"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingCart, FileText } from "lucide-react"
import GerenciarPatrimonioTab from "./components/gerenciar"
import SolicitarMateriaisTab from "./components/solicitar"
import SolicitacoesTab from "./components/solicitacoes"

export default function PatrimonioPage() {
  return (
    <div className="space-y-6">
      <Card className="border-0 bg-transparent shadow-none">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-2xl font-bold">Patrimonio</CardTitle>
          <CardDescription className="text-base">
            Gerencie os materiais e solicitacoes do clube
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="gerenciar" className="space-y-6">
        <TabsList className="h-auto p-1 bg-muted/50 flex flex-wrap gap-1">
          <TabsTrigger
            value="gerenciar"
            className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm px-4 py-2.5"
          >
            <Package className="h-4 w-4" />
            <span>Gerenciar Patrimonio</span>
          </TabsTrigger>
          <TabsTrigger
            value="solicitar"
            className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm px-4 py-2.5"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Solicitar Materiais</span>
          </TabsTrigger>
          <TabsTrigger
            value="solicitacoes"
            className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm px-4 py-2.5"
          >
            <FileText className="h-4 w-4" />
            <span>Solicitacoes</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="gerenciar" className="mt-6">
          <GerenciarPatrimonioTab />
        </TabsContent>
        <TabsContent value="solicitar" className="mt-6">
          <SolicitarMateriaisTab />
        </TabsContent>
        <TabsContent value="solicitacoes" className="mt-6">
          <SolicitacoesTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
