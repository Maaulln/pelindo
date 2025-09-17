# ==========================
# Tarif Pelayanan Pelindo
# ==========================

tarif_storage = {
    "Full Container": {
        "20ft": 26700,
        "40ft": 53400,
        "45ft": 66800
    },
    "Empty Container": {
        "20ft": 12000,
        "40ft": 24000,
        "45ft": 30000
    },
    "DG Container (IMDG-CODE)": {
        "20ft": 36000,
        "40ft": 72000,
        "45ft": 90000
    },
    "Reefer Container": {
        "20ft": 48000,
        "40ft": 96000,
        "45ft": 120000
    },
    "Overdimension Container (OH/OW/OL)": {
        "20ft": 48000,
        "40ft": 96000,
        "45ft": 120000
    },
    "Loaded Chassis": {
        "20ft": 20000,
        "40ft": 40000,
        "45ft": 50000
    },
    "Empty Chassis": {
        "20ft": 20000,
        "40ft": 40000,
        "45ft": 50000
    },
    "Uncontainerized": {
        "1-20 ton": 54000,
        "21-35 ton": 108000,
        ">35 ton": 135000
    }
}

tarif_lift = {
    "Full Container": {
        "20ft": 196000,
        "40ft": 295000,
        "45ft": 369000
    },
    "Empty Container": {
        "20ft": 83500,
        "40ft": 125000,
        "45ft": 156250
    },
    "DG Container (IMDG-CODE)": {
        "20ft": 167000,
        "40ft": 250000,
        "45ft": 312500
    },
    "Reefer Container": {
        "20ft": 196000,
        "40ft": 295000,
        "45ft": 369000
    },
    "Overdimension Container (OH/OW/OL)": {
        "20ft": 637000,
        "40ft": 955000,
        "45ft": 1115000
    },
    "Uncontainerized": {
        "1-20 ton": 637000,
        "21-35 ton": 955000,
        ">35 ton": 1115000
    }
}

tarif_haulage = {
    "Full Container": {
        "20ft": 80000,
        "40ft": 120000,
        "45ft": 148000
    },
    "Empty Container": {
        "20ft": 40000,
        "40ft": 65000,
        "45ft": 75000
    },
    "DG Container (IMDG-CODE)": {
        "20ft": 60000,
        "40ft": 90000,
        "45ft": 110000
    },
    "Reefer Container": {
        "20ft": 80000,
        "40ft": 120000,
        "45ft": 148000
    },
    "Overdimension Container (OH/OW/OL)": {
        "20ft": 240000,
        "40ft": 360000,
        "45ft": 440000
    },
    "Uncontainerized": {
        "1-20 ton": 240000,
        "21-35 ton": 360000,
        ">35 ton": 440000
    }
}

tarif_extra_movement = {
    "Full Container": {
        "20ft": 472000,
        "40ft": 710000,
        "45ft": 886000
    },
    "Empty Container": {
        "20ft": 207000,
        "40ft": 315000,
        "45ft": 387500
    },
    "DG Container (IMDG-CODE)": {
        "20ft": 394000,
        "40ft": 590000,
        "45ft": 735000
    },
    "Reefer Container": {
        "20ft": 472000,
        "40ft": 710000,
        "45ft": 886000
    },
    "Overdimension Container (OH/OW/OL)": {
        "20ft": 1514000,
        "40ft": 2270000,
        "45ft": 2670000
    },
    "Uncontainerized": {
        "1-20 ton": 1514000,
        "21-35 ton": 2270000,
        ">35 ton": 2670000
    }
}

# ==========================
# Fungsi Penghitungan
# ==========================

def ambil_tarif(tabel, jenis, ukuran):
    """Ambil tarif dari tabel sesuai jenis & ukuran"""
    if jenis not in tabel:
        raise ValueError(f"Jenis {jenis} tidak ditemukan di tarif")
    if ukuran not in tabel[jenis]:
        raise ValueError(f"Ukuran {ukuran} tidak ditemukan untuk {jenis}")
    return tabel[jenis][ukuran]

def hitung_biaya(jenis, ukuran, layanan, hari_storage=0, jumlah=1):
    """
    jenis       : str  -> jenis kontainer (Full Container, Empty Container, dsb.)
    ukuran      : str  -> ukuran kontainer (20ft, 40ft, 45ft, 1-20 ton, dsb.)
    layanan     : list -> daftar layanan yang dipilih ["storage", "lift", "haulage", "extra_movement"]
    hari_storage: int  -> jumlah hari untuk storage
    jumlah      : int  -> jumlah kontainer/barang
    """

    total = 0
    rincian = {}

    if "storage" in layanan:
        biaya = ambil_tarif(tarif_storage, jenis, ukuran) * hari_storage * jumlah
        rincian["storage"] = biaya
        total += biaya

    if "lift" in layanan:
        biaya = ambil_tarif(tarif_lift, jenis, ukuran) * jumlah
        rincian["lift"] = biaya
        total += biaya

    if "haulage" in layanan:
        biaya = ambil_tarif(tarif_haulage, jenis, ukuran) * jumlah
        rincian["haulage"] = biaya
        total += biaya

    if "extra_movement" in layanan:
        biaya = ambil_tarif(tarif_extra_movement, jenis, ukuran) * jumlah
        rincian["extra_movement"] = biaya
        total += biaya

    return {"total": total, "rincian": rincian}


# ==========================
# Contoh Pemakaian
# ==========================

if __name__ == "__main__":
    # Contoh: 2x Full Container 40ft dengan storage 3 hari + lift
    hasil = hitung_biaya(
        jenis="Full Container",
        ukuran="40ft",
        layanan=["storage", "lift"],
        hari_storage=3,
        jumlah=2
    )

    print("=== HASIL PERHITUNGAN ===")
    for layanan, biaya in hasil["rincian"].items():
        print(f"{layanan.capitalize()} : Rp {biaya:,}")
    print("---------------------------")
    print(f"TOTAL : Rp {hasil['total']:,}")
