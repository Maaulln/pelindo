"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Calculator,
  Sparkles,
  Clock,
  CheckCircle,
  Package,
  Truck,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HSCodeRecommendation {
  code: string;
  description: string;
  confidence: number;
  category: string;
  tarif_bea_masuk: number;
}

interface TaxCalculation {
  cif_idr: number;
  beaMasuk: number;
  dpp: number;
  ppn: number;
  pph22: number;
  totalPajak: number;
  totalBiayaLayanan: number;
  landedCostIdr: number;
}

interface LayananTarif {
  namaLayanan: string;
  jenisKontainer: string;
  ukuranKontainer: string;
  tarif: number;
}

// Tarif layanan kontainer berdasarkan layanan.py
const tarifStorage = {
  "Full Container": {
    "20ft": 26700,
    "40ft": 53400,
    "45ft": 66800,
  },
  "Empty Container": {
    "20ft": 12000,
    "40ft": 24000,
    "45ft": 30000,
  },
  "DG Container (IMDG-CODE)": {
    "20ft": 36000,
    "40ft": 72000,
    "45ft": 90000,
  },
  "Reefer Container": {
    "20ft": 48000,
    "40ft": 96000,
    "45ft": 120000,
  },
  "Overdimension Container (OH/OW/OL)": {
    "20ft": 48000,
    "40ft": 96000,
    "45ft": 120000,
  },
  "Loaded Chassis": {
    "20ft": 20000,
    "40ft": 40000,
    "45ft": 50000,
  },
  "Empty Chassis": {
    "20ft": 20000,
    "40ft": 40000,
    "45ft": 50000,
  },
  Uncontainerized: {
    "1-20 ton": 54000,
    "21-35 ton": 108000,
    ">35 ton": 135000,
  },
};

const tarifLift = {
  "Full Container": {
    "20ft": 196000,
    "40ft": 295000,
    "45ft": 369000,
  },
  "Empty Container": {
    "20ft": 83500,
    "40ft": 125000,
    "45ft": 156250,
  },
  "DG Container (IMDG-CODE)": {
    "20ft": 167000,
    "40ft": 250000,
    "45ft": 312500,
  },
  "Reefer Container": {
    "20ft": 196000,
    "40ft": 295000,
    "45ft": 369000,
  },
  "Overdimension Container (OH/OW/OL)": {
    "20ft": 637000,
    "40ft": 955000,
    "45ft": 1115000,
  },
  Uncontainerized: {
    "1-20 ton": 637000,
    "21-35 ton": 955000,
    ">35 ton": 1115000,
  },
};

const tarifHaulage = {
  "Full Container": {
    "20ft": 80000,
    "40ft": 120000,
    "45ft": 148000,
  },
  "Empty Container": {
    "20ft": 40000,
    "40ft": 65000,
    "45ft": 75000,
  },
  "DG Container (IMDG-CODE)": {
    "20ft": 60000,
    "40ft": 90000,
    "45ft": 110000,
  },
  "Reefer Container": {
    "20ft": 80000,
    "40ft": 120000,
    "45ft": 148000,
  },
  "Overdimension Container (OH/OW/OL)": {
    "20ft": 240000,
    "40ft": 360000,
    "45ft": 440000,
  },
  Uncontainerized: {
    "1-20 ton": 240000,
    "21-35 ton": 360000,
    ">35 ton": 440000,
  },
};

const tarifExtraMovement = {
  "Full Container": {
    "20ft": 472000,
    "40ft": 710000,
    "45ft": 886000,
  },
  "Empty Container": {
    "20ft": 207000,
    "40ft": 315000,
    "45ft": 387500,
  },
  "DG Container (IMDG-CODE)": {
    "20ft": 394000,
    "40ft": 590000,
    "45ft": 735000,
  },
  "Reefer Container": {
    "20ft": 472000,
    "40ft": 710000,
    "45ft": 886000,
  },
  "Overdimension Container (OH/OW/OL)": {
    "20ft": 1514000,
    "40ft": 2270000,
    "45ft": 2670000,
  },
  Uncontainerized: {
    "1-20 ton": 1514000,
    "21-35 ton": 2270000,
    ">35 ton": 2670000,
  },
};

function hitungTarifLayanan(
  namaLayanan: string,
  jenisKontainer: string,
  ukuranKontainer: string
): number {
  let tarifMap: any;

  switch (namaLayanan) {
    case "Storage":
      tarifMap = tarifStorage;
      break;
    case "Lift On/Off":
      tarifMap = tarifLift;
      break;
    case "Haulage":
      tarifMap = tarifHaulage;
      break;
    case "Extra Movement":
      tarifMap = tarifExtraMovement;
      break;
    default:
      return 0;
  }

  return tarifMap[jenisKontainer]?.[ukuranKontainer] || 0;
}

function hitungPajakImpor(
  fob_idr: number,
  freight_idr: number,
  insurance_idr: number,
  tarif_bea_masuk: number,
  tarif_ppn = 0.11,
  tarif_pph_npwp = 0.025,
  punya_npwp = true,
  biaya_clearance = 0,
  biaya_trucking = 0,
  biaya_storage = 0,
  biaya_lift = 0,
  biaya_haulage = 0,
  biaya_extra = 0
) {
  const cif_idr = fob_idr + freight_idr + insurance_idr;
  const bea_masuk = cif_idr * tarif_bea_masuk;
  const dpp = cif_idr + bea_masuk;
  const ppn = dpp * tarif_ppn;
  const tarif_pph = punya_npwp ? tarif_pph_npwp : 0.075;
  const pph_22 = dpp * tarif_pph;
  const total_pajak = bea_masuk + ppn + pph_22;

  // Total biaya layanan dalam IDR
  const total_biaya_layanan =
    biaya_clearance +
    biaya_trucking +
    biaya_storage +
    biaya_lift +
    biaya_haulage +
    biaya_extra;

  const landed_cost_idr = cif_idr + total_pajak + total_biaya_layanan;

  return {
    cif_idr: cif_idr,
    bea_masuk_idr: bea_masuk,
    dpp_idr: dpp,
    ppn_idr: ppn,
    pph_22_idr: pph_22,
    total_pajak_idr: total_pajak,
    total_biaya_layanan_idr: total_biaya_layanan,
    total_landed_cost_idr: landed_cost_idr,
  };
}

export function SmartTaxCalculator() {
  const [goodsDescription, setGoodsDescription] = useState("");
  const [fobValue, setFobValue] = useState("");
  const [freightValue, setFreightValue] = useState("");
  const [insuranceValue, setInsuranceValue] = useState("");
  const [hasNPWP, setHasNPWP] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recommendations, setRecommendations] = useState<
    HSCodeRecommendation[]
  >([]);
  const [selectedHSCode, setSelectedHSCode] =
    useState<HSCodeRecommendation | null>(null);
  const [taxCalculation, setTaxCalculation] = useState<TaxCalculation | null>(
    null
  );
  const [processingStep, setProcessingStep] = useState(0);

  // State untuk layanan kontainer
  const [jenisKontainer, setJenisKontainer] = useState("Full Container");
  const [ukuranKontainer, setUkuranKontainer] = useState("20ft");
  const [layananTerpilih, setLayananTerpilih] = useState<string[]>([]);

  const router = useRouter();

  // Definisi keterangan layanan
  const layananKeterangan = {
    Storage: "Sewa lahan penyimpanan kontainer (per hari)",
    "Lift On/Off": "Biaya crane untuk angkat/turunkan kontainer dari/ke kapal",
    Haulage: "Biaya angkut menggunakan truk dalam area pelabuhan",
    "Extra Movement":
      "Biaya tambahan jika harus dipindah lebih dari prosedur normal",
  };

  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Mock AI processing simulation
  const processGoodsDescription = async () => {
    setIsProcessing(true);
    setProcessingStep(0);

    const steps = [
      "Menganalisis deskripsi barang...",
      "Mencari HS Code yang relevan...",
      "Menghitung confidence score...",
      "Menyiapkan rekomendasi...",
    ];

    for (let i = 0; i < steps.length; i++) {
      setProcessingStep(i + 1);
      await new Promise((resolve) => setTimeout(resolve, 800));
    }

    const mockRecommendations: HSCodeRecommendation[] = [
      {
        code: "8517.12.00",
        description:
          "Telepon untuk jaringan seluler atau untuk jaringan nirkabel lainnya",
        confidence: 85,
        category: "Electronics",
        tarif_bea_masuk: 0.15, // 15%
      },
      {
        code: "8471.30.00",
        description:
          "Mesin pengolah data digital portabel dengan berat tidak melebihi 10 kg",
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
    ];

    setRecommendations(mockRecommendations);
    setIsProcessing(false);
  };

  const calculateTax = (hsCode: HSCodeRecommendation) => {
    setSelectedHSCode(hsCode);

    const fob = Number.parseFloat(fobValue) || 0;
    const freight = Number.parseFloat(freightValue) || 0;
    const insurance = Number.parseFloat(insuranceValue) || 0;

    // Input sudah dalam IDR, tidak perlu konversi
    const fob_idr = fob;
    const freight_idr = freight;
    const insurance_idr = insurance;

    // Hitung biaya layanan berdasarkan pilihan
    let biayaStorage = 0;
    let biayaLift = 0;
    let biayaHaulage = 0;
    let biayaExtra = 0;

    layananTerpilih.forEach((layanan) => {
      const tarif = hitungTarifLayanan(
        layanan,
        jenisKontainer,
        ukuranKontainer
      );
      switch (layanan) {
        case "Storage":
          biayaStorage = tarif;
          break;
        case "Lift On/Off":
          biayaLift = tarif;
          break;
        case "Haulage":
          biayaHaulage = tarif;
          break;
        case "Extra Movement":
          biayaExtra = tarif;
          break;
      }
    });

    const result = hitungPajakImpor(
      fob_idr,
      freight_idr,
      insurance_idr,
      hsCode.tarif_bea_masuk,
      0.11, // PPN 11%
      0.025, // PPh 22 NPWP 2.5%
      hasNPWP,
      0, // biaya clearance
      0, // biaya trucking
      biayaStorage,
      biayaLift,
      biayaHaulage,
      biayaExtra
    );

    setTaxCalculation({
      cif_idr: result.cif_idr,
      beaMasuk: result.bea_masuk_idr,
      dpp: result.dpp_idr,
      ppn: result.ppn_idr,
      pph22: result.pph_22_idr,
      totalPajak: result.total_pajak_idr,
      totalBiayaLayanan: result.total_biaya_layanan_idr,
      landedCostIdr: result.total_landed_cost_idr,
    });
  };

  const resetCalculation = () => {
    setRecommendations([]);
    setSelectedHSCode(null);
    setTaxCalculation(null);
    setGoodsDescription("");
    setFobValue("");
    setFreightValue("");
    setInsuranceValue("");
    setJenisKontainer("Full Container");
    setUkuranKontainer("20ft");
    setLayananTerpilih([]);
  };

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
                Masukkan deskripsi barang impor untuk mendapatkan rekomendasi HS
                Code dan perhitungan pajak otomatis
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Container & Services Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Package className="h-5 w-5 text-primary" />
            <span>Informasi Kontainer & Layanan</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Jenis Kontainer</Label>
              <Select value={jenisKontainer} onValueChange={setJenisKontainer}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jenis kontainer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full Container">Full Container</SelectItem>
                  <SelectItem value="Empty Container">
                    Empty Container
                  </SelectItem>
                  <SelectItem value="DG Container (IMDG-CODE)">
                    DG Container (IMDG-CODE)
                  </SelectItem>
                  <SelectItem value="Reefer Container">
                    Reefer Container
                  </SelectItem>
                  <SelectItem value="Overdimension Container (OH/OW/OL)">
                    Overdimension Container (OH/OW/OL)
                  </SelectItem>
                  <SelectItem value="Loaded Chassis">Loaded Chassis</SelectItem>
                  <SelectItem value="Empty Chassis">Empty Chassis</SelectItem>
                  <SelectItem value="Uncontainerized">
                    Uncontainerized
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Ukuran Kontainer</Label>
              <Select
                value={ukuranKontainer}
                onValueChange={setUkuranKontainer}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih ukuran" />
                </SelectTrigger>
                <SelectContent>
                  {jenisKontainer === "Uncontainerized" ? (
                    <>
                      <SelectItem value="1-20 ton">1-20 ton</SelectItem>
                      <SelectItem value="21-35 ton">21-35 ton</SelectItem>
                      <SelectItem value=">35 ton">&gt;35 ton</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="20ft">20ft</SelectItem>
                      <SelectItem value="40ft">40ft</SelectItem>
                      <SelectItem value="45ft">45ft</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Layanan yang Dibutuhkan</Label>
            <div className="grid md:grid-cols-2 gap-3">
              {["Storage", "Lift On/Off", "Haulage", "Extra Movement"].map(
                (layanan) => (
                  <div
                    key={layanan}
                    className="flex items-center space-x-2 p-3 border rounded-lg"
                  >
                    <Checkbox
                      id={layanan}
                      checked={layananTerpilih.includes(layanan)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setLayananTerpilih([...layananTerpilih, layanan]);
                        } else {
                          setLayananTerpilih(
                            layananTerpilih.filter((l) => l !== layanan)
                          );
                        }
                      }}
                    />
                    <div className="flex-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Label
                            htmlFor={layanan}
                            className="font-medium cursor-pointer hover:text-primary transition-colors"
                          >
                            {layanan}
                          </Label>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            {
                              layananKeterangan[
                                layanan as keyof typeof layananKeterangan
                              ]
                            }
                          </p>
                        </TooltipContent>
                      </Tooltip>
                      <p className="text-xs text-muted-foreground">
                        {formatIDR(
                          hitungTarifLayanan(
                            layanan,
                            jenisKontainer,
                            ukuranKontainer
                          )
                        )}
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Input Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span>Informasi Barang & Nilai</span>
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
                <Label htmlFor="fob">Nilai FOB (IDR)</Label>
                <Input
                  id="fob"
                  type="number"
                  placeholder="24000000"
                  value={fobValue}
                  onChange={(e) => setFobValue(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Free on Board value (dalam Rupiah)
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="freight">Freight (IDR)</Label>
                <Input
                  id="freight"
                  type="number"
                  placeholder="3200000"
                  value={freightValue}
                  onChange={(e) => setFreightValue(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Biaya pengiriman (dalam Rupiah)
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="insurance">Insurance (IDR)</Label>
                <Input
                  id="insurance"
                  type="number"
                  placeholder="800000"
                  value={insuranceValue}
                  onChange={(e) => setInsuranceValue(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Biaya asuransi (dalam Rupiah)
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Status NPWP</Label>
                <div className="flex items-center space-x-2 pt-2">
                  <Switch
                    id="npwp"
                    checked={hasNPWP}
                    onCheckedChange={setHasNPWP}
                  />
                  <Label htmlFor="npwp" className="text-sm">
                    {hasNPWP
                      ? "Memiliki NPWP (PPh 22: 2.5%)"
                      : "Tidak memiliki NPWP (PPh 22: 7.5%)"}
                  </Label>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="info">Informasi Tambahan</Label>
                <div className="pt-2 text-sm text-muted-foreground">
                  <p>• Semua nilai dalam mata uang Rupiah (IDR)</p>
                  <p>• Perhitungan sesuai peraturan DJBC</p>
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
                      <span className="text-sm font-medium">
                        AI sedang menganalisis...
                      </span>
                    </div>
                    <Progress
                      value={(processingStep / 4) * 100}
                      className="h-2"
                    />
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
          </div>
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
            <CardDescription>
              Pilih HS Code yang paling sesuai dengan barang Anda
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recommendations.map((rec, index) => (
              <Card
                key={rec.code}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedHSCode?.code === rec.code
                    ? "ring-2 ring-primary bg-primary/5"
                    : ""
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
                          variant={
                            rec.confidence >= 80
                              ? "secondary"
                              : rec.confidence >= 70
                              ? "default"
                              : "outline"
                          }
                        >
                          {rec.confidence}% confidence
                        </Badge>
                        <Badge variant="outline">{rec.category}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {rec.description}
                      </p>
                    </div>
                    {selectedHSCode?.code === rec.code && (
                      <CheckCircle className="h-5 w-5 text-secondary ml-2" />
                    )}
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
              Berdasarkan HS Code: {selectedHSCode.code} -{" "}
              {selectedHSCode.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-muted/30 p-4 rounded-lg mb-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">
                    CIF Value (Cost, Insurance, Freight)
                  </span>
                  <span className="font-medium">
                    {formatIDR(taxCalculation.cif_idr)}
                  </span>
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
                      {(selectedHSCode.tarif_bea_masuk * 100).toFixed(1)}% dari
                      CIF
                    </p>
                  </div>
                  <span className="font-medium">
                    {formatIDR(taxCalculation.beaMasuk)}
                  </span>
                </div>
                <Separator />

                <div className="flex justify-between items-center py-2">
                  <div>
                    <span className="font-medium">PPN</span>
                    <p className="text-xs text-muted-foreground">
                      11% dari DPP (CIF + Bea Masuk)
                    </p>
                  </div>
                  <span className="font-medium">
                    {formatIDR(taxCalculation.ppn)}
                  </span>
                </div>
                <Separator />

                <div className="flex justify-between items-center py-2">
                  <div>
                    <span className="font-medium">PPh Pasal 22</span>
                    <p className="text-xs text-muted-foreground">
                      {hasNPWP ? "2.5%" : "7.5%"} dari DPP (
                      {hasNPWP ? "dengan" : "tanpa"} NPWP)
                    </p>
                  </div>
                  <span className="font-medium">
                    {formatIDR(taxCalculation.pph22)}
                  </span>
                </div>

                {/* Biaya Layanan */}
                {layananTerpilih.length > 0 && (
                  <>
                    <Separator />
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <h4 className="font-medium mb-2 flex items-center">
                        <Truck className="h-4 w-4 mr-2" />
                        Biaya Layanan Pelabuhan
                      </h4>
                      {layananTerpilih.map((layanan) => (
                        <div
                          key={layanan}
                          className="flex justify-between items-center py-1"
                        >
                          <span className="text-sm text-muted-foreground">
                            {layanan}
                          </span>
                          <span className="text-sm font-medium">
                            {formatIDR(
                              hitungTarifLayanan(
                                layanan,
                                jenisKontainer,
                                ukuranKontainer
                              )
                            )}
                          </span>
                        </div>
                      ))}
                      <Separator className="my-2" />
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Total Biaya Layanan</span>
                        <span className="font-medium">
                          {formatIDR(
                            layananTerpilih.reduce(
                              (total, layanan) =>
                                total +
                                hitungTarifLayanan(
                                  layanan,
                                  jenisKontainer,
                                  ukuranKontainer
                                ),
                              0
                            )
                          )}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <Separator className="my-4" />

              {/* Total */}
              <div className="bg-primary/5 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-bold">Total Pajak Impor</span>
                  <span className="text-2xl font-bold text-primary">
                    {formatIDR(taxCalculation.totalPajak)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>Total Landed Cost</span>
                  <span>{formatIDR(taxCalculation.landedCostIdr)}</span>
                </div>
              </div>

              {/* Time Savings Highlight */}
              <Card className="bg-secondary/10 border-secondary/20">
                <CardContent className="pt-4">
                  <div className="flex items-center space-x-2 text-secondary">
                    <Clock className="h-5 w-5" />
                    <span className="font-medium">
                      Estimasi waktu proses PIB berkurang dari jam → menit
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Dengan rekomendasi HS Code yang akurat, proses pengajuan PIB
                    menjadi lebih cepat dan efisien
                  </p>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-4">
                <Button
                  className="flex-1"
                  onClick={() => router.push("/pib-submission")}
                >
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
  );
}
