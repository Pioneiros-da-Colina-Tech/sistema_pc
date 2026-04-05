"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Award, GraduationCap, Shield } from "lucide-react"
import Especialidade from "./components/especialidades"
import Classe from "./components/classe"
import SentinelasDaColina from "./components/sentinelas"

export default function RegionalPage() {
  return (
    <div className="space-y-6">
      <Card className="border-0 bg-transparent shadow-none">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-2xl font-bold">Avaliacao Regional</CardTitle>
          <CardDescription className="text-base">
            Avalie especialidades e classes dos membros
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="especialidades" className="space-y-6">
        <TabsList className="h-auto p-1 bg-muted/50 flex flex-wrap gap-1">
          <TabsTrigger
            value="especialidades"
            className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm px-4 py-2.5"
          >
            <Award className="h-4 w-4" />
            <span>Especialidades</span>
          </TabsTrigger>
          <TabsTrigger
            value="classes"
            className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm px-4 py-2.5"
          >
            <GraduationCap className="h-4 w-4" />
            <span>Classes</span>
          </TabsTrigger>
          <TabsTrigger
            value="sentinelas"
            className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm px-4 py-2.5"
          >
            <Shield className="h-4 w-4" />
            <span>Sentinelas da Colina</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="especialidades" className="mt-6">
          <Especialidade />
        </TabsContent>
        <TabsContent value="classes" className="mt-6">
          <Classe />
        </TabsContent>
        <TabsContent value="sentinelas" className="mt-6">
          <SentinelasDaColina />
        </TabsContent>
      </Tabs>
    </div>
  )
}
