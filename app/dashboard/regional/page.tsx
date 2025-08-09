import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Especialidade from "./components/especialidades" // <- MUDANÇA AQUI
import Classe from "./components/classe"             // <- MUDANÇA AQUI

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
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="especialidades">Especialidades</TabsTrigger>
                    <TabsTrigger value="classes">Classes</TabsTrigger>
                </TabsList>
                <TabsContent value="especialidades">
                    <Especialidade />
                </TabsContent>
                <TabsContent value="classes">
                    <Classe />
                </TabsContent>
            </Tabs>
        </div>
    )
}