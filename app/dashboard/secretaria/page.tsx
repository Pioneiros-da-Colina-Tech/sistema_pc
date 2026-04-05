"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, GraduationCap, Shield, Award } from "lucide-react"
import MembrosTab from "./components/membros"
import AtasTab from "./components/atas"
import AssociacoesTab from "./components/associacoes"
import SentinelasTab from "./components/sentinelas"
import InvestiduraTab from "./components/investidura"

export default function SecretariaPage() {
  return (
    <div className="space-y-6">
      <Card className="border-0 bg-transparent shadow-none">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-2xl font-bold">Secretaria</CardTitle>
          <CardDescription className="text-base">
            Gerencie membros, documentos, classes e especialidades do clube
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="membros" className="space-y-6">
        <TabsList className="h-auto p-1 bg-muted/50 flex flex-wrap gap-1">
          <TabsTrigger 
            value="membros" 
            className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm px-4 py-2.5"
          >
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Membros</span>
          </TabsTrigger>
          <TabsTrigger 
            value="atas" 
            className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm px-4 py-2.5"
          >
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Atas e Atos</span>
          </TabsTrigger>
          <TabsTrigger 
            value="classes-especialidades" 
            className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm px-4 py-2.5"
          >
            <GraduationCap className="h-4 w-4" />
            <span className="hidden sm:inline">Classes e Especialidades</span>
          </TabsTrigger>
          <TabsTrigger 
            value="sentinelas" 
            className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm px-4 py-2.5"
          >
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Sentinelas</span>
          </TabsTrigger>
          <TabsTrigger 
            value="investidura" 
            className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm px-4 py-2.5"
          >
            <Award className="h-4 w-4" />
            <span className="hidden sm:inline">Investidura</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="membros" className="mt-6">
          <MembrosTab />
        </TabsContent>
        <TabsContent value="atas" className="mt-6">
          <AtasTab />
        </TabsContent>
        <TabsContent value="classes-especialidades" className="mt-6">
          <AssociacoesTab />
        </TabsContent>
        <TabsContent value="sentinelas" className="mt-6">
          <SentinelasTab />
        </TabsContent>
        <TabsContent value="investidura" className="mt-6">
          <InvestiduraTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
