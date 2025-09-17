def hitung_pajak_impor(
    fob_usd: float,
    freight_usd: float,
    insurance_usd: float,
    tarif_bea_masuk: float,
    tarif_ppn: float = 0.11,
    tarif_pph_npwp: float = 0.025,
    kurs_pajak: float = 16000,
    punya_npwp: bool = True,
    biaya_clearance: float = 0,
    biaya_trucking: float = 0,
    biaya_storage: float = 0
):

    """
    Menghitung pajak impor & landed cost
    sesuai dengan panduan Uniair Cargo.
    """

    cif = fob_usd + freight_usd + insurance_usd

    bea_masuk = cif * tarif_bea_masuk

    dpp = cif + bea_masuk

    ppn = dpp * tarif_ppn

    tarif_pph = tarif_pph_npwp if punya_npwp else 0.075
    pph_22 = dpp * tarif_pph

    total_pajak = bea_masuk + ppn + pph_22

    landed_cost_usd = cif + total_pajak + biaya_clearance + biaya_trucking + biaya_storage

    landed_cost_idr = landed_cost_usd * kurs_pajak

    return {
        "CIF (USD)": cif,
        "Bea Masuk (USD)": bea_masuk,
        "DPP (USD)": dpp,
        "PPN (USD)": ppn,
        "PPh 22 (USD)": pph_22,
        "Total Pajak (USD)": total_pajak,
        "Total Landed Cost (USD)": landed_cost_usd,
        "Total Landed Cost (IDR)": landed_cost_idr
    }


hasil = hitung_pajak_impor(
    fob_usd=5000,
    freight_usd=500,
    insurance_usd=50,
    tarif_bea_masuk=0.05,   # 5%
    kurs_pajak=16000,
    biaya_clearance=150,
    biaya_trucking=100,
    biaya_storage=75
)

for k, v in hasil.items():
    print(f"{k}: {v:,.2f}")