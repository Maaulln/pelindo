"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Users, Shield, Truck } from "lucide-react"

export function LoginForm() {
  const [userType, setUserType] = useState<string>("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement authentication logic
    console.log("Login attempt:", { userType, email, password })
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-primary-foreground font-bold text-lg">G</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">GATEGO</h1>
          <p className="text-muted-foreground">Smart Import Tax Platform</p>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle>Masuk ke Akun Anda</CardTitle>
            <CardDescription>Pilih tipe pengguna dan masuk untuk mengakses platform</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {/* User Type Selection */}
              <div className="space-y-2">
                <Label htmlFor="userType">Tipe Pengguna</Label>
                <Select value={userType} onValueChange={setUserType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih tipe pengguna" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="importer">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4" />
                        <span>Importir</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="ppjk">
                      <div className="flex items-center space-x-2">
                        <Shield className="h-4 w-4" />
                        <span>PPJK (Customs Broker)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="transport">
                      <div className="flex items-center space-x-2">
                        <Truck className="h-4 w-4" />
                        <span>Perusahaan Transportasi</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@perusahaan.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* Login Button */}
              <Button type="submit" className="w-full" disabled={!userType}>
                Masuk
              </Button>

              {/* Forgot Password */}
              <div className="text-center">
                <Button variant="link" className="text-sm">
                  Lupa password?
                </Button>
              </div>
            </form>

            <Separator className="my-6" />

            {/* Register Link */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">Belum punya akun?</p>
              <Button variant="outline" className="w-full bg-transparent">
                Daftar Sekarang
              </Button>
            </div>

            {/* User Type Benefits */}
            {userType && (
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center space-x-2">
                  {userType === "importer" && <Users className="h-4 w-4" />}
                  {userType === "ppjk" && <Shield className="h-4 w-4" />}
                  {userType === "transport" && <Truck className="h-4 w-4" />}
                  <span>
                    {userType === "importer" && "Fitur untuk Importir"}
                    {userType === "ppjk" && "Fitur untuk PPJK"}
                    {userType === "transport" && "Fitur untuk Transportasi"}
                  </span>
                </h4>
                <div className="flex flex-wrap gap-1">
                  {userType === "importer" && (
                    <>
                      <Badge variant="secondary" className="text-xs">
                        Hitung Pajak
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        Submit PIB
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        Lacak Status
                      </Badge>
                    </>
                  )}
                  {userType === "ppjk" && (
                    <>
                      <Badge variant="secondary" className="text-xs">
                        Multi Client
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        Proses Dokumen
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        Koordinasi Bea Cukai
                      </Badge>
                    </>
                  )}
                  {userType === "transport" && (
                    <>
                      <Badge variant="secondary" className="text-xs">
                        Jadwal Armada
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        Status SPPB
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        Koordinasi Pickup
                      </Badge>
                    </>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
