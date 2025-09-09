import { TrackingDashboard } from "@/components/tracking/tracking-dashboard"
import { NotificationSystem } from "@/components/realtime/notification-system"

export default function TrackingPage() {
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
              <span className="text-sm text-muted-foreground">Tracking Dashboard</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <TrackingDashboard />
      </main>
    </div>
  )
}
