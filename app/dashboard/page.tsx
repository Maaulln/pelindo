"use client"

import { useState } from "react"
import { ImporterDashboard } from "@/components/dashboard/importer-dashboard"
import { PPJKDashboard } from "@/components/dashboard/ppjk-dashboard"
import { TransportDashboard } from "@/components/dashboard/transport-dashboard"
import { NotificationSystem } from "@/components/realtime/notification-system"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Shield, Truck } from "lucide-react"

// Mock user context - in real app this would come from authentication
const mockUser = {
  type: "importer" as "importer" | "ppjk" | "transport",
  name: "PT. Teknologi Maju",
  email: "admin@teknologimaju.com",
}

export default function DashboardPage() {
  const [userType, setUserType] = useState<"importer" | "ppjk" | "transport">(mockUser.type)

  const getUserTypeIcon = (type: string) => {
    switch (type) {
      case "importer":
        return <Users className="h-4 w-4" />
      case "ppjk":
        return <Shield className="h-4 w-4" />
      case "transport":
        return <Truck className="h-4 w-4" />
    }
  }

  const getUserTypeName = (type: string) => {
    switch (type) {
      case "importer":
        return "Importir"
      case "ppjk":
        return "PPJK"
      case "transport":
        return "Transportasi"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">G</span>
              </div>
              <h1 className="text-2xl font-bold text-foreground">GATEGO</h1>
            </div>
            <div className="flex items-center space-x-4">
              <NotificationSystem />
              <Badge variant="secondary" className="flex items-center space-x-1">
                {getUserTypeIcon(userType)}
                <span>{getUserTypeName(userType)}</span>
              </Badge>
              <span className="text-sm text-muted-foreground">{mockUser.name}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Demo User Type Switcher - Remove in production */}
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium">Demo Mode - Switch User Type:</span>
            <div className="flex space-x-2">
              <Button
                variant={userType === "importer" ? "default" : "outline"}
                size="sm"
                onClick={() => setUserType("importer")}
              >
                <Users className="h-4 w-4 mr-1" />
                Importir
              </Button>
              <Button
                variant={userType === "ppjk" ? "default" : "outline"}
                size="sm"
                onClick={() => setUserType("ppjk")}
              >
                <Shield className="h-4 w-4 mr-1" />
                PPJK
              </Button>
              <Button
                variant={userType === "transport" ? "default" : "outline"}
                size="sm"
                onClick={() => setUserType("transport")}
              >
                <Truck className="h-4 w-4 mr-1" />
                Transportasi
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {userType === "importer" && <ImporterDashboard />}
        {userType === "ppjk" && <PPJKDashboard />}
        {userType === "transport" && <TransportDashboard />}
      </main>
    </div>
  )
}
