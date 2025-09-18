"use client";

import { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  FileText,
  Ship,
  Package,
  Users,
  Calendar,
  MapPin,
  Truck,
  Calculator,
  DollarSign,
} from "lucide-react";

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

interface HSCodeRecommendation {
  code: string;
  description: string;
  confidence: number;
  category: string;
  tarif_bea_masuk: number;
}

interface PIBFormData {
  // SJC Information
  sjcNumber: string;
  sjcCode: string;
  stuffingDate: string;
  sjcPrintDate: string;

  // Origin & Destination
  origin: string;
  destination: string;
  service: string;

  // Shipper Information
  shipperName: string;
  shipperAddress: string;
  shipperPhone: string;

  // Vessel & Voyage
  vesselName: string;
  roNumber: string;

  // Container Information
  containerPrefix: string;
  containerNumber: string;
  containerSize: string;
  containerStatus: string;
  sealNumber: string;
  spmuCode: string;

  // Vehicle Information
  vehiclePlateNumber: string;

  // Goods & Value Information
  goodsDescription: string;
  hsCode: string;
  fobValue: string;
  freightValue: string;
  insuranceValue: string;
  hasNPWP: boolean;

  // Personnel & Equipment
  sjcClerk: string;
  equipmentOperator: string;
  equipmentCode: string;
}

export function PIBSubmissionForm() {
  // Simulasi user login
  const loggedInUser = { name: "Admin Pelabuhan" };

  // Helper untuk generate kode unik
  function generateSJCNumber() {
    const now = new Date();
    return `SJC-${now.getFullYear()}${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}${String(now.getDate()).padStart(2, "0")}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;
  }

  function generateSJCCode() {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  }

  function generateRONumber() {
    const now = new Date();
    return `RO-${now.getFullYear()}${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}${String(now.getDate()).padStart(2, "0")}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;
  }

  // Helper untuk format ke datetime-local Asia/Jakarta
  function getJakartaDateTimeLocalString(date = new Date()) {
    // Konversi ke Asia/Jakarta
    const jakartaOffset = 7 * 60; // +07:00 in minutes
    const local = new Date(
      date.getTime() + (jakartaOffset - date.getTimezoneOffset()) * 60000
    );
    // Format yyyy-MM-ddTHH:mm
    return local.toISOString().slice(0, 16);
  }

  const [formData, setFormData] = useState<PIBFormData>({
    sjcNumber: generateSJCNumber(),
    sjcCode: generateSJCCode(),
    stuffingDate: "",
    sjcPrintDate: getJakartaDateTimeLocalString(),
    origin: "",
    destination: "",
    service: "",
    shipperName: "",
    shipperAddress: "",
    shipperPhone: "",
    vesselName: "",
    roNumber: generateRONumber(),
    containerPrefix: "",
    containerNumber: "",
    containerSize: "",
    containerStatus: "FCL",
    sealNumber: "",
    spmuCode: "30408989 M6 19 SBL A",
    vehiclePlateNumber: "",
    goodsDescription: "",
    hsCode: "",
    fobValue: "",
    freightValue: "",
    insuranceValue: "",
    hasNPWP: true,
    sjcClerk: loggedInUser.name,
    equipmentOperator: "",
    equipmentCode: "AUTO-ALAT-01",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTaxCalculation, setShowTaxCalculation] = useState(false);
  const [taxCalculation, setTaxCalculation] = useState<TaxCalculation | null>(
    null
  );
  const [selectedHSCode, setSelectedHSCode] =
    useState<HSCodeRecommendation | null>(null);

  // Auto-fill service berdasarkan origin/destination/vesselName
  useEffect(() => {
    // Simulasi: jika origin/destination diisi, auto service
    if (formData.origin && formData.destination) {
      setFormData((prev) => ({
        ...prev,
        service: `${formData.origin} – ${formData.destination}`,
      }));
    }
  }, [formData.origin, formData.destination]);

  // Auto RO No jika vesselName berubah
  useEffect(() => {
    if (formData.vesselName) {
      setFormData((prev) => ({ ...prev, roNumber: generateRONumber() }));
    }
  }, [formData.vesselName]);

  const handleInputChange = (field: keyof PIBFormData, value: string) => {
    // Prevent manual edit for auto fields
    const autoFields = [
      "sjcNumber",
      "sjcCode",
      "sjcPrintDate",
      "service",
      "roNumber",
      "containerStatus",
      "equipmentCode",
      "sjcClerk",
    ];
    if (autoFields.includes(field)) return;

    // Format plat nomor otomatis
    if (field === "vehiclePlateNumber") {
      // Hapus karakter selain huruf dan angka
      const cleanValue = value.replace(/[^A-Za-z0-9]/g, "");
      // Format: huruf - angka - huruf (contoh: B1234ABC -> B 1234 ABC)
      const formatted = cleanValue
        .replace(/^([A-Za-z]{1,2})([0-9]+)([A-Za-z]*)$/, "$1 $2 $3")
        .trim();
      setFormData((prev) => ({ ...prev, [field]: formatted }));
      return;
    }

    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Fungsi format IDR
  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Fungsi perhitungan pajak
  const calculateTax = () => {
    const fob = Number.parseFloat(formData.fobValue) || 0;
    const freight = Number.parseFloat(formData.freightValue) || 0;
    const insurance = Number.parseFloat(formData.insuranceValue) || 0;

    // Mock HS Code - di production bisa diintegrasikan dengan API
    const mockHSCode: HSCodeRecommendation = {
      code: formData.hsCode || "8517.12.00",
      description:
        "Telepon untuk jaringan seluler atau untuk jaringan nirkabel lainnya",
      confidence: 85,
      category: "Electronics",
      tarif_bea_masuk: 0.15, // 15%
    };
    setSelectedHSCode(mockHSCode);

    // Perhitungan pajak
    const cif_idr = fob + freight + insurance;
    const bea_masuk = cif_idr * mockHSCode.tarif_bea_masuk;
    const dpp = cif_idr + bea_masuk;
    const ppn = dpp * 0.11; // 11%
    const tarif_pph = formData.hasNPWP ? 0.025 : 0.075;
    const pph_22 = dpp * tarif_pph;
    const total_pajak = bea_masuk + ppn + pph_22;
    const landed_cost_idr = cif_idr + total_pajak;

    setTaxCalculation({
      cif_idr: cif_idr,
      beaMasuk: bea_masuk,
      dpp: dpp,
      ppn: ppn,
      pph22: pph_22,
      totalPajak: total_pajak,
      totalBiayaLayanan: 0,
      landedCostIdr: landed_cost_idr,
    });

    setShowTaxCalculation(true);
  };

  const handleSubmit = async () => {
    console.log("[GATEGO] PIB submit button clicked");
    console.log("[GATEGO] Form data:", formData);

    setIsSubmitting(true);

    try {
      const requiredFields = [
        "sjcNumber",
        "origin",
        "destination",
        "shipperName",
        "vesselName",
        "containerNumber",
        "goodsDescription",
        "fobValue",
      ];
      const missingFields = requiredFields.filter(
        (field) => !formData[field as keyof PIBFormData]
      );

      if (missingFields.length > 0) {
        alert(`Mohon lengkapi field berikut: ${missingFields.join(", ")}`);
        setIsSubmitting(false);
        return;
      }

      console.log("[GATEGO] Starting PIB submission process");
      // Simulate PIB submission process
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("[GATEGO] PIB submission completed");
      alert("PIB berhasil disubmit! Nomor registrasi akan dikirim via email.");

      // Reset form
      setFormData({
        sjcNumber: generateSJCNumber(),
        sjcCode: generateSJCCode(),
        stuffingDate: "",
        sjcPrintDate: getJakartaDateTimeLocalString(),
        origin: "",
        destination: "",
        service: "",
        shipperName: "",
        shipperAddress: "",
        shipperPhone: "",
        vesselName: "",
        roNumber: generateRONumber(),
        containerPrefix: "",
        containerNumber: "",
        containerSize: "",
        containerStatus: "FCL",
        sealNumber: "",
        spmuCode: "30408989 M6 19 SBL A",
        vehiclePlateNumber: "",
        goodsDescription: "",
        hsCode: "",
        fobValue: "",
        freightValue: "",
        insuranceValue: "",
        hasNPWP: true,
        sjcClerk: loggedInUser.name,
        equipmentOperator: "",
        equipmentCode: "AUTO-ALAT-01",
      });
      setShowTaxCalculation(false);
      setTaxCalculation(null);
      setSelectedHSCode(null);
    } catch (error) {
      console.error("[GATEGO] PIB submission error:", error);
      alert("Terjadi kesalahan saat mengirim PIB. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">
                Form Pemberitahuan Impor Barang (PIB)
              </CardTitle>
              <CardDescription>
                Lengkapi informasi berikut untuk mengajukan PIB ke Bea Cukai
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/30 p-4 rounded-lg space-y-2">
            <h3 className="font-semibold text-sm">Alur Pengisian Form PIB:</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="flex items-start space-x-2">
                <div className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm shrink-0">
                  1
                </div>
                <div className="text-sm">
                  <p className="font-medium">Isi Data Container</p>
                  <p className="text-xs text-muted-foreground">
                    SJC, asal/tujuan, shipper, kapal, container
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm shrink-0">
                  2
                </div>
                <div className="text-sm">
                  <p className="font-medium">Isi Data Barang & Nilai</p>
                  <p className="text-xs text-muted-foreground">
                    Deskripsi barang, HS Code, nilai FOB/freight/insurance
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm shrink-0">
                  3
                </div>
                <div className="text-sm">
                  <p className="font-medium">Hitung Pajak Impor</p>
                  <p className="text-xs text-muted-foreground">
                    Klik tombol hitung untuk melihat bea masuk, PPN, PPh 22
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm shrink-0">
                  4
                </div>
                <div className="text-sm">
                  <p className="font-medium">Submit PIB</p>
                  <p className="text-xs text-muted-foreground">
                    Kirim PIB ke sistem Bea Cukai setelah semua data
                    terverifikasi
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SJC Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Package className="h-5 w-5 text-primary" />
            <span>Nomor Surat Jalan Container (SJC)</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sjcNumber">No. SJC</Label>
              <Input
                id="sjcNumber"
                placeholder="Nomor SJC otomatis"
                value={formData.sjcNumber}
                readOnly
                className="bg-gray-100 cursor-not-allowed"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sjcCode">SJC Code</Label>
              <Input
                id="sjcCode"
                placeholder="Kode SJC otomatis"
                value={formData.sjcCode}
                readOnly
                className="bg-gray-100 cursor-not-allowed"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Date & Time */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-primary" />
            <span>Tanggal & Waktu</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stuffingDate">Tanggal Stuffing</Label>
              <Input
                id="stuffingDate"
                type="datetime-local"
                value={formData.stuffingDate}
                onChange={(e) =>
                  handleInputChange("stuffingDate", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sjcPrintDate">Tanggal Cetak SJC</Label>
              <Input
                id="sjcPrintDate"
                type="datetime-local"
                value={formData.sjcPrintDate}
                readOnly
                className="bg-gray-100 cursor-not-allowed"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Origin & Destination */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-primary" />
            <span>Asal & Tujuan</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="origin">Dari</Label>
              <Select
                value={formData.origin}
                onValueChange={(value) => handleInputChange("origin", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih asal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Surabaya">Surabaya</SelectItem>
                  <SelectItem value="Makassar">Makassar</SelectItem>
                  <SelectItem value="Jakarta">Jakarta</SelectItem>
                  <SelectItem value="Balikpapan">Balikpapan</SelectItem>
                  <SelectItem value="Malaysia">Malaysia</SelectItem>
                  <SelectItem value="Singapura">Singapura</SelectItem>
                  <SelectItem value="Indonesia">Indonesia</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="destination">Ke</Label>
              <Select
                value={formData.destination}
                onValueChange={(value) =>
                  handleInputChange("destination", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tujuan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Surabaya">Surabaya</SelectItem>
                  <SelectItem value="Makassar">Makassar</SelectItem>
                  <SelectItem value="Jakarta">Jakarta</SelectItem>
                  <SelectItem value="Balikpapan">Balikpapan</SelectItem>
                  <SelectItem value="Malaysia">Malaysia</SelectItem>
                  <SelectItem value="Singapura">Singapura</SelectItem>
                  <SelectItem value="Indonesia">Indonesia</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="service">Service</Label>
              <Input
                id="service"
                value={formData.service}
                readOnly
                className="bg-gray-100 cursor-not-allowed"
                placeholder="Service otomatis"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shipper Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-primary" />
            <span>Shipper (Pengirim)</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="shipperName">Nama Shipper</Label>
            <Input
              id="shipperName"
              placeholder="Nama perusahaan pengirim"
              value={formData.shipperName}
              onChange={(e) => handleInputChange("shipperName", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="shipperAddress">Alamat Shipper</Label>
            <Textarea
              id="shipperAddress"
              placeholder="Alamat lengkap pengirim"
              value={formData.shipperAddress}
              onChange={(e) =>
                handleInputChange("shipperAddress", e.target.value)
              }
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="shipperPhone">Telepon Shipper</Label>
            <Input
              id="shipperPhone"
              placeholder="Nomor telepon pengirim"
              value={formData.shipperPhone}
              onChange={(e) =>
                handleInputChange("shipperPhone", e.target.value)
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Vessel & Voyage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Ship className="h-5 w-5 text-primary" />
            <span>Vessel (Kapal) & Voyage</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vesselName">Vessel</Label>
              <Select
                value={formData.vesselName}
                onValueChange={(value) =>
                  handleInputChange("vesselName", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kapal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="KM. Dharma Kartika">
                    KM. Dharma Kartika
                  </SelectItem>
                  <SelectItem value="KM. Kirana">KM. Kirana</SelectItem>
                  <SelectItem value="KM. Bukit Raya">KM. Bukit Raya</SelectItem>
                  <SelectItem value="KM. Labobar">KM. Labobar</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="roNumber">RO#</Label>
              <Input
                id="roNumber"
                placeholder="Nomor RO otomatis"
                value={formData.roNumber}
                readOnly
                className="bg-gray-100 cursor-not-allowed"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Container Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Package className="h-5 w-5 text-primary" />
            <span>Container</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="containerPrefix">Prefix</Label>
              <Input
                id="containerPrefix"
                placeholder="Prefix container"
                value={formData.containerPrefix}
                onChange={(e) =>
                  handleInputChange("containerPrefix", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="containerNumber">Nomor Container</Label>
              <Input
                id="containerNumber"
                placeholder="Nomor container"
                value={formData.containerNumber}
                onChange={(e) =>
                  handleInputChange("containerNumber", e.target.value)
                }
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="containerSize">Ukuran</Label>
              <Select
                value={formData.containerSize}
                onValueChange={(value) =>
                  handleInputChange("containerSize", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih ukuran" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="20">20 feet</SelectItem>
                  <SelectItem value="40">40 feet</SelectItem>
                  <SelectItem value="40HC">40 feet HC</SelectItem>
                  <SelectItem value="45">45 feet</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="containerStatus">Status</Label>
              <Input
                id="containerStatus"
                value={formData.containerStatus}
                readOnly
                className="bg-gray-100 cursor-not-allowed"
                placeholder="Status otomatis"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sealNumber">Seal</Label>
              <Input
                id="sealNumber"
                placeholder="Nomor seal"
                value={formData.sealNumber}
                onChange={(e) =>
                  handleInputChange("sealNumber", e.target.value)
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="spmuCode">SPMU</Label>
            <Input
              id="spmuCode"
              value={formData.spmuCode}
              onChange={(e) => handleInputChange("spmuCode", e.target.value)}
              className="font-mono"
            />
            <p className="text-xs text-muted-foreground">
              Kode SPMU otomatis terisi
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Truck className="h-5 w-5 text-primary" />
            <span>Informasi Kendaraan</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="vehiclePlateNumber">Plat Nomor Kendaraan</Label>
            <Input
              id="vehiclePlateNumber"
              placeholder="Contoh: B 1234 ABC atau L 5678 DE"
              value={formData.vehiclePlateNumber}
              onChange={(e) =>
                handleInputChange("vehiclePlateNumber", e.target.value)
              }
              maxLength={15}
            />
            <div className="text-xs text-muted-foreground space-y-1">
              <p>• Masukkan nomor plat kendaraan yang mengangkut container</p>
              <p>• Format akan otomatis disesuaikan (B1234ABC → B 1234 ABC)</p>
              <p>
                • Contoh: B 1234 ABC (Jakarta), L 5678 DE (Surabaya), D 9012 FG
                (Bandung)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Goods & Value Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5 text-primary" />
            <span>Informasi Barang & Nilai</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="goodsDescription">Deskripsi Detail Barang</Label>
            <Textarea
              id="goodsDescription"
              placeholder="Contoh: Laptop ASUS ROG Strix, Intel Core i7-12700H, 16GB RAM, 512GB SSD, RTX 3060"
              value={formData.goodsDescription}
              onChange={(e) =>
                handleInputChange("goodsDescription", e.target.value)
              }
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hsCode">HS Code</Label>
            <Input
              id="hsCode"
              placeholder="Contoh: 8517.12.00"
              value={formData.hsCode}
              onChange={(e) => handleInputChange("hsCode", e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Masukkan HS Code sesuai jenis barang yang diimpor
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fobValue">Nilai FOB (IDR)</Label>
              <Input
                id="fobValue"
                type="number"
                placeholder="24000000"
                value={formData.fobValue}
                onChange={(e) => handleInputChange("fobValue", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="freightValue">Freight (IDR)</Label>
              <Input
                id="freightValue"
                type="number"
                placeholder="3200000"
                value={formData.freightValue}
                onChange={(e) =>
                  handleInputChange("freightValue", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="insuranceValue">Insurance (IDR)</Label>
              <Input
                id="insuranceValue"
                type="number"
                placeholder="800000"
                value={formData.insuranceValue}
                onChange={(e) =>
                  handleInputChange("insuranceValue", e.target.value)
                }
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="hasNPWP"
              checked={formData.hasNPWP}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, hasNPWP: checked }))
              }
            />
            <Label htmlFor="hasNPWP" className="text-sm">
              {formData.hasNPWP
                ? "Memiliki NPWP (PPh 22: 2.5%)"
                : "Tidak memiliki NPWP (PPh 22: 7.5%)"}
            </Label>
          </div>

          <Button
            onClick={calculateTax}
            className="w-full"
            disabled={!formData.goodsDescription || !formData.fobValue}
          >
            <Calculator className="h-4 w-4 mr-2" />
            Hitung Pajak Impor
          </Button>

          {/* Status Alur PIB */}
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium">Status Alur PIB</p>
              <Badge
                variant={showTaxCalculation ? "secondary" : "outline"}
                className={
                  showTaxCalculation
                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                    : ""
                }
              >
                {showTaxCalculation ? "Siap Submit" : "Pengisian Data"}
              </Badge>
            </div>
            <div className="w-full bg-muted h-2 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300 rounded-full"
                style={{
                  width: showTaxCalculation
                    ? "100%"
                    : formData.goodsDescription && formData.fobValue
                    ? "75%"
                    : "50%",
                }}
              />
            </div>
            <div className="flex justify-between mt-1 text-[10px] text-muted-foreground">
              <span>Data Container</span>
              <span>Data Barang</span>
              <span>Perhitungan</span>
              <span>Submit</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tax Calculation Results */}
      {showTaxCalculation && taxCalculation && selectedHSCode && (
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
                      {formData.hasNPWP ? "2.5%" : "7.5%"} dari DPP (
                      {formData.hasNPWP ? "dengan" : "tanpa"} NPWP)
                    </p>
                  </div>
                  <span className="font-medium">
                    {formatIDR(taxCalculation.pph22)}
                  </span>
                </div>
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

              {/* Langkah Selanjutnya */}
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start space-x-2">
                <div className="text-green-500 mt-0.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <div className="text-sm text-green-800">
                  <p className="font-medium">Perhitungan Selesai</p>
                  <p className="text-xs mt-1">
                    Perhitungan pajak berhasil! Silakan periksa hasil
                    perhitungan dan lanjutkan ke langkah terakhir dengan klik
                    tombol "Submit PIB ke Bea Cukai" di bawah.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Personnel & Equipment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-primary" />
            <span>Petugas & Alat</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sjcClerk">Kerani SJC</Label>
              <Input
                id="sjcClerk"
                placeholder="Nama kerani otomatis"
                value={formData.sjcClerk}
                readOnly
                className="bg-gray-100 cursor-not-allowed"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="equipmentOperator">Operator Alat</Label>
              <Input
                id="equipmentOperator"
                placeholder="Nama operator alat"
                value={formData.equipmentOperator}
                onChange={(e) =>
                  handleInputChange("equipmentOperator", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="equipmentCode">Kode Alat</Label>
              <Input
                id="equipmentCode"
                placeholder="Kode alat otomatis"
                value={formData.equipmentCode}
                readOnly
                className="bg-gray-100 cursor-not-allowed"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex space-x-4">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !showTaxCalculation}
              className="flex-1"
              type="button"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                  Mengirim PIB...
                </>
              ) : (
                "Submit PIB ke Bea Cukai"
              )}
            </Button>
            <Button
              variant="outline"
              className="flex-1 bg-transparent"
              type="button"
            >
              Simpan Draft
            </Button>
          </div>
          {!showTaxCalculation ? (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start space-x-2">
              <div className="text-amber-500 mt-0.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
              <div className="text-sm text-amber-800">
                <p className="font-medium">Alur Pengisian PIB</p>
                <p className="text-xs mt-1">
                  Lengkapi data barang dan nilai, lalu klik tombol "Hitung Pajak
                  Impor" untuk melihat perhitungan pajak sebelum submit
                </p>
              </div>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Pastikan semua data sudah benar sebelum mengirim PIB ke sistem Bea
              Cukai
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
