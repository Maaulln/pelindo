"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, Users, FileText, AlertTriangle, CheckCircle, Clock, Plus, Eye } from "lucide-react"
import Link from "next/link"

export function PPJKDashboard() {
  const clients = [
    { name: "PT. Teknologi Maju", activePIBs: 3, status: "active" },
    { name: "CV. Elektronik Sejahtera", activePIBs: 1, status: "active" },
    { name: "PT. Industri Digital", activePIBs: 2, status: "pending" },
    { name: "UD. Komputer Nusantara", activePIBs: 0, status: "inactive" },
  ]

  const urgentTasks = [
    { client: "PT. Teknologi Maju", task: "Verifikasi dokumen PIB-2024-001234", priority: "high" },
    { client: "CV. Elektronik Sejahtera", task: "Koordinasi dengan Bea Cukai", priority: "medium" },
    { client: "PT. Industri Digital", task: "Pembayaran tertunda", priority: "high" },
  ]

  const quickStats = {
    totalClients: 15,
    activePIBs: 8,
    pendingApprovals: 3,
    completedToday: 5,
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Dashboard PPJK - CV. Bea Cukai Profesional</CardTitle>
          <CardDescription>Kelola multiple client dan koordinasi proses kepabeanan dengan efisien</CardDescription>
        </CardHeader>
      </Card>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Client Baru</h3>
                <p className="text-sm text-muted-foreground">Tambah client</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <h3 className="font-semibold">Proses PIB</h3>
                <p className="text-sm text-muted-foreground">Handle submissions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold">Koordinasi BC</h3>
                <p className="text-sm text-muted-foreground">Bea Cukai liaison</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Link href="/tracking">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Eye className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Monitor Status</h3>
                  <p className="text-sm text-muted-foreground">Track all PIBs</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Statistics */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{quickStats.totalClients}</p>
                <p className="text-xs text-muted-foreground">Total Client</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-secondary" />
              <div>
                <p className="text-2xl font-bold">{quickStats.activePIBs}</p>
                <p className="text-xs text-muted-foreground">PIB Aktif</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-destructive" />
              <div>
                <p className="text-2xl font-bold">{quickStats.pendingApprovals}</p>
                <p className="text-xs text-muted-foreground">Perlu Approval</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-accent" />
              <div>
                <p className="text-2xl font-bold">{quickStats.completedToday}</p>
                <p className="text-xs text-muted-foreground">Selesai Hari Ini</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Client Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Manajemen Client</CardTitle>
                <CardDescription>Daftar client dan status PIB aktif</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Tambah Client
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {clients.map((client, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold">{client.name}</h4>
                    <p className="text-sm text-muted-foreground">{client.activePIBs} PIB aktif</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge
                      variant={
                        client.status === "active" ? "secondary" : client.status === "pending" ? "default" : "outline"
                      }
                    >
                      {client.status === "active" ? "Aktif" : client.status === "pending" ? "Pending" : "Tidak Aktif"}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Urgent Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <span>Tugas Mendesak</span>
            </CardTitle>
            <CardDescription>Task yang memerlukan perhatian segera</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {urgentTasks.map((task, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-sm">{task.client}</h4>
                    <Badge variant={task.priority === "high" ? "destructive" : "default"} className="text-xs">
                      {task.priority === "high" ? "Tinggi" : "Sedang"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{task.task}</p>
                  <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                    Tangani
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
