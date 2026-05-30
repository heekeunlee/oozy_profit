// 2025년 vs 2026년 손익 비교용 원본 데이터 세트
window.compareData = [
  {
    month: "01",
    sales2025: 25400000,
    expenses2025: 17063244,
    profit2025: 8336756,
    sales2026: 26163100,
    expenses2026: 19393463,
    profit2026: 6769637,
    isEstimate2026: false
  },
  {
    month: "02",
    sales2025: 23800000,
    expenses2025: 15985960,
    profit2025: 7814040,
    sales2026: 25383300,
    expenses2026: 18113717,
    profit2026: 7269583,
    isEstimate2026: false
  },
  {
    month: "03",
    sales2025: 28200000,
    expenses2025: 17869460,
    profit2025: 10330540,
    sales2026: 31570300,
    expenses2026: 21280202,
    profit2026: 10290098,
    isEstimate2026: false
  },
  {
    month: "04",
    sales2025: 29500000,
    expenses2025: 19239477,
    profit2025: 10260523,
    sales2026: 36150100,
    expenses2026: 23048903,
    profit2026: 13101197,
    isEstimate2026: false
  },
  {
    month: "05",
    sales2025: 31000000,
    expenses2025: 20718717,
    profit2025: 10281283,
    sales2026: 33133800,
    // 2026년 5월 경비는 재료비상반(5,851,412원)만 부분 반영된 상태임
    expenses2026: 5851412,
    profit2026: 27282388,
    isEstimate2026: true,
    // 시뮬레이터를 위한 보정 디폴트 값들
    defaultSimulation: {
      rent: 3630000,     // 고정 임대료
      labor: 5400000,    // 예상 인건비
      others: 1100000    // 기타 관리/운영 경비
    }
  },
  {
    month: "06",
    sales2025: 30876500,
    expenses2025: 16741237,
    profit2025: 14135263,
    sales2026: null,
    expenses2026: null,
    profit2026: null,
    isEstimate2026: true
  },
  {
    month: "07",
    sales2025: 31526400,
    expenses2025: 18320719,
    profit2025: 13205681,
    sales2026: null,
    expenses2026: null,
    profit2026: null,
    isEstimate2026: true
  },
  {
    month: "08",
    sales2025: 35340300,
    expenses2025: 18320010,
    profit2025: 17020290,
    sales2026: null,
    expenses2026: null,
    profit2026: null,
    isEstimate2026: true
  },
  {
    month: "09",
    sales2025: 34939500,
    expenses2025: 19889936,
    profit2025: 15049564,
    sales2026: null,
    expenses2026: null,
    profit2026: null,
    isEstimate2026: true
  },
  {
    month: "10",
    sales2025: 33211100,
    expenses2025: 20677092,
    profit2025: 12534008,
    sales2026: null,
    expenses2026: null,
    profit2026: null,
    isEstimate2026: true
  },
  {
    month: "11",
    sales2025: 32343100,
    expenses2025: 20868091,
    profit2025: 11475009,
    sales2026: null,
    expenses2026: null,
    profit2026: null,
    isEstimate2026: true
  },
  {
    month: "12",
    sales2025: 26611800,
    expenses2025: 19538396,
    profit2025: 7073404,
    sales2026: null,
    expenses2026: null,
    profit2026: null,
    isEstimate2026: true
  }
];
