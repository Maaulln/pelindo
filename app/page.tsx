import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calculator, TrendingUp, Users, Shield, Clock, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center shadow-lg relative">
                <div className="absolute inset-0 bg-black/20 rounded-xl"></div>
                <span className="text-white font-bold text-lg drop-shadow-xl [text-shadow:_0_1px_0_rgb(0_0_0_/_40%)] relative z-10">
                  G
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">GATEGO</h1>
                <Badge variant="secondary" className="text-xs">
                  Smart Import Tax Platform
                </Badge>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Link href="/login">
                <Button variant="outline" className="hover:bg-primary/10 bg-card/50 border-border">
                  Masuk
                </Button>
              </Link>
              <Button className="shadow-lg hover:shadow-xl">Daftar</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <div className="container mx-auto text-center relative">
          <div className="animate-fade-in">
            <h2 className="text-5xl font-bold text-foreground mb-6 text-balance leading-tight">
              Platform Pajak Impor Cerdas untuk Indonesia
            </h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-4xl mx-auto text-pretty leading-relaxed">
              Hitung pajak impor dengan AI, lacak status PIB real-time, dan kelola proses kepabeanan dengan mudah. Dari
              jam menjadi menit.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/tax-calculator">
                <Button size="lg" className="text-lg px-10 py-4 shadow-lg hover:shadow-xl card-hover">
                  <Calculator className="mr-3 h-6 w-6" />
                  Mulai Hitung Pajak
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-10 py-4 hover:bg-primary/5 card-hover bg-transparent"
                >
                  <TrendingUp className="mr-3 h-6 w-6" />
                  Lihat Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h3 className="text-4xl font-bold text-foreground mb-4">Fitur Unggulan GATEGO</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Solusi lengkap untuk mengoptimalkan proses impor Anda
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Smart Tax Engine */}
            <Card className="p-8 card-hover animate-slide-in border-0 shadow-lg">
              <CardHeader className="pb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center shadow-lg">
                    <Calculator className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl mb-2">Smart Tax Engine</CardTitle>
                    <CardDescription className="text-base">Mesin Kalkulator & Rekomendasi Pajak Cerdas</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                    Input sederhana: "Laptop ASUS, Core i7, 16GB RAM"
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      HS Code 85.17 (85%)
                    </Badge>
                    <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/20">
                      HS Code 84.71 (72%)
                    </Badge>
                    <Badge variant="outline" className="bg-muted text-muted-foreground">
                      HS Code 85.43 (60%)
                    </Badge>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-card to-muted/50 p-6 rounded-xl border space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Bea Masuk</span>
                    <span className="font-semibold">Rp 2.500.000</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">PPN</span>
                    <span className="font-semibold">Rp 1.100.000</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">PPh Pasal 22</span>
                    <span className="font-semibold">Rp 750.000</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">PNBP</span>
                    <span className="font-semibold">Rp 150.000</span>
                  </div>
                  <hr className="border-border" />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-primary">Rp 4.500.000</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3 text-secondary bg-secondary/10 p-3 rounded-lg">
                  <Clock className="h-5 w-5" />
                  <span className="font-medium">Estimasi waktu: Dari jam → menit</span>
                </div>
              </CardContent>
            </Card>

            {/* Integrated Tracking Dashboard */}
            <Card className="p-8 card-hover animate-slide-in border-0 shadow-lg">
              <CardHeader className="pb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-secondary to-accent rounded-2xl flex items-center justify-center shadow-lg">
                    <TrendingUp className="h-8 w-8 text-secondary-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl mb-2">Integrated Tracking Dashboard</CardTitle>
                    <CardDescription className="text-base">Dasbor Pelacakan Terpadu</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-3 bg-secondary/10 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-secondary" />
                    <div className="flex-1">
                      <p className="font-medium">PIB Submitted</p>
                      <p className="text-xs text-muted-foreground">2024-01-15 09:30</p>
                    </div>
                    <Badge variant="secondary" className="shadow-sm">
                      Selesai
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 p-3 bg-secondary/10 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-secondary" />
                    <div className="flex-1">
                      <p className="font-medium">Payment Processed</p>
                      <p className="text-xs text-muted-foreground">2024-01-15 10:15</p>
                    </div>
                    <Badge variant="secondary" className="shadow-sm">
                      Selesai
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 p-3 bg-primary/10 rounded-lg">
                    <div className="h-6 w-6 rounded-full bg-primary animate-pulse shadow-lg" />
                    <div className="flex-1">
                      <p className="font-medium">Customs Response Received</p>
                      <p className="text-xs text-muted-foreground">Sedang diproses...</p>
                    </div>
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      Proses
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 p-3 bg-muted/50 rounded-lg">
                    <div className="h-6 w-6 rounded-full bg-muted" />
                    <div className="flex-1">
                      <p className="font-medium">SPPB Issued</p>
                      <p className="text-xs text-muted-foreground">Menunggu...</p>
                    </div>
                    <Badge variant="outline">Menunggu</Badge>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-secondary/10 to-accent/10 p-4 rounded-xl border border-secondary/20">
                  <p className="font-medium text-secondary flex items-center space-x-2">
                    <span>💡</span>
                    <span>SPPB Issued - Armada siap dijadwalkan</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Multi-User Access */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h3 className="text-4xl font-bold text-foreground mb-4">Akses Multi-User</h3>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Satu platform untuk semua stakeholder dalam proses impor dengan interface yang disesuaikan untuk setiap
              peran
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-8 card-hover border-0 shadow-lg animate-slide-in">
              <div className="w-20 h-20 gradient-bg rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Users className="h-10 w-10 text-primary-foreground" />
              </div>
              <CardTitle className="mb-3 text-xl">Importir</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Hitung pajak, submit PIB, dan lacak status pengiriman dengan mudah melalui dashboard yang intuitif
              </CardDescription>
            </Card>
            <Card className="text-center p-8 card-hover border-0 shadow-lg animate-slide-in">
              <div className="w-20 h-20 bg-gradient-to-br from-secondary to-accent rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Shield className="h-10 w-10 text-secondary-foreground" />
              </div>
              <CardTitle className="mb-3 text-xl">PPJK</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Kelola multiple client, proses dokumen, dan koordinasi dengan bea cukai secara efisien
              </CardDescription>
            </Card>
            <Card className="text-center p-8 card-hover border-0 shadow-lg animate-slide-in">
              <div className="w-20 h-20 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <TrendingUp className="h-10 w-10 text-accent-foreground" />
              </div>
              <CardTitle className="mb-3 text-xl">Transportasi</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Jadwalkan armada, lacak status SPPB, dan koordinasi pengambilan barang dengan sistem terintegrasi
              </CardDescription>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 gradient-bg relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="container mx-auto text-center relative">
          <div className="animate-fade-in">
            <h3 className="text-4xl font-bold text-primary-foreground mb-6">Siap Mengoptimalkan Proses Impor Anda?</h3>
            <p className="text-xl text-primary-foreground/90 mb-10 max-w-3xl mx-auto leading-relaxed">
              Bergabung dengan ratusan perusahaan yang telah mempercayai GATEGO untuk mengelola proses impor mereka
              dengan lebih efisien dan transparan.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="text-lg px-10 py-4 shadow-xl hover:shadow-2xl card-hover"
              >
                Mulai Gratis
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-10 py-4 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent shadow-xl hover:shadow-2xl card-hover"
              >
                Hubungi Sales
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card/50 border-t py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-6 md:mb-0">
              <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center shadow-lg relative">
                <div className="absolute inset-0 bg-black/20 rounded-lg"></div>
                <span className="text-white font-bold text-sm drop-shadow-xl [text-shadow:_0_1px_0_rgb(0_0_0_/_40%)] relative z-10">
                  G
                </span>
              </div>
              <span className="font-bold text-foreground text-lg">GATEGO</span>
              <Badge variant="outline" className="text-xs">
                v2.0
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              © 2024 GATEGO. Smart Import Tax Platform untuk Indonesia. Dibuat dengan ❤️ untuk kemudahan impor.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
