//ubah nilai float dari BE ke 1 angka dibelakang koma
export const formattedKoma1 = (number) =>
  number.toLocaleString("id-ID", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
