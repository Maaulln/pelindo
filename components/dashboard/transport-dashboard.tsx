"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Truck, Calendar, MapPin, Package, CheckCircle, Plus, Eye } from "lucide-react"
import Link from "next/link"

export function TransportDashboard() {
  const scheduledPickups = [
    {
      id: "PU-001",
      client: "PT. Teknologi Maju",
      location: "Tanjung Priok",
      date: "2024-01-16",
      time: "09:00",
      status: "scheduled",
      goods: "Laptop ASUS ROG Strix",
    },
    {
      id: "PU-002",
      client: "CV. Elektronik Sejahtera",
      location: "Soekarno Hatta",
      date: "2024-01-16",
      time: "14:00",
      status: "in-transit",
      goods: "Smartphone Samsung",
    },
    {
      id: "PU-003",
      client: "PT. Industri Digital",
      location: "Tanjung Priok",
      date: "2024-01-17",
      time: "10:30",
      status: "pending",
      goods: "Server Dell PowerEdge",
    },
  ]

  const fleetStatus = [
    { vehicle: "Truck-001", driver: "Budi Santoso", status: "available", location: "Jakarta" },
    { vehicle: "Truck-002", driver: "Andi Wijaya", status: "in-transit", location: "Tanjung Priok" },
    { vehicle: "Truck-003", driver: "Sari Indah", status: "maintenance", location: "Workshop" },
    { vehicle: "Truck-004", driver: "Dedi Kurniawan", status: "available", location: "Bekasi" },
  ]

  const quickStats = {
    totalPickups: 15,
    scheduled: 5,
    inTransit: 3,
    availableVehicles: 2,
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Dashboard Transportasi - CV. Logistik Cepat</CardTitle>
          <CardDescription>Kelola armada, jadwalkan pickup, dan koordinasi pengambilan barang impor</CardDescription>
        </CardHeader>
      </Card>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Jadwal Pickup</h3>
                <p className="text-sm text-muted-foreground">Schedule new pickup</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                <Truck className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <h3 className="font-semibold">Kelola Armada</h3>
                <p className="text-sm text-muted-foreground">Fleet management</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <MapPin className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold">Track Lokasi</h3>
                <p className="text-sm text-muted-foreground">Real-time tracking</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Link href="/tracking">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Status SPPB</h3>
                  <p className="text-sm text-muted-foreground">Monitor releases</p>
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
              <Package className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{quickStats.totalPickups}</p>
                <p className="text-xs text-muted-foreground">Total Pickup</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-secondary" />
              <div>
                <p className="text-2xl font-bold">{quickStats.scheduled}</p>
                <p className="text-xs text-muted-foreground">Terjadwal</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Truck className="h-5 w-5 text-accent" />
              <div>
                <p className="text-2xl font-bold">{quickStats.inTransit}</p>
                <p className="text-xs text-muted-foreground">Dalam Perjalanan</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{quickStats.availableVehicles}</p>
                <p className="text-xs text-muted-foreground">Armada Siap</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Scheduled Pickups */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Jadwal Pickup</CardTitle>
                <CardDescription>Pickup yang terjadwal dan dalam proses</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Jadwal Baru
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {scheduledPickups.map((pickup) => (
                <div key={pickup.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold">{pickup.id}</h4>
                      <p className="text-sm text-muted-foreground">{pickup.client}</p>
                    </div>
                    <Badge
                      variant={
                        pickup.status === "scheduled"
                          ? "default"
                          : pickup.status === "in-transit"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {pickup.status === "scheduled"
                        ? "Terjadwal"
                        : pickup.status === "in-transit"
                          ? "Dalam Perjalanan"
                          : "Pending"}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p>
                      <strong>Barang:</strong> {pickup.goods}
                    </p>
                    <p className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span>{pickup.location}</span>
                    </p>
                    <p className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {pickup.date} - {pickup.time}
                      </span>
                    </p>
                  </div>
                  <div className="flex space-x-2 mt-3">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Detail
                    </Button>
                    {pickup.status === "scheduled" && <Button size="sm">Mulai Pickup</Button>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Fleet Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Truck className="h-5 w-5" />
              <span>Status Armada</span>
            </CardTitle>
            <CardDescription>Kondisi dan lokasi kendaraan saat ini</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {fleetStatus.map((vehicle, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold">{vehicle.vehicle}</h4>
                    <p className="text-sm text-muted-foreground">{vehicle.driver}</p>
                    <p className="text-sm flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span>{vehicle.location}</span>
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge
                      variant={
                        vehicle.status === "available"
                          ? "secondary"
                          : vehicle.status === "in-transit"
                            ? "default"
                            : "destructive"
                      }
                    >
                      {vehicle.status === "available"
                        ? "Siap"
                        : vehicle.status === "in-transit"
                          ? "Perjalanan"
                          : "Maintenance"}
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
      </div>
    </div>
  )
}
