import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, TrendingUp, TrendingDown, PieChart } from "lucide-react"

export default function TesourariaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tesouraria</h1>
        <p className="text-muted-foreground">Controle financeiro da organização</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receitas</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">R$ 2.450,00</div>
            <p className="text-xs text-muted-foreground">Este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Despesas</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">R$ 1.850,00</div>
            <p className="text-xs text-muted-foreground">Este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 600,00</div>
            <p className="text-xs text-muted-foreground">Disponível</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orçamento</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">75%</div>
            <p className="text-xs text-muted-foreground">Utilizado</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Receitas Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                <div>
                  <p className="font-medium">Mensalidades</p>
                  <p className="text-sm text-muted-foreground">Janeiro 2025</p>
                </div>
                <span className="font-bold text-green-600">R$ 1.200,00</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                <div>
                  <p className="font-medium">Doações</p>
                  <p className="text-sm text-muted-foreground">Campanha de inverno</p>
                </div>
                <span className="font-bold text-green-600">R$ 800,00</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                <div>
                  <p className="font-medium">Eventos</p>
                  <p className="text-sm text-muted-foreground">Acampamento</p>
                </div>
                <span className="font-bold text-green-600">R$ 450,00</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Despesas Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-red-50 rounded">
                <div>
                  <p className="font-medium">Material Didático</p>
                  <p className="text-sm text-muted-foreground">Livros e apostilas</p>
                </div>
                <span className="font-bold text-red-600">R$ 650,00</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 rounded">
                <div>
                  <p className="font-medium">Equipamentos</p>
                  <p className="text-sm text-muted-foreground">Barracas e cordas</p>
                </div>
                <span className="font-bold text-red-600">R$ 800,00</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 rounded">
                <div>
                  <p className="font-medium">Transporte</p>
                  <p className="text-sm text-muted-foreground">Ônibus para acampamento</p>
                </div>
                <span className="font-bold text-red-600">R$ 400,00</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
