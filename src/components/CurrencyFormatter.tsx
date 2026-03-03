
const CurrencyFormatter = (value: number | string | undefined) => {
  if (value === undefined || value === null || value === "") return "0";
  const num = typeof value === "number" ? value : Number(value);
  return num.toLocaleString("en-NG");
};

export default CurrencyFormatter;
