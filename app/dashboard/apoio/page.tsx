"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InformacoesTab from "./components/informacoes";
import PostsTab from "./components/posts";

export default function ApoioPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Apoio Regional</h1>
                <p className="text-muted-foreground">Canal de comunicação e recursos da sua região.</p>
            </div>

            <Tabs defaultValue="informacoes">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="informacoes">Informações e Recursos</TabsTrigger>
                    <TabsTrigger value="gerenciar-posts">Gerenciar Posts</TabsTrigger>
                </TabsList>

                <TabsContent value="informacoes">
                    <InformacoesTab />
                </TabsContent>
                <TabsContent value="gerenciar-posts">
                    <PostsTab />
                </TabsContent>
            </Tabs>
        </div>
    )
}