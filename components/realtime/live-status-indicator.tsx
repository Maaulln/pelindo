"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Wifi, WifiOff } from "lucide-react"

interface LiveStatusProps {
  className?: string
}

export function LiveStatusIndicator({ className }: LiveStatusProps) {
  const [isConnected, setIsConnected] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate occasional connection issues
      if (Math.random() > 0.95) {
        setIsConnected(false)
        setTimeout(() => setIsConnected(true), 2000)
      } else {
        setLastUpdate(new Date())
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Badge variant={isConnected ? "secondary" : "destructive"} className="flex items-center space-x-1">
        {isConnected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
        <span>{isConnected ? "Live" : "Offline"}</span>
      </Badge>
      {isConnected && (
        <span className="text-xs text-muted-foreground">Update terakhir: {lastUpdate.toLocaleTimeString()}</span>
      )}
    </div>
  )
}
