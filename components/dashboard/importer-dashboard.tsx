"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calculator, TrendingUp, FileText, CreditCard, Package, Eye, Download } from "lucide-react"
import Link from "next/link"

export function ImporterDashboard() {
  const recentPIBs = [
    { id: "PIB-2024-001234", goods: "Laptop ASUS ROG Strix", status: "in-progress", value: "$25,000" },
    { id: "PIB-2024-001235", goods: "Smartphone Samsung", status: "completed", value: "$15,000" },
    { id: "PIB-2024-001236", goods: "Server Dell PowerEdge", status: "delayed", value: "$45,000" },
  ]

  const quickStats = {
    totalPIBs: 12,
    inProgress: 3,
    completed: 8,
    totalValue: "$180,000",
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <Card className="border-0 shadow-lg gradient-bg text-primary-foreground">
        <CardHeader className="pb-8">
          <CardTitle className="text-3xl mb-2">Selamat Datang, PT. Teknologi Maju</CardTitle>
          <CardDescription className="text-primary-foreground/80 text-lg">
            Dashboard Importir - Kelola proses impor Anda dengan mudah dan efisien
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <Link href="/tax-calculator">
          <Card className="card-hover border-0 shadow-lg bg-gradient-to-br from-card to-muted/30">
            <CardContent className="pt-8 pb-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center shadow-lg">
                  <Calculator className="h-8 w-8 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Hitung Pajak Baru</h3>
                  <p className="text-sm text-muted-foreground">AI-powered tax calculation</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/pib-submission">
          <Card className="card-hover border-0 shadow-lg bg-gradient-to-br from-card to-muted/30">
            <CardContent className="pt-8 pb-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-secondary to-accent rounded-2xl flex items-center justify-center shadow-lg">
                  <FileText className="h-8 w-8 text-secondary-foreground" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Submit PIB Baru</h3>
                  <p className="text-sm text-muted-foreground">Ajukan PIB ke Bea Cukai</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/tracking">
          <Card className="card-hover border-0 shadow-lg bg-gradient-to-br from-card to-muted/30">
            <CardContent className="pt-8 pb-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-accent to-primary rounded-2xl flex items-center justify-center shadow-lg">
                  <TrendingUp className="h-8 w-8 text-accent-foreground" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Lacak Status PIB</h3>
                  <p className="text-sm text-muted-foreground">Monitor real-time progress</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Statistics */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/10 to-primary/5">
          <CardContent className="pt-8 pb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 gradient-bg rounded-xl flex items-center justify-center shadow-lg">
                <Package className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">{quickStats.totalPIBs}</p>
                <p className="text-sm text-muted-foreground font-medium">Total PIB</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg bg-gradient-to-br from-secondary/10 to-secondary/5">
          <CardContent className="pt-8 pb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-secondary to-accent rounded-xl flex items-center justify-center shadow-lg">
                <TrendingUp className="h-6 w-6 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-3xl font-bold text-secondary">{quickStats.inProgress}</p>
                <p className="text-sm text-muted-foreground font-medium">Dalam Proses</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg bg-gradient-to-br from-accent/10 to-accent/5">
          <CardContent className="pt-8 pb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-accent to-primary rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="h-6 w-6 text-accent-foreground" />
              </div>
              <div>
                <p className="text-3xl font-bold text-accent">{quickStats.completed}</p>
                <p className="text-sm text-muted-foreground font-medium">Selesai</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg bg-gradient-to-br from-muted to-card">
          <CardContent className="pt-8 pb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-muted-foreground/20 to-muted-foreground/10 rounded-xl flex items-center justify-center shadow-lg">
                <CreditCard className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">{quickStats.totalValue}</p>
                <p className="text-sm text-muted-foreground font-medium">Total Nilai</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent PIBs */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl mb-2">PIB Terbaru</CardTitle>
              <CardDescription className="text-base">Status terkini dari pengajuan PIB Anda</CardDescription>
            </div>
            <Link href="/tracking">
              <Button variant="outline" size="sm" className="hover:bg-primary/5 shadow-sm bg-transparent">
                <Eye className="h-4 w-4 mr-2" />
                Lihat Semua
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentPIBs.map((pib) => (
              <div
                key={pib.id}
                className="flex items-center justify-between p-6 border rounded-xl card-hover bg-gradient-to-r from-card to-muted/30"
              >
                <div className="flex-1">
                  <h4 className="font-bold text-lg mb-1">{pib.id}</h4>
                  <p className="text-muted-foreground mb-2">{pib.goods}</p>
                  <p className="font-semibold text-primary">{pib.value}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge
                    variant={
                      pib.status === "completed"
                        ? "secondary"
                        : pib.status === "in-progress"
                          ? "default"
                          : "destructive"
                    }
                    className="shadow-sm"
                  >
                    {pib.status === "completed" ? "Selesai" : pib.status === "in-progress" ? "Proses" : "Tertunda"}
                  </Badge>
                  <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
