"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Calculator, Sparkles, Clock, CheckCircle } from "lucide-react"
import { Switch } from "@/components/ui/switch"

interface HSCodeRecommendation {
  code: string
  description: string
  confidence: number
  category: string
  tarif_bea_masuk: number
}

interface TaxCalculation {
  cif_usd: number
  beaMasuk: number
  dpp: number
  ppn: number
  pph22: number
  totalPajak: number
  landedCostUsd: number
  landedCostIdr: number
}

function hitungPajakImpor(
  fob_usd: number,
  freight_usd: number,
  insurance_usd: number,
  tarif_bea_masuk: number,
  tarif_ppn = 0.11,
  tarif_pph_npwp = 0.025,
  kurs_pajak = 16000,
  punya_npwp = true,
  biaya_clearance = 0,
  biaya_trucking = 0,
  biaya_storage = 0,
) {
  const cif = fob_usd + freight_usd + insurance_usd
  const bea_masuk = cif * tarif_bea_masuk
  const dpp = cif + bea_masuk
  const ppn = dpp * tarif_ppn
  const tarif_pph = punya_npwp ? tarif_pph_npwp : 0.075
  const pph_22 = dpp * tarif_pph
  const total_pajak = bea_masuk + ppn + pph_22
  const landed_cost_usd = cif + total_pajak + biaya_clearance + biaya_trucking + biaya_storage
  const landed_cost_idr = landed_cost_usd * kurs_pajak

  return {
    cif_usd: cif,
    bea_masuk_usd: bea_masuk,
    dpp_usd: dpp,
    ppn_usd: ppn,
    pph_22_usd: pph_22,
    total_pajak_usd: total_pajak,
    total_landed_cost_usd: landed_cost_usd,
    total_landed_cost_idr: landed_cost_idr,
  }
}

export function SmartTaxCalculator() {
  const [goodsDescription, setGoodsDescription] = useState("")
  const [fobValue, setFobValue] = useState("")
  const [freightValue, setFreightValue] = useState("")
  const [insuranceValue, setInsuranceValue] = useState("")
  const [hasNPWP, setHasNPWP] = useState(true)
  const [exchangeRate, setExchangeRate] = useState("16000")
  const [isProcessing, setIsProcessing] = useState(false)
  const [recommendations, setRecommendations] = useState<HSCodeRecommendation[]>([])
  const [selectedHSCode, setSelectedHSCode] = useState<HSCodeRecommendation | null>(null)
  const [taxCalculation, setTaxCalculation] = useState<TaxCalculation | null>(null)
  const [processingStep, setProcessingStep] = useState(0)
  const router = useRouter()

  // Mock AI processing simulation
  const processGoodsDescription = async () => {
    setIsProcessing(true)
    setProcessingStep(0)

    const steps = [
      "Menganalisis deskripsi barang...",
      "Mencari HS Code yang relevan...",
      "Menghitung confidence score...",
      "Menyiapkan rekomendasi...",
    ]

    for (let i = 0; i < steps.length; i++) {
      setProcessingStep(i + 1)
      await new Promise((resolve) => setTimeout(resolve, 800))
    }

    const mockRecommendations: HSCodeRecommendation[] = [
      {
        code: "8517.12.00",
        description: "Telepon untuk jaringan seluler atau untuk jaringan nirkabel lainnya",
        confidence: 85,
        category: "Electronics",
        tarif_bea_masuk: 0.15, // 15%
      },
      {
        code: "8471.30.00",
        description: "Mesin pengolah data digital portabel dengan berat tidak melebihi 10 kg",
        confidence: 72,
        category: "Computing",
        tarif_bea_masuk: 0.1, // 10%
      },
      {
        code: "8543.70.90",
        description: "Mesin dan pesawat listrik lainnya",
        confidence: 60,
        category: "Electronics",
        tarif_bea_masuk: 0.075, // 7.5%
      },
    ]

    setRecommendations(mockRecommendations)
    setIsProcessing(false)
  }

  const calculateTax = (hsCode: HSCodeRecommendation) => {
    setSelectedHSCode(hsCode)

    const fob = Number.parseFloat(fobValue) || 0
    const freight = Number.parseFloat(freightValue) || 0
    const insurance = Number.parseFloat(insuranceValue) || 0
    const kurs = Number.parseFloat(exchangeRate) || 16000

    const result = hitungPajakImpor(
      fob,
      freight,
      insurance,
      hsCode.tarif_bea_masuk,
      0.11, // PPN 11%
      0.025, // PPh 22 NPWP 2.5%
      kurs,
      hasNPWP,
    )

    setTaxCalculation({
      cif_usd: result.cif_usd,
      beaMasuk: result.bea_masuk_usd * kurs,
      dpp: result.dpp_usd,
      ppn: result.ppn_usd * kurs,
      pph22: result.pph_22_usd * kurs,
      totalPajak: result.total_pajak_usd * kurs,
      landedCostUsd: result.total_landed_cost_usd,
      landedCostIdr: result.total_landed_cost_idr,
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatUSD = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const resetCalculation = () => {
    setRecommendations([])
    setSelectedHSCode(null)
    setTaxCalculation(null)
    setGoodsDescription("")
    setFobValue("")
    setFreightValue("")
    setInsuranceValue("")
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Calculator className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">Smart Tax Engine</CardTitle>
              <CardDescription>
                Masukkan deskripsi barang impor untuk mendapatkan rekomendasi HS Code dan perhitungan pajak otomatis
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Input Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span>Deskripsi Barang Impor</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi Detail Barang</Label>
              <Textarea
                id="description"
                placeholder="Contoh: Laptop ASUS ROG Strix, Intel Core i7-12700H, 16GB RAM, 512GB SSD, RTX 3060"
                value={goodsDescription}
                onChange={(e) => setGoodsDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fob">Nilai FOB (USD)</Label>
                <Input
                  id="fob"
                  type="number"
                  placeholder="1500"
                  value={fobValue}
                  onChange={(e) => setFobValue(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Free on Board value</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="freight">Freight (USD)</Label>
                <Input
                  id="freight"
                  type="number"
                  placeholder="200"
                  value={freightValue}
                  onChange={(e) => setFreightValue(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Biaya pengiriman</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="insurance">Insurance (USD)</Label>
                <Input
                  id="insurance"
                  type="number"
                  placeholder="50"
                  value={insuranceValue}
                  onChange={(e) => setInsuranceValue(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Biaya asuransi</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="exchange">Kurs Pajak (IDR/USD)</Label>
                <Input
                  id="exchange"
                  type="number"
                  placeholder="16000"
                  value={exchangeRate}
                  onChange={(e) => setExchangeRate(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Kurs yang digunakan untuk perhitungan pajak</p>
              </div>
              <div className="space-y-2">
                <Label>Status NPWP</Label>
                <div className="flex items-center space-x-2 pt-2">
                  <Switch id="npwp" checked={hasNPWP} onCheckedChange={setHasNPWP} />
                  <Label htmlFor="npwp" className="text-sm">
                    {hasNPWP ? "Memiliki NPWP (PPh 22: 2.5%)" : "Tidak memiliki NPWP (PPh 22: 7.5%)"}
                  </Label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex space-x-4">
            <Button
              onClick={processGoodsDescription}
              disabled={!goodsDescription.trim() || !fobValue || isProcessing}
              className="flex items-center space-x-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Analisis dengan AI</span>
                </>
              )}
            </Button>

            {(recommendations.length > 0 || taxCalculation) && (
              <Button variant="outline" onClick={resetCalculation}>
                Reset
              </Button>
            )}
          </div>

          {/* Processing Steps */}
          {isProcessing && (
            <Card className="bg-muted/30">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm font-medium">AI sedang menganalisis...</span>
                  </div>
                  <Progress value={(processingStep / 4) * 100} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    Step {processingStep}/4:{" "}
                    {processingStep === 1
                      ? "Menganalisis deskripsi barang..."
                      : processingStep === 2
                        ? "Mencari HS Code yang relevan..."
                        : processingStep === 3
                          ? "Menghitung confidence score..."
                          : processingStep === 4
                            ? "Menyiapkan rekomendasi..."
                            : ""}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* HS Code Recommendations */}
      {recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-secondary" />
              <span>Rekomendasi HS Code</span>
            </CardTitle>
            <CardDescription>Pilih HS Code yang paling sesuai dengan barang Anda</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recommendations.map((rec, index) => (
              <Card
                key={rec.code}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedHSCode?.code === rec.code ? "ring-2 ring-primary bg-primary/5" : ""
                }`}
                onClick={() => calculateTax(rec)}
              >
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="outline" className="font-mono">
                          {rec.code}
                        </Badge>
                        <Badge
                          variant={rec.confidence >= 80 ? "secondary" : rec.confidence >= 70 ? "default" : "outline"}
                        >
                          {rec.confidence}% confidence
                        </Badge>
                        <Badge variant="outline">{rec.category}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{rec.description}</p>
                    </div>
                    {selectedHSCode?.code === rec.code && <CheckCircle className="h-5 w-5 text-secondary ml-2" />}
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Tax Calculation Results */}
      {taxCalculation && selectedHSCode && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calculator className="h-5 w-5 text-primary" />
              <span>Perhitungan Pajak Impor</span>
            </CardTitle>
            <CardDescription>
              Berdasarkan HS Code: {selectedHSCode.code} - {selectedHSCode.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-muted/30 p-4 rounded-lg mb-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">CIF Value (Cost, Insurance, Freight)</span>
                  <span className="font-medium">{formatUSD(taxCalculation.cif_usd)}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  FOB + Freight + Insurance = Dasar perhitungan pajak
                </p>
              </div>

              <div className="grid gap-3">
                <div className="flex justify-between items-center py-2">
                  <div>
                    <span className="font-medium">Bea Masuk</span>
                    <p className="text-xs text-muted-foreground">
                      {(selectedHSCode.tarif_bea_masuk * 100).toFixed(1)}% dari CIF
                    </p>
                  </div>
                  <span className="font-medium">{formatCurrency(taxCalculation.beaMasuk)}</span>
                </div>
                <Separator />

                <div className="flex justify-between items-center py-2">
                  <div>
                    <span className="font-medium">PPN</span>
                    <p className="text-xs text-muted-foreground">11% dari DPP (CIF + Bea Masuk)</p>
                  </div>
                  <span className="font-medium">{formatCurrency(taxCalculation.ppn)}</span>
                </div>
                <Separator />

                <div className="flex justify-between items-center py-2">
                  <div>
                    <span className="font-medium">PPh Pasal 22</span>
                    <p className="text-xs text-muted-foreground">
                      {hasNPWP ? "2.5%" : "7.5%"} dari DPP ({hasNPWP ? "dengan" : "tanpa"} NPWP)
                    </p>
                  </div>
                  <span className="font-medium">{formatCurrency(taxCalculation.pph22)}</span>
                </div>
              </div>

              <Separator className="my-4" />

              {/* Total */}
              <div className="bg-primary/5 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-bold">Total Pajak Impor</span>
                  <span className="text-2xl font-bold text-primary">{formatCurrency(taxCalculation.totalPajak)}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>Total Landed Cost</span>
                  <span>{formatCurrency(taxCalculation.landedCostIdr)}</span>
                </div>
              </div>

              {/* Time Savings Highlight */}
              <Card className="bg-secondary/10 border-secondary/20">
                <CardContent className="pt-4">
                  <div className="flex items-center space-x-2 text-secondary">
                    <Clock className="h-5 w-5" />
                    <span className="font-medium">Estimasi waktu proses PIB berkurang dari jam → menit</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Dengan rekomendasi HS Code yang akurat, proses pengajuan PIB menjadi lebih cepat dan efisien
                  </p>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-4">
                <Button className="flex-1" onClick={() => router.push("/pib-submission")}>
                  Lanjut ke PIB
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent">
                  Simpan Perhitungan
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
