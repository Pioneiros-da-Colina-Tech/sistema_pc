"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Award, BookOpen, FileText } from "lucide-react"

// Importe o novo componente
import EspecialidadesTab from "./components/especialidades"
import ClassesTab from "./components/classes"
import MestradosTab from "./components/mestrados"
import EventosTab from "./components/eventos"
import FinanceiroTab from "./components/financeiro"
import AlterarSenhaTab from "./components/alterar-senha"
import DocumentosTab from "./components/documentos" // <-- IMPORTAR NOVO COMPONENTE

// Mock data para os cards de resumo
const minhasClassesMock = [
    { id: 1, nome: "Amigo", codigo: "AM-001", status: "investida" },
    { id: 2, nome: "Companheiro", codigo: "CP-002", status: "em-avaliacao" },
]
const minhasEspecialidadesMock = [
    { id: 1, nome: "Internet", codigo: "AP-034", status: "concluida" },
    { id: 2, nome: "Primeiros Socorros", codigo: "PS-001", status: "em-andamento" },
]
const mestradosMock = [
    { id: 1, nome: "Especialidades Técnicas", progresso: 2, total: 7, status: "em-andamento" },
    { id: 2, nome: "Especialidades de Saúde", progresso: 7, total: 7, status: "concluido" },
]

export default function PainelPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Meu Painel</h1>
                <p className="text-muted-foreground">Acompanhe seu progresso pessoal</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Classes</CardTitle><BookOpen className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{minhasClassesMock.length}</div><p className="text-xs text-muted-foreground">Registradas</p></CardContent></Card>
                <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Especialidades</CardTitle><Award className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{minhasEspecialidadesMock.length}</div><p className="text-xs text-muted-foreground">Registradas</p></CardContent></Card>
                <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Mestrados</CardTitle><Award className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{mestradosMock.filter((m) => m.status === "concluido").length}</div><p className="text-xs text-muted-foreground">Concluídos</p></CardContent></Card>
            </div>

            <Tabs defaultValue="especialidades" className="space-y-4">
                <TabsList className="grid w-full grid-cols-7"> {/* <-- ALTERAR PARA grid-cols-7 */}
                    <TabsTrigger value="especialidades">Especialidades</TabsTrigger>
                    <TabsTrigger value="classes">Classes</TabsTrigger>
                    <TabsTrigger value="mestrados">Mestrados</TabsTrigger>
                    <TabsTrigger value="documentos">Documentos</TabsTrigger> {/* <-- NOVA ABA */}
                    <TabsTrigger value="eventos">Eventos</TabsTrigger>
                    <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
                    <TabsTrigger value="alterar-senha">Alterar senha</TabsTrigger>
                </TabsList>

                <TabsContent value="especialidades"><EspecialidadesTab /></TabsContent>
                <TabsContent value="classes"><ClassesTab /></TabsContent>
                <TabsContent value="mestrados"><MestradosTab /></TabsContent>
                <TabsContent value="documentos"><DocumentosTab /></TabsContent> {/* <-- CONTEÚDO DA NOVA ABA */}
                <TabsContent value="eventos"><EventosTab /></TabsContent>
                <TabsContent value="financeiro"><FinanceiroTab /></TabsContent>
                <TabsContent value="alterar-senha"><AlterarSenhaTab /></TabsContent>
            </Tabs>
        </div>
    )
}