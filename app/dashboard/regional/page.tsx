"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Especialidade from "./components/especialidades"
import Classe from "./components/classe"
import SentinelasDaColina from "./components/sentinelas" // <-- IMPORTAR NOVO COMPONENTE

export default function RegionalPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Avaliação Regional</h1>
                <p className="text-muted-foreground">
                    Escolha uma aba para avaliar especialidades ou classes.
                </p>
            </div>
            <Tabs defaultValue="especialidades">
                <TabsList className="grid w-full grid-cols-3"> {/* <-- ALTERAR PARA grid-cols-3 */}
                    <TabsTrigger value="especialidades">Especialidades</TabsTrigger>
                    <TabsTrigger value="classes">Classes</TabsTrigger>
                    <TabsTrigger value="sentinelas">Sentinelas da Colina</TabsTrigger> {/* <-- NOVA ABA */}
                </TabsList>
                <TabsContent value="especialidades">
                    <Especialidade />
                </TabsContent>
                <TabsContent value="classes">
                    <Classe />
                </TabsContent>
                <TabsContent value="sentinelas">
                    <SentinelasDaColina /> {/* <-- CONTEÚDO DA NOVA ABA */}
                </TabsContent>
            </Tabs>
        </div>
    )
}