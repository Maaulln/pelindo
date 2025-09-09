"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, FileText, CreditCard, Shield, Truck, Users } from "lucide-react"

interface Activity {
  id: string
  type: "pib_submitted" | "payment_processed" | "customs_approved" | "sppb_issued" | "pickup_scheduled"
  user: string
  userType: "importer" | "ppjk" | "transport"
  pibNumber: string
  message: string
  timestamp: Date
}

export function ActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: "1",
      type: "sppb_issued",
      user: "CV. Bea Cukai Profesional",
      userType: "ppjk",
      pibNumber: "PIB-2024-001235",
      message: "SPPB telah diterbitkan untuk PIB-2024-001235",
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
    },
    {
      id: "2",
      type: "pickup_scheduled",
      user: "CV. Logistik Cepat",
      userType: "transport",
      pibNumber: "PIB-2024-001235",
      message: "Pickup dijadwalkan untuk besok pagi",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
    },
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.6) {
        const activityTypes = [
          "pib_submitted",
          "payment_processed",
          "customs_approved",
          "sppb_issued",
          "pickup_scheduled",
        ] as const
        const users = [
          { name: "PT. Teknologi Maju", type: "importer" as const },
          { name: "CV. Bea Cukai Profesional", type: "ppjk" as const },
          { name: "CV. Logistik Cepat", type: "transport" as const },
        ]

        const randomType = activityTypes[Math.floor(Math.random() * activityTypes.length)]
        const randomUser = users[Math.floor(Math.random() * users.length)]
        const randomPIB = `PIB-2024-${Math.floor(Math.random() * 1000)
          .toString()
          .padStart(6, "0")}`

        const messages = {
          pib_submitted: `PIB baru ${randomPIB} telah disubmit`,
          payment_processed: `Pembayaran untuk ${randomPIB} telah diverifikasi`,
          customs_approved: `${randomPIB} telah disetujui oleh Bea Cukai`,
          sppb_issued: `SPPB telah diterbitkan untuk ${randomPIB}`,
          pickup_scheduled: `Pickup dijadwalkan untuk ${randomPIB}`,
        }

        const newActivity: Activity = {
          id: Date.now().toString(),
          type: randomType,
          user: randomUser.name,
          userType: randomUser.type,
          pibNumber: randomPIB,
          message: messages[randomType],
          timestamp: new Date(),
        }

        setActivities((prev) => [newActivity, ...prev.slice(0, 9)]) // Keep only 10 activities
      }
    }, 6000) // New activity every 6 seconds

    return () => clearInterval(interval)
  }, [])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "pib_submitted":
        return <FileText className="h-4 w-4 text-primary" />
      case "payment_processed":
        return <CreditCard className="h-4 w-4 text-secondary" />
      case "customs_approved":
        return <Shield className="h-4 w-4 text-accent" />
      case "sppb_issued":
        return <CheckCircle className="h-4 w-4 text-secondary" />
      case "pickup_scheduled":
        return <Truck className="h-4 w-4 text-primary" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getUserTypeIcon = (userType: string) => {
    switch (userType) {
      case "importer":
        return <Users className="h-3 w-3" />
      case "ppjk":
        return <Shield className="h-3 w-3" />
      case "transport":
        return <Truck className="h-3 w-3" />
      default:
        return <Users className="h-3 w-3" />
    }
  }

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Baru saja"
    if (diffInMinutes < 60) return `${diffInMinutes} menit yang lalu`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} jam yang lalu`
    return `${Math.floor(diffInMinutes / 1440)} hari yang lalu`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Aktivitas Real-time</CardTitle>
        <CardDescription>Update terbaru dari semua stakeholder</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-80 overflow-y-auto">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30">
              <div className="mt-1">{getActivityIcon(activity.type)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-sm">{activity.user}</span>
                  <Badge variant="outline" className="text-xs flex items-center space-x-1">
                    {getUserTypeIcon(activity.userType)}
                    <span>
                      {activity.userType === "importer"
                        ? "Importir"
                        : activity.userType === "ppjk"
                          ? "PPJK"
                          : "Transport"}
                    </span>
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{activity.message}</p>
                <div className="flex items-center justify-between mt-2">
                  <Badge variant="outline" className="text-xs">
                    {activity.pibNumber}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{formatTimeAgo(activity.timestamp)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
