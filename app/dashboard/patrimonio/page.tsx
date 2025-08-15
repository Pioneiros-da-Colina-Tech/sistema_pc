"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import GerenciarPatrimonioTab from "./components/gerenciar"
import SolicitarMateriaisTab from "./components/solicitar"
import SolicitacoesTab from "./components/solicitacoes"

export default function PatrimonioPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Patrimônio</h1>
                <p className="text-muted-foreground">Gerencie os materiais e solicitações do clube.</p>
            </div>

            <Tabs defaultValue="gerenciar" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="gerenciar">Gerenciar Patrimônio</TabsTrigger>
                    <TabsTrigger value="solicitar">Solicitar Materiais</TabsTrigger>
                    <TabsTrigger value="solicitacoes">Solicitações de Materiais</TabsTrigger>
                </TabsList>

                <TabsContent value="gerenciar">
                    <GerenciarPatrimonioTab />
                </TabsContent>
                <TabsContent value="solicitar">
                    <SolicitarMateriaisTab />
                </TabsContent>
                <TabsContent value="solicitacoes">
                    <SolicitacoesTab />
                </TabsContent>
            </Tabs>
        </div>
    )
}