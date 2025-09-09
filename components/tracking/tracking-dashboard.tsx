"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  TrendingUp,
  Search,
  Filter,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileText,
  CreditCard,
  Shield,
  Truck,
  Bell,
  Calendar,
  Package,
} from "lucide-react"
import { LiveStatusIndicator } from "@/components/realtime/live-status-indicator"
import { ActivityFeed } from "@/components/realtime/activity-feed"

interface PIBStatus {
  id: string
  pibNumber: string
  importerName: string
  goodsDescription: string
  value: number
  submissionDate: string
  currentStage: "submitted" | "payment" | "customs" | "sppb"
  status: "completed" | "in-progress" | "delayed" | "pending"
  stages: {
    submitted: { completed: boolean; timestamp?: string; status: "completed" | "in-progress" | "delayed" }
    payment: { completed: boolean; timestamp?: string; status: "completed" | "in-progress" | "delayed" }
    customs: { completed: boolean; timestamp?: string; status: "completed" | "in-progress" | "delayed" }
    sppb: { completed: boolean; timestamp?: string; status: "completed" | "in-progress" | "delayed" }
  }
  notifications: string[]
}

const mockPIBData: PIBStatus[] = [
  {
    id: "PIB001",
    pibNumber: "PIB-2024-001234",
    importerName: "PT. Teknologi Maju",
    goodsDescription: "Laptop ASUS ROG Strix Gaming",
    value: 25000,
    submissionDate: "2024-01-15",
    currentStage: "customs",
    status: "in-progress",
    stages: {
      submitted: { completed: true, timestamp: "2024-01-15 09:30", status: "completed" },
      payment: { completed: true, timestamp: "2024-01-15 10:15", status: "completed" },
      customs: { completed: false, timestamp: "2024-01-15 11:00", status: "in-progress" },
      sppb: { completed: false, status: "pending" },
    },
    notifications: ["Dokumen sedang diverifikasi oleh Bea Cukai", "Estimasi selesai: 2 jam lagi"],
  },
  {
    id: "PIB002",
    pibNumber: "PIB-2024-001235",
    importerName: "CV. Elektronik Sejahtera",
    goodsDescription: "Smartphone Samsung Galaxy S24",
    value: 15000,
    submissionDate: "2024-01-14",
    currentStage: "sppb",
    status: "completed",
    stages: {
      submitted: { completed: true, timestamp: "2024-01-14 08:45", status: "completed" },
      payment: { completed: true, timestamp: "2024-01-14 09:30", status: "completed" },
      customs: { completed: true, timestamp: "2024-01-14 14:20", status: "completed" },
      sppb: { completed: true, timestamp: "2024-01-14 15:45", status: "completed" },
    },
    notifications: ["SPPB telah diterbitkan", "Armada siap dijadwalkan untuk pengambilan"],
  },
  {
    id: "PIB003",
    pibNumber: "PIB-2024-001236",
    importerName: "PT. Industri Digital",
    goodsDescription: "Server Dell PowerEdge R750",
    value: 45000,
    submissionDate: "2024-01-13",
    currentStage: "payment",
    status: "delayed",
    stages: {
      submitted: { completed: true, timestamp: "2024-01-13 10:00", status: "completed" },
      payment: { completed: false, timestamp: "2024-01-13 11:30", status: "delayed" },
      customs: { completed: false, status: "pending" },
      sppb: { completed: false, status: "pending" },
    },
    notifications: ["Pembayaran tertunda", "Harap segera lakukan pembayaran untuk melanjutkan proses"],
  },
]

export function TrackingDashboard() {
  const [selectedPIB, setSelectedPIB] = useState<PIBStatus | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [pibData, setPibData] = useState(mockPIBData)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setPibData((prevData) => {
        const updatedData = [...prevData]

        if (Math.random() > 0.7) {
          const randomIndex = Math.floor(Math.random() * updatedData.length)
          const pib = updatedData[randomIndex]

          if (pib.currentStage === "customs" && pib.status === "in-progress") {
            updatedData[randomIndex] = {
              ...pib,
              currentStage: "sppb",
              status: "completed",
              stages: {
                ...pib.stages,
                customs: { completed: true, timestamp: new Date().toLocaleString(), status: "completed" },
                sppb: { completed: true, timestamp: new Date().toLocaleString(), status: "completed" },
              },
              notifications: ["SPPB telah diterbitkan", "Armada siap dijadwalkan untuk pengambilan"],
            }
          }
        }

        setLastUpdate(new Date())
        return updatedData
      })
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: "completed" | "in-progress" | "delayed" | "pending") => {
    switch (status) {
      case "completed":
        return "text-secondary"
      case "in-progress":
        return "text-primary"
      case "delayed":
        return "text-destructive"
      case "pending":
        return "text-muted-foreground"
    }
  }

  const getStatusIcon = (status: "completed" | "in-progress" | "delayed" | "pending") => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5" />
      case "in-progress":
        return <div className="h-5 w-5 rounded-full bg-primary animate-pulse" />
      case "delayed":
        return <AlertTriangle className="h-5 w-5" />
      case "pending":
        return <div className="h-5 w-5 rounded-full bg-muted" />
    }
  }

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case "submitted":
        return <FileText className="h-4 w-4" />
      case "payment":
        return <CreditCard className="h-4 w-4" />
      case "customs":
        return <Shield className="h-4 w-4" />
      case "sppb":
        return <Truck className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  const getStageName = (stage: string) => {
    switch (stage) {
      case "submitted":
        return "PIB Submitted"
      case "payment":
        return "Payment Processed"
      case "customs":
        return "Customs Response"
      case "sppb":
        return "SPPB Issued"
      default:
        return stage
    }
  }

  const filteredPIBs = pibData.filter((pib) => {
    const matchesSearch =
      pib.pibNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pib.importerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pib.goodsDescription.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || pib.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <CardTitle className="text-2xl">Integrated Tracking Dashboard</CardTitle>
                <CardDescription>Monitor status PIB dan proses kepabeanan secara real-time</CardDescription>
              </div>
            </div>
            <LiveStatusIndicator />
          </div>
        </CardHeader>
      </Card>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari PIB Number, Importir, atau Barang..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="completed">Selesai</SelectItem>
                  <SelectItem value="in-progress">Dalam Proses</SelectItem>
                  <SelectItem value="delayed">Tertunda</SelectItem>
                  <SelectItem value="pending">Menunggu</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* PIB List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-semibold">Daftar PIB ({filteredPIBs.length})</h3>
          {filteredPIBs.map((pib) => (
            <Card
              key={pib.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedPIB?.id === pib.id ? "ring-2 ring-primary bg-primary/5" : ""
              }`}
              onClick={() => setSelectedPIB(pib)}
            >
              <CardContent className="pt-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-lg">{pib.pibNumber}</h4>
                    <p className="text-sm text-muted-foreground">{pib.importerName}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={
                        pib.status === "completed"
                          ? "secondary"
                          : pib.status === "in-progress"
                            ? "default"
                            : pib.status === "delayed"
                              ? "destructive"
                              : "outline"
                      }
                    >
                      {pib.status === "completed"
                        ? "Selesai"
                        : pib.status === "in-progress"
                          ? "Proses"
                          : pib.status === "delayed"
                            ? "Tertunda"
                            : "Menunggu"}
                    </Badge>
                    {pib.status === "in-progress" && <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />}
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <p className="text-sm">
                    <strong>Barang:</strong> {pib.goodsDescription}
                  </p>
                  <p className="text-sm">
                    <strong>Nilai:</strong> {formatCurrency(pib.value)}
                  </p>
                  <p className="text-sm">
                    <strong>Tanggal Submit:</strong> {pib.submissionDate}
                  </p>
                </div>

                {/* Mini Timeline */}
                <div className="flex items-center space-x-2">
                  {Object.entries(pib.stages).map(([stage, data], index) => (
                    <div key={stage} className="flex items-center">
                      <div className={`flex items-center space-x-1 ${getStatusColor(data.status)}`}>
                        {getStatusIcon(data.status)}
                        <span className="text-xs hidden sm:inline">{getStageName(stage)}</span>
                      </div>
                      {index < Object.entries(pib.stages).length - 1 && <div className="w-4 h-px bg-border mx-2" />}
                    </div>
                  ))}
                </div>

                {/* Latest Notification */}
                {pib.notifications.length > 0 && (
                  <div className="mt-3 p-2 bg-muted/50 rounded text-xs">
                    <div className="flex items-center space-x-1">
                      <Bell className="h-3 w-3" />
                      <span>{pib.notifications[0]}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Detailed View and Activity Feed */}
        <div className="lg:col-span-2 space-y-4">
          {selectedPIB ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Detail PIB</CardTitle>
                  <CardDescription>{selectedPIB.pibNumber}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm">
                      <strong>Importir:</strong> {selectedPIB.importerName}
                    </p>
                    <p className="text-sm">
                      <strong>Barang:</strong> {selectedPIB.goodsDescription}
                    </p>
                    <p className="text-sm">
                      <strong>Nilai:</strong> {formatCurrency(selectedPIB.value)}
                    </p>
                    <p className="text-sm">
                      <strong>Tanggal Submit:</strong> {selectedPIB.submissionDate}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Timeline Detail */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Timeline Proses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(selectedPIB.stages).map(([stage, data], index) => (
                      <div key={stage} className="flex items-start space-x-3">
                        <div className={`mt-1 ${getStatusColor(data.status)}`}>{getStatusIcon(data.status)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            {getStageIcon(stage)}
                            <p className="font-medium text-sm">{getStageName(stage)}</p>
                          </div>
                          {data.timestamp && (
                            <p className="text-xs text-muted-foreground mt-1">
                              <Calendar className="h-3 w-3 inline mr-1" />
                              {data.timestamp}
                            </p>
                          )}
                          <div className="mt-1">
                            <Badge
                              variant={
                                data.status === "completed"
                                  ? "secondary"
                                  : data.status === "in-progress"
                                    ? "default"
                                    : data.status === "delayed"
                                      ? "destructive"
                                      : "outline"
                              }
                              className="text-xs"
                            >
                              {data.status === "completed"
                                ? "Selesai"
                                : data.status === "in-progress"
                                  ? "Proses"
                                  : data.status === "delayed"
                                    ? "Tertunda"
                                    : "Menunggu"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Bell className="h-5 w-5" />
                    <span>Notifikasi</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {selectedPIB.notifications.map((notification, index) => (
                      <div key={index} className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm">{notification}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <Button className="w-full" size="sm">
                      Download Dokumen
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent" size="sm">
                      Hubungi PPJK
                    </Button>
                    {selectedPIB.status === "completed" && (
                      <Button variant="secondary" className="w-full" size="sm">
                        Jadwalkan Pickup
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              <Card>
                <CardContent className="pt-6 text-center">
                  <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Pilih PIB dari daftar untuk melihat detail tracking</p>
                </CardContent>
              </Card>
              <ActivityFeed />
            </>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-secondary" />
              <div>
                <p className="text-2xl font-bold">{pibData.filter((p) => p.status === "completed").length}</p>
                <p className="text-xs text-muted-foreground">PIB Selesai</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{pibData.filter((p) => p.status === "in-progress").length}</p>
                <p className="text-xs text-muted-foreground">Dalam Proses</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <div>
                <p className="text-2xl font-bold">{pibData.filter((p) => p.status === "delayed").length}</p>
                <p className="text-xs text-muted-foreground">Tertunda</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">{pibData.length}</p>
                <p className="text-xs text-muted-foreground">Total PIB</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
