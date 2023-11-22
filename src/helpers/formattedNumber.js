//ubah nilai float dari BE ke format indonesia
export const formattedNumber = (number) =>
  number.toLocaleString("id-ID", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
