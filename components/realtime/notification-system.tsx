"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, X, CheckCircle, AlertTriangle, Clock } from "lucide-react"

interface Notification {
  id: string
  type: "success" | "warning" | "info" | "urgent"
  title: string
  message: string
  timestamp: string
  pibNumber?: string
  read: boolean
  actionRequired?: boolean
}

export function NotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "success",
      title: "SPPB Diterbitkan",
      message: "PIB-2024-001235 telah mendapat SPPB. Armada siap dijadwalkan.",
      timestamp: "2 menit yang lalu",
      pibNumber: "PIB-2024-001235",
      read: false,
      actionRequired: true,
    },
    {
      id: "2",
      type: "info",
      title: "Pembayaran Berhasil",
      message: "Pembayaran untuk PIB-2024-001234 telah diverifikasi.",
      timestamp: "15 menit yang lalu",
      pibNumber: "PIB-2024-001234",
      read: false,
      actionRequired: false,
    },
    {
      id: "3",
      type: "warning",
      title: "Dokumen Perlu Revisi",
      message: "PIB-2024-001236 memerlukan perbaikan dokumen.",
      timestamp: "1 jam yang lalu",
      pibNumber: "PIB-2024-001236",
      read: true,
      actionRequired: true,
    },
  ])

  const [isOpen, setIsOpen] = useState(false)
  const [newNotificationCount, setNewNotificationCount] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate random new notifications
      if (Math.random() > 0.7) {
        const newNotification: Notification = {
          id: Date.now().toString(),
          type: Math.random() > 0.5 ? "info" : "success",
          title: Math.random() > 0.5 ? "Status Update" : "Proses Selesai",
          message: `PIB-2024-${Math.floor(Math.random() * 1000)
            .toString()
            .padStart(6, "0")} mengalami perubahan status.`,
          timestamp: "Baru saja",
          pibNumber: `PIB-2024-${Math.floor(Math.random() * 1000)
            .toString()
            .padStart(6, "0")}`,
          read: false,
          actionRequired: Math.random() > 0.6,
        }

        setNotifications((prev) => [newNotification, ...prev.slice(0, 9)]) // Keep only 10 notifications
        setNewNotificationCount((prev) => prev + 1)
      }
    }, 8000) // New notification every 8 seconds

    return () => clearInterval(interval)
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-secondary" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-destructive" />
      case "urgent":
        return <AlertTriangle className="h-4 w-4 text-destructive" />
      case "info":
        return <Clock className="h-4 w-4 text-primary" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    setNewNotificationCount(0)
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  return (
    <div className="relative">
      {/* Notification Bell */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          setIsOpen(!isOpen)
          if (!isOpen) setNewNotificationCount(0)
        }}
        className="relative"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Notification Panel */}
      {isOpen && (
        <Card className="absolute right-0 top-12 w-96 max-h-96 overflow-hidden z-50 shadow-lg">
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="font-semibold">Notifikasi Real-time</h3>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                  Tandai Semua Dibaca
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">Tidak ada notifikasi</div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b hover:bg-muted/50 cursor-pointer ${
                    !notification.read ? "bg-primary/5" : ""
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm">{notification.title}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            removeNotification(notification.id)
                          }}
                          className="h-6 w-6 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-muted-foreground">{notification.timestamp}</span>
                        <div className="flex items-center space-x-2">
                          {notification.pibNumber && (
                            <Badge variant="outline" className="text-xs">
                              {notification.pibNumber}
                            </Badge>
                          )}
                          {notification.actionRequired && (
                            <Badge variant="secondary" className="text-xs">
                              Perlu Tindakan
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      )}
    </div>
  )
}
