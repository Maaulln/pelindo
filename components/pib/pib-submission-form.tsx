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
import { FileText, Ship, Package, Users, Calendar, MapPin } from "lucide-react";

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
    sjcClerk: loggedInUser.name,
    equipmentOperator: "",
    equipmentCode: "AUTO-ALAT-01",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    console.log("[v0] PIB submit button clicked");
    console.log("[v0] Form data:", formData);

    setIsSubmitting(true);

    try {
      const requiredFields = [
        "sjcNumber",
        "origin",
        "destination",
        "shipperName",
        "vesselName",
        "containerNumber",
      ];
      const missingFields = requiredFields.filter(
        (field) => !formData[field as keyof PIBFormData]
      );

      if (missingFields.length > 0) {
        alert(`Mohon lengkapi field berikut: ${missingFields.join(", ")}`);
        setIsSubmitting(false);
        return;
      }

      console.log("[v0] Starting PIB submission process");
      // Simulate PIB submission process
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("[v0] PIB submission completed");
      alert("PIB berhasil disubmit! Nomor registrasi akan dikirim via email.");

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
        sjcClerk: loggedInUser.name,
        equipmentOperator: "",
        equipmentCode: "AUTO-ALAT-01",
      });
    } catch (error) {
      console.error("[v0] PIB submission error:", error);
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
              disabled={isSubmitting}
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
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Pastikan semua data sudah benar sebelum mengirim PIB ke sistem Bea
            Cukai
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
