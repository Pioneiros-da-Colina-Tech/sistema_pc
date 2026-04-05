"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Info, FileEdit } from "lucide-react"
import InformacoesTab from "./components/informacoes"
import PostsTab from "./components/posts"

export default function ApoioPage() {
  return (
    <div className="space-y-6">
      <Card className="border-0 bg-transparent shadow-none">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-2xl font-bold">Apoio Regional</CardTitle>
          <CardDescription className="text-base">
            Canal de comunicacao e recursos da sua regiao
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="informacoes" className="space-y-6">
        <TabsList className="h-auto p-1 bg-muted/50 flex flex-wrap gap-1">
          <TabsTrigger
            value="informacoes"
            className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm px-4 py-2.5"
          >
            <Info className="h-4 w-4" />
            <span>Informacoes e Recursos</span>
          </TabsTrigger>
          <TabsTrigger
            value="gerenciar-posts"
            className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm px-4 py-2.5"
          >
            <FileEdit className="h-4 w-4" />
            <span>Gerenciar Posts</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="informacoes" className="mt-6">
          <InformacoesTab />
        </TabsContent>
        <TabsContent value="gerenciar-posts" className="mt-6">
          <PostsTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
