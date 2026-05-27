import { useState, useMemo, useEffect } from 'react';
import { financialData, formatCurrency, formatCompact, getMonthName } from './data';
import { ChevronRight, X, CreditCard, Coffee, Sparkles, BrainCircuit } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, Cell } from 'recharts';

type TimeRange = 'monthly' | '6months' | '1year';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>('monthly');
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(financialData.length - 1);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Determine if a month is an estimate (After 2026-05)
  const isEstimate = (monthStr: string) => {
    const monthNum = parseInt(monthStr.split('-')[1], 10);
    return monthNum > 5;
  };

  const getAiInsight = (monthStr: string) => {
    const monthNum = parseInt(monthStr.split('-')[1], 10);
    switch (monthNum) {
      case 6:
        return {
          flow: "여름의 시작으로 전월 대비 매출은 약간 안정세(2,600만)를 보이나, 본격 성수기를 앞둔 숨 고르기 기간으로 적절한 예측입니다.",
          warning: "예상 재료비 원가율이 약 25%로, 5월(34%) 대비 급격히 낮게 세팅되었습니다. 빙수나 시그니처 아이스 메뉴들의 실제 원가와 부합하는지 꼼꼼한 확인이 필요합니다."
        };
      case 7:
        return {
          flow: "본격적인 무더위 진입과 장마철 배달 수요 증가로 6월 대비 매출 상승(2,750만)이 예상된 매우 현실적인 지표입니다.",
          warning: "인건비가 575만 원으로 역대 최고치 부근으로 설정되어 있습니다. 성수기 알바생 충원에 대비하여, 바쁜 피크 타임 위주의 효율적인 스케줄 배치가 핵심입니다."
        };
      case 8:
        return {
          flow: "연중 최대 매출(3,200만) 피크입니다. 아이스 음료 수요가 극에 달하는 폭염 시즌이므로 예측된 매출 흐름이 매우 타당합니다.",
          warning: "최고 매출임에도 재료비 원가율을 역대 최저인 24.2%로 극도로 낙관적으로 잡았습니다. 성수기 얼음, 컵, 시럽 등의 극심한 로스(Loss)를 반드시 막아야만 달성 가능한 수치입니다."
        };
      case 9:
        return {
          flow: "여름 휴가철 종료 및 선선해진 날씨로 인해 8월 대비 매출이 다소 하락(2,980만)하는 전형적인 카페 가을 초입 패턴이 반영되었습니다.",
          warning: "매출은 줄었으나 재료비 원가율이 31%로 다시 상승하는 것으로 예측되었습니다. 여름 내내 사용하던 아이스 전용 부재료들의 꼼꼼한 재고 처리 및 관리가 순이익 방어의 키가 됩니다."
        };
      case 10:
        return {
          flow: "가을 나들이 및 따뜻한 라떼류 객단가 상승으로 하반기 2차 매출 피크(3,300만)를 달성하는 매우 훌륭한 시나리오입니다.",
          warning: "재료비(1,048만)가 예측치 중 처음으로 1천만 원을 돌파합니다. 베이커리/디저트류와 따뜻한 음료의 원가 비중이 높아져 순이익을 갉아먹지 않도록 원가율 점검이 필요합니다."
        };
      case 11:
        return {
          flow: "10월의 가을 피크 이후 조금씩 안정세(3,150만)에 접어드는 무난하고 현실적인 초겨울 매출 흐름입니다.",
          warning: "매출은 10월 대비 소폭 하락했으나, 인건비(584만)는 1년 중 최고치로 치솟았습니다. 줄어드는 매출 대비 인건비 고정 비용을 어떻게 방어할 것인지가 11월의 숙제입니다."
        };
      case 12:
        return {
          flow: "한겨울 추위 진입으로 홀(매장) 방문객 매출이 다소 감소(2,890만)하는 계절성이 아주 논리적으로 잘 반영되었습니다.",
          warning: "연말 크리스마스 프로모션 등을 위해 재료비나 홍보비 지출이 실제로는 더 늘어날 수 있습니다. 내년을 준비하는 달인 만큼 공격적인 지출보다는 재고 정리에 집중하세요."
        };
      default:
        return {
          flow: "시뮬레이션된 매출 흐름이 기존 데이터 패턴 및 계절성과 부합하는지 정밀 검토가 필요합니다.",
          warning: "매출 대비 재료비 및 인건비 비율이 적절하게 세팅되었는지 사장님의 꼼꼼한 점검이 순이익 달성의 핵심입니다."
        };
    }
  };

  // Data processing based on selected range
  const currentData = useMemo(() => {
    if (timeRange === 'monthly') {
      const d = financialData[selectedMonthIndex];
      const expenses = d.expenses.material + d.expenses.labor + d.expenses.rent + d.expenses.others;
      const isEst = isEstimate(d.month);
      return {
        title: `${getMonthName(d.month)} 현황`,
        isEstimate: isEst,
        sales: d.sales,
        expenses,
        profit: d.sales - expenses,
        details: d.expenses.details
      };
    } else if (timeRange === '6months') {
      // 6 months ending at current selected index, or just last 6 months?
      // Since it's Steve Jobs style, let's just do last 6 actual months or a dynamic 6 months.
      // Let's stick to the latest 6 months of the whole dataset, which includes estimates.
      const data = financialData.slice(Math.max(financialData.length - 6, 0));
      const sales = data.reduce((sum, d) => sum + d.sales, 0);
      const expenses = data.reduce((sum, d) => sum + d.expenses.material + d.expenses.labor + d.expenses.rent + d.expenses.others, 0);
      const hasEstimates = data.some(d => isEstimate(d.month));
      return {
        title: '최근 6개월 누적',
        isEstimate: hasEstimates,
        sales,
        expenses,
        profit: sales - expenses,
        details: null
      };
    } else {
      const sales = financialData.reduce((sum, d) => sum + d.sales, 0);
      const expenses = financialData.reduce((sum, d) => sum + d.expenses.material + d.expenses.labor + d.expenses.rent + d.expenses.others, 0);
      return {
        title: '2026년 전체 누적',
        isEstimate: true, // Full year includes future months
        sales,
        expenses,
        profit: sales - expenses,
        details: null
      };
    }
  }, [timeRange, selectedMonthIndex]);

  const expenseRatio = (currentData.expenses / currentData.sales) * 100;
  const profitRatio = (currentData.profit / currentData.sales) * 100;

  // Chart data for 6 months or 1 year
  const chartData = useMemo(() => {
    const dataSlice = timeRange === '1year' ? financialData : financialData.slice(Math.max(financialData.length - 6, 0));
    return dataSlice.map(d => {
      const exp = d.expenses.material + d.expenses.labor + d.expenses.rent + d.expenses.others;
      return {
        name: getMonthName(d.month),
        isEst: isEstimate(d.month),
        매출: d.sales / 10000,
        지출: exp / 10000,
        순이익: (d.sales - exp) / 10000,
      };
    });
  }, [timeRange]);

  if (showSplash) {
    return (
      <div className="fixed inset-0 bg-[#F5F5F7] flex flex-col items-center justify-center z-[100] animate-out fade-out duration-1000 delay-2000 fill-mode-forwards">
        <div className="animate-in zoom-in duration-700 flex flex-col items-center">
          <div className="w-28 h-28 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center justify-center mb-8 transform transition-transform hover:scale-105">
            <Coffee size={56} className="text-[#007AFF]" strokeWidth={2} />
          </div>
          <h1 className="text-3xl font-bold text-[#1D1D1F] tracking-tight">우지 밸런스</h1>
          <p className="text-[#86868B] mt-3 font-medium text-[15px]">가장 아름다운 손익의 시작</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] font-sans selection:bg-[#007AFF] selection:text-white pb-24 animate-in fade-in duration-700">
      
      {/* Premium Header */}
      <header className="pt-14 pb-5 px-6 sticky top-0 bg-[#F5F5F7]/80 backdrop-blur-2xl z-20 border-b border-[#000000]/5">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-[#1D1D1F]">
            우지 밸런스
          </h1>
          <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center">
            <Coffee size={20} className="text-[#007AFF]" />
          </div>
        </div>
        
        {/* Apple-style Segmented Control */}
        <div className="flex bg-[#E3E3E8] p-1 rounded-xl">
          <button 
            onClick={() => setTimeRange('monthly')}
            className={`flex-1 py-1.5 text-[15px] font-semibold rounded-[8px] transition-all duration-300 ${timeRange === 'monthly' ? 'bg-white text-[#1D1D1F] shadow-sm' : 'text-[#86868B]'}`}
          >
            월별
          </button>
          <button 
            onClick={() => setTimeRange('6months')}
            className={`flex-1 py-1.5 text-[15px] font-semibold rounded-[8px] transition-all duration-300 ${timeRange === '6months' ? 'bg-white text-[#1D1D1F] shadow-sm' : 'text-[#86868B]'}`}
          >
            반기
          </button>
          <button 
            onClick={() => setTimeRange('1year')}
            className={`flex-1 py-1.5 text-[15px] font-semibold rounded-[8px] transition-all duration-300 ${timeRange === '1year' ? 'bg-white text-[#1D1D1F] shadow-sm' : 'text-[#86868B]'}`}
          >
            연간
          </button>
        </div>
      </header>

      <main className="px-6 mt-8 max-w-lg mx-auto space-y-8">
        
        {/* Smooth Monthly Selector */}
        {timeRange === 'monthly' && (
          <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide snap-x">
            {financialData.map((d, idx) => {
              const isSelected = idx === selectedMonthIndex;
              const est = isEstimate(d.month);
              return (
                <button
                  key={d.month}
                  onClick={() => setSelectedMonthIndex(idx)}
                  className={`snap-center whitespace-nowrap px-5 py-2.5 rounded-full text-[15px] font-semibold transition-all duration-400 flex items-center gap-1.5 ${
                    isSelected 
                      ? 'bg-[#1D1D1F] text-white shadow-md transform scale-105' 
                      : 'bg-white text-[#86868B] hover:bg-gray-50'
                  }`}
                >
                  {getMonthName(d.month)}
                  {est && <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${isSelected ? 'bg-white/20 text-white' : 'bg-[#F2F2F7] text-[#86868B]'}`}>예상</span>}
                </button>
              );
            })}
          </div>
        )}

        {/* Hero Dashboard Card */}
        <section className="bg-white rounded-[32px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group">
          {/* Subtle gradient background effect */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#007AFF]/5 to-transparent rounded-full -mr-20 -mt-20 pointer-events-none" />
          
          <div className="flex items-center gap-2 mb-2 relative z-10">
            <p className="text-[#86868B] text-[15px] font-semibold">{currentData.title}</p>
            {currentData.isEstimate && (
              <span className="bg-[#F2F2F7] text-[#86868B] text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                <Sparkles size={10} /> Forecast
              </span>
            )}
          </div>

          <h2 className="text-[44px] leading-tight font-bold tracking-tight mb-8 relative z-10">
            <span className="text-[#007AFF] drop-shadow-sm">{formatCurrency(currentData.profit)}</span>
            <span className="block text-[#86868B] text-[22px] font-semibold mt-1">
              {currentData.isEstimate ? '예상 순이익' : '순이익'}
            </span>
          </h2>

          {/* Apple-style progress visualization */}
          <div className="mb-2 relative z-10">
            <div className="flex justify-between text-[15px] font-semibold mb-3">
              <span className="text-[#1D1D1F]">총 매출 {formatCompact(currentData.sales)}</span>
              <span className="text-[#86868B]">100%</span>
            </div>
            
            <div className="h-6 bg-[#F5F5F7] rounded-full overflow-hidden flex w-full shadow-inner">
              <div 
                className={`h-full bg-[#FF3B30] transition-all duration-1000 ease-out relative ${currentData.isEstimate ? 'opacity-50' : ''}`}
                style={{ width: `${expenseRatio}%` }}
              />
              <div 
                className={`h-full bg-[#007AFF] transition-all duration-1000 ease-out ${currentData.isEstimate ? 'opacity-50' : ''}`}
                style={{ width: `${profitRatio}%` }}
              />
            </div>
            
            <div className="flex justify-between mt-4 text-[15px] px-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FF3B30] shadow-sm"></div>
                <span className="text-[#86868B] font-medium">경비</span>
                <span className="font-semibold text-[#1D1D1F]">{formatCompact(currentData.expenses)}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#007AFF] shadow-sm"></div>
                <span className="text-[#86868B] font-medium">수익</span>
                <span className="font-semibold text-[#1D1D1F]">{formatCompact(currentData.profit)}</span>
              </div>
            </div>
          </div>
        </section>

        {/* AI Insight Card (Only for estimated months) */}
        {timeRange === 'monthly' && currentData.isEstimate && (
          <section className="bg-gradient-to-br from-[#F5F5F7] to-white rounded-[28px] p-6 shadow-sm border border-[#007AFF]/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#007AFF]/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
            <div className="flex items-center gap-2.5 mb-4 relative z-10">
              <div className="w-8 h-8 rounded-full bg-[#007AFF]/10 flex items-center justify-center">
                <BrainCircuit size={16} className="text-[#007AFF]" />
              </div>
              <h3 className="text-[17px] font-bold text-[#1D1D1F] tracking-tight">AI 시뮬레이션 리포트 ({getMonthName(financialData[selectedMonthIndex].month)})</h3>
            </div>
            
            <div className="space-y-4 relative z-10">
              <div className="bg-white/60 backdrop-blur-md rounded-2xl p-4 border border-[#E5E5EA]/50">
                <h4 className="text-[14px] font-bold text-[#1D1D1F] mb-1.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#34C759]"></span>
                  매출 흐름 타당성
                </h4>
                <p className="text-[#86868B] text-[14px] leading-relaxed font-medium">
                  {getAiInsight(financialData[selectedMonthIndex].month).flow}
                </p>
              </div>

              <div className="bg-white/60 backdrop-blur-md rounded-2xl p-4 border border-[#E5E5EA]/50">
                <h4 className="text-[14px] font-bold text-[#1D1D1F] mb-1.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B30]"></span>
                  주의 깊게 볼 점
                </h4>
                <p className="text-[#86868B] text-[14px] leading-relaxed font-medium">
                  {getAiInsight(financialData[selectedMonthIndex].month).warning}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Action Button for Details (Only in monthly mode) */}
        {timeRange === 'monthly' && currentData.details && (
          <button 
            onClick={() => setIsDetailsOpen(true)}
            className="w-full bg-white hover:bg-[#F5F5F7] transition-all duration-300 rounded-[28px] p-5 flex items-center justify-between group shadow-[0_4px_20px_rgb(0,0,0,0.03)]"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF3B30]/10 to-[#FF3B30]/5 flex items-center justify-center">
                <CreditCard size={24} className="text-[#FF3B30]" />
              </div>
              <div className="text-left">
                <p className="text-[#1D1D1F] font-bold text-lg mb-0.5 tracking-tight">지출 상세 내역</p>
                <p className="text-[#86868B] text-[15px] font-medium">총 지출 {formatCurrency(currentData.expenses)}</p>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#F5F5F7] flex items-center justify-center group-hover:scale-110 transition-transform">
              <ChevronRight size={20} className="text-[#86868B] group-hover:text-[#1D1D1F] transition-colors" />
            </div>
          </button>
        )}

        {/* Chart Section */}
        {timeRange !== 'monthly' && (
          <section className="bg-white rounded-[32px] p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="flex justify-between items-end mb-8">
              <h3 className="text-[20px] font-bold text-[#1D1D1F] tracking-tight">수익 추이</h3>
              <p className="text-[#86868B] text-[13px] font-medium">(단위: 만원)</p>
            </div>
            
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#E5E5EA" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#86868B', fontWeight: 600 }} dy={12} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#86868B', fontWeight: 600 }} />
                  <Tooltip 
                    cursor={{ fill: '#F5F5F7' }}
                    contentStyle={{ backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', borderRadius: '16px', border: 'none', color: '#1D1D1F', boxShadow: '0 10px 40px -10px rgb(0 0 0 / 0.15)', padding: '12px 16px' }}
                    itemStyle={{ color: '#1D1D1F', fontWeight: 700, fontSize: '15px' }}
                    labelStyle={{ color: '#86868B', fontWeight: 600, marginBottom: '4px' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '14px', paddingTop: '16px', fontWeight: 600, color: '#86868B' }} />
                  <Bar dataKey="순이익" radius={[6, 6, 0, 0]} maxBarSize={16}>
                    {chartData.map((entry, index) => (
                      <Cell key={`profit-${index}`} fill="#007AFF" fillOpacity={entry.isEst ? 0.35 : 1} />
                    ))}
                  </Bar>
                  <Bar dataKey="지출" radius={[6, 6, 0, 0]} maxBarSize={16}>
                    {chartData.map((entry, index) => (
                      <Cell key={`exp-${index}`} fill="#FF3B30" fillOpacity={entry.isEst ? 0.35 : 1} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        )}
      </main>

      {/* Details Modal */}
      {isDetailsOpen && currentData.details && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center animate-in fade-in duration-300">
          {/* Backdrop with extreme blur */}
          <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-md" 
            onClick={() => setIsDetailsOpen(false)}
          />
          
          {/* Modal Content */}
          <div className="relative bg-white/95 backdrop-blur-xl w-full sm:max-w-md rounded-t-[36px] sm:rounded-[36px] p-7 max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-500">
            <div className="flex justify-center mb-6 sm:hidden">
              <div className="w-12 h-1.5 bg-[#E3E3E8] rounded-full" />
            </div>
            
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-2xl font-bold text-[#1D1D1F] tracking-tight">{getMonthName(financialData[selectedMonthIndex].month)} 세부 경비</h3>
                {currentData.isEstimate && (
                   <span className="inline-block mt-2 bg-[#F2F2F7] text-[#86868B] text-[12px] font-bold px-2 py-1 rounded-md">예상 (Forecast)</span>
                )}
              </div>
              <button 
                onClick={() => setIsDetailsOpen(false)} 
                className="text-[#86868B] hover:text-[#1D1D1F] bg-[#F5F5F7] hover:bg-[#E5E5EA] rounded-full p-2.5 transition-colors self-start"
              >
                <X size={22} />
              </button>
            </div>
            
            <div className="overflow-y-auto flex-1 pr-2 custom-scrollbar">
              <div className="space-y-1 pb-6">
                <DetailRow label="재료비상반" amount={currentData.details.materialFirst} />
                <DetailRow label="재료비후반" amount={currentData.details.materialSecond} />
                <div className="h-px w-full bg-[#E5E5EA] my-4" />
                <DetailRow label="인건비" amount={currentData.details.labor} />
                <DetailRow label="임대료" amount={currentData.details.rent} />
                <div className="h-px w-full bg-[#E5E5EA] my-4" />
                <DetailRow label="관리비" amount={currentData.details.admin} />
                <DetailRow label="기장료" amount={currentData.details.accounting} />
                <DetailRow label="로열티" amount={currentData.details.royalty} />
                <DetailRow label="홍보비(배너 등)" amount={currentData.details.promotion} />
                <DetailRow label="cctv,전화" amount={currentData.details.cctv} />
                <DetailRow label="브랜드라디오" amount={currentData.details.radio} />
                <DetailRow label="화재보험" amount={currentData.details.insurance} />
              </div>
            </div>
            
            <div className="pt-6 border-t border-[#E5E5EA] mt-auto">
              <div className="flex justify-between items-center bg-[#F5F5F7] p-5 rounded-[24px]">
                <span className="font-bold text-[#1D1D1F] text-[17px]">경비 합계</span>
                <span className="font-bold text-[26px] text-[#FF3B30] tracking-tight">{formatCurrency(currentData.expenses)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailRow({ label, amount }: { label: string, amount: number }) {
  if (amount === 0) return null;
  return (
    <div className="flex justify-between items-center py-3 px-1">
      <span className="text-[#86868B] font-semibold text-[16px] tracking-tight">{label}</span>
      <span className="text-[#1D1D1F] font-bold text-[16px]">{formatCurrency(amount)}</span>
    </div>
  );
}

export default App;
