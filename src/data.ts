export interface MonthlyData {
  month: string;
  sales: number;
  expenses: {
    material: number;
    labor: number;
    rent: number;
    others: number;
    details: {
      materialFirst: number;
      materialSecond: number;
      labor: number;
      rent: number;
      admin: number;
      accounting: number;
      royalty: number;
      promotion: number;
      cctv: number;
      radio: number;
      insurance: number;
    }
  };
}

export const financialData: MonthlyData[] = [
  { month: "2026-01", sales: 25400000, expenses: { material: 7151890, labor: 5100280, rent: 3630000, others: 1181074, details: { materialFirst: 3632343, materialSecond: 3519547, labor: 5100280, rent: 3630000, admin: 778490, accounting: 88000, royalty: 176000, promotion: 32550, cctv: 72270, radio: 8250, insurance: 25514 }}},
  { month: "2026-02", sales: 23800000, expenses: { material: 6293270, labor: 4963145, rent: 3630000, others: 1099545, details: { materialFirst: 3389983, materialSecond: 2903287, labor: 4963145, rent: 3630000, admin: 696961, accounting: 88000, royalty: 176000, promotion: 32550, cctv: 72270, radio: 8250, insurance: 25514 }}},
  { month: "2026-03", sales: 28200000, expenses: { material: 7882181, labor: 5319912, rent: 3630000, others: 1037367, details: { materialFirst: 4053400, materialSecond: 3828781, labor: 5319912, rent: 3630000, admin: 634783, accounting: 88000, royalty: 176000, promotion: 32550, cctv: 72270, radio: 8250, insurance: 25514 }}},
  { month: "2026-04", sales: 29500000, expenses: { material: 9337063, labor: 5319717, rent: 3630000, others: 952697, details: { materialFirst: 4568664, materialSecond: 4768399, labor: 5319717, rent: 3630000, admin: 583213, accounting: 88000, royalty: 176000, promotion: 0, cctv: 72270, radio: 7700, insurance: 25514 }}},
  { month: "2026-05", sales: 31000000, expenses: { material: 10642664, labor: 5458326, rent: 3630000, others: 987727, details: { materialFirst: 3260041, materialSecond: 7382623, labor: 5458326, rent: 3630000, admin: 585803, accounting: 88000, royalty: 176000, promotion: 32550, cctv: 72160, radio: 7700, insurance: 25514 }}},
  { month: "2026-06", sales: 26000000, expenses: { material: 6579401, labor: 5443281, rent: 3630000, others: 1088555, details: { materialFirst: 3268391, materialSecond: 3311010, labor: 5443281, rent: 3630000, admin: 719071, accounting: 88000, royalty: 176000, promotion: 0, cctv: 72270, radio: 7700, insurance: 25514 }}},
  { month: "2026-07", sales: 27500000, expenses: { material: 7614007, labor: 5752122, rent: 3630000, others: 1253090, details: { materialFirst: 3688625, materialSecond: 3925382, labor: 5752122, rent: 3630000, admin: 955106, accounting: 88000, royalty: 176000, promotion: 0, cctv: 72270, radio: 7700, insurance: 25514 }}},
  { month: "2026-08", sales: 32000000, expenses: { material: 7749432, labor: 5471821, rent: 3630000, others: 1397757, details: { materialFirst: 3573539, materialSecond: 4175893, labor: 5471821, rent: 3630000, admin: 1069443, accounting: 88000, royalty: 176000, promotion: 29700, cctv: 72400, radio: 7700, insurance: 25514 }}},
  { month: "2026-09", sales: 29800000, expenses: { material: 9309081, labor: 5586128, rent: 3630000, others: 1285227, details: { materialFirst: 4164186, materialSecond: 5144895, labor: 5586128, rent: 3630000, admin: 995243, accounting: 88000, royalty: 176000, promotion: 0, cctv: 72270, radio: 7700, insurance: 25514 }}},
  { month: "2026-10", sales: 33000000, expenses: { material: 10485947, labor: 5471820, rent: 3630000, others: 1109825, details: { materialFirst: 4507322, materialSecond: 5978625, labor: 5471820, rent: 3630000, admin: 719841, accounting: 88000, royalty: 176000, promotion: 0, cctv: 72270, radio: 7700, insurance: 25514 }}},
  { month: "2026-11", sales: 31500000, expenses: { material: 10264404, labor: 5843575, rent: 3630000, others: 1150112, details: { materialFirst: 5769558, materialSecond: 4494846, labor: 5843575, rent: 3630000, admin: 724578, accounting: 88000, royalty: 176000, promotion: 35850, cctv: 72470, radio: 7700, insurance: 25514 }}},
  { month: "2026-12", sales: 28900000, expenses: { material: 8973727, labor: 5834790, rent: 3630000, others: 1126379, details: { materialFirst: 4347379, materialSecond: 4626348, labor: 5834790, rent: 3630000, admin: 730575, accounting: 88000, royalty: 176000, promotion: 0, cctv: 72090, radio: 7700, insurance: 25514 }}}
];

export const getMonthName = (monthStr: string) => {
  const [year, month] = monthStr.split("-");
  return `${year.slice(2)}.${parseInt(month, 10)}`;
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('ko-KR').format(amount) + '원';
};

export const formatCompact = (amount: number) => {
  return (amount / 10000).toLocaleString('ko-KR') + '만';
};
