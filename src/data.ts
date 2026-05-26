export interface MonthlyData {
  month: string;
  sales: number;
  expenses: {
    material: number; // 재료비
    labor: number; // 인건비
    rent: number; // 임대료
    others: number; // 기타 (관리비, 기장료, 로열티 등)
  };
}

export const financialData: MonthlyData[] = [
  {
    month: "2026-01",
    sales: 25400000,
    expenses: {
      material: 3632343 + 3519547, // 7,151,890
      labor: 5100280,
      rent: 3630000,
      others: 778490 + 88000 + 176000 + 32550 + 72270 + 8250 + 25514, // 1,181,074
    }, // Total: 17,063,244
  },
  {
    month: "2026-02",
    sales: 23800000,
    expenses: {
      material: 3389983 + 2903287, // 6,293,270
      labor: 4963145,
      rent: 3630000,
      others: 696961 + 88000 + 176000 + 32550 + 72270 + 8250 + 25514, // 1,099,545
    }, // Total: 15,985,960
  },
  {
    month: "2026-03",
    sales: 28200000,
    expenses: {
      material: 4053400 + 3828781, // 7,882,181
      labor: 5319912,
      rent: 3630000,
      others: 634783 + 88000 + 176000 + 32550 + 72270 + 8250 + 25514, // 1,037,367
    }, // Total: 17,869,460
  },
  {
    month: "2026-04",
    sales: 29500000,
    expenses: {
      material: 4568664 + 4768399, // 9,337,063
      labor: 5319717,
      rent: 3630000,
      others: 583213 + 88000 + 176000 + 0 + 72270 + 7700 + 25514, // 952,697
    }, // Total: 19,239,477
  },
  {
    month: "2026-05",
    sales: 31000000,
    expenses: {
      material: 3260041 + 7382623, // 10,642,664
      labor: 5458326,
      rent: 3630000,
      others: 585803 + 88000 + 176000 + 32550 + 72160 + 7700 + 25514, // 987,727
    }, // Total: 20,718,717
  },
  {
    month: "2026-06",
    sales: 26000000,
    expenses: {
      material: 3268391 + 3311010, // 6,579,401
      labor: 5443281,
      rent: 3630000,
      others: 719071 + 88000 + 176000 + 0 + 72270 + 7700 + 25514, // 1,088,555
    }, // Total: 16,741,237
  }
];

export const getMonthName = (monthStr: string) => {
  const [, month] = monthStr.split("-");
  return `${parseInt(month, 10)}월`;
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('ko-KR').format(amount) + '원';
};
