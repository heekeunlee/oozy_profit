export interface MonthlyData {
  month: string;
  sales: number;
  expenses: {
    material: number;
    labor: number;
    rent: number;
    others: number;
    details: {
      materialFirst: number; // 재료비상반
      materialSecond: number; // 재료비후반
      labor: number; // 인건비
      rent: number; // 임대료
      admin: number; // 관리비
      accounting: number; // 기장료
      royalty: number; // 로열티
      promotion: number; // 홍보비
      cctv: number; // cctv,전화
      radio: number; // 브랜드라디오
      insurance: number; // 화재보험
    }
  };
}

export const financialData: MonthlyData[] = [
  {
    month: "2026-01",
    sales: 25400000,
    expenses: {
      material: 3632343 + 3519547,
      labor: 5100280,
      rent: 3630000,
      others: 778490 + 88000 + 176000 + 32550 + 72270 + 8250 + 25514,
      details: { materialFirst: 3632343, materialSecond: 3519547, labor: 5100280, rent: 3630000, admin: 778490, accounting: 88000, royalty: 176000, promotion: 32550, cctv: 72270, radio: 8250, insurance: 25514 }
    },
  },
  {
    month: "2026-02",
    sales: 23800000,
    expenses: {
      material: 3389983 + 2903287,
      labor: 4963145,
      rent: 3630000,
      others: 696961 + 88000 + 176000 + 32550 + 72270 + 8250 + 25514,
      details: { materialFirst: 3389983, materialSecond: 2903287, labor: 4963145, rent: 3630000, admin: 696961, accounting: 88000, royalty: 176000, promotion: 32550, cctv: 72270, radio: 8250, insurance: 25514 }
    },
  },
  {
    month: "2026-03",
    sales: 28200000,
    expenses: {
      material: 4053400 + 3828781,
      labor: 5319912,
      rent: 3630000,
      others: 634783 + 88000 + 176000 + 32550 + 72270 + 8250 + 25514,
      details: { materialFirst: 4053400, materialSecond: 3828781, labor: 5319912, rent: 3630000, admin: 634783, accounting: 88000, royalty: 176000, promotion: 32550, cctv: 72270, radio: 8250, insurance: 25514 }
    },
  },
  {
    month: "2026-04",
    sales: 29500000,
    expenses: {
      material: 4568664 + 4768399,
      labor: 5319717,
      rent: 3630000,
      others: 583213 + 88000 + 176000 + 0 + 72270 + 7700 + 25514,
      details: { materialFirst: 4568664, materialSecond: 4768399, labor: 5319717, rent: 3630000, admin: 583213, accounting: 88000, royalty: 176000, promotion: 0, cctv: 72270, radio: 7700, insurance: 25514 }
    },
  },
  {
    month: "2026-05",
    sales: 31000000,
    expenses: {
      material: 3260041 + 7382623,
      labor: 5458326,
      rent: 3630000,
      others: 585803 + 88000 + 176000 + 32550 + 72160 + 7700 + 25514,
      details: { materialFirst: 3260041, materialSecond: 7382623, labor: 5458326, rent: 3630000, admin: 585803, accounting: 88000, royalty: 176000, promotion: 32550, cctv: 72160, radio: 7700, insurance: 25514 }
    },
  },
  {
    month: "2026-06",
    sales: 26000000,
    expenses: {
      material: 3268391 + 3311010,
      labor: 5443281,
      rent: 3630000,
      others: 719071 + 88000 + 176000 + 0 + 72270 + 7700 + 25514,
      details: { materialFirst: 3268391, materialSecond: 3311010, labor: 5443281, rent: 3630000, admin: 719071, accounting: 88000, royalty: 176000, promotion: 0, cctv: 72270, radio: 7700, insurance: 25514 }
    },
  }
];

export const getMonthName = (monthStr: string) => {
  const [, month] = monthStr.split("-");
  return `${parseInt(month, 10)}월`;
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('ko-KR').format(amount) + '원';
};
