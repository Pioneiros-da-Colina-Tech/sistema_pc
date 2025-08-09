import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Ranking from "./components/ranking"
import Bonus from "./components/bonus"

export default function PontuacaoPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Pontuação</h1>
                <p className="text-muted-foreground">
                    Acompanhe o ranking e adicione pontos bônus.
                </p>
            </div>
            <Tabs defaultValue="ranking">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="ranking">Ranking e Pontuação</TabsTrigger>
                    <TabsTrigger value="bonus">Lançar Bônus</TabsTrigger>
                </TabsList>
                <TabsContent value="ranking">
                    <Ranking />
                </TabsContent>
                <TabsContent value="bonus">
                    <Bonus />
                </TabsContent>
            </Tabs>
        </div>
    )
}