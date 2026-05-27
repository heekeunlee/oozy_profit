import { useState, useMemo, useEffect } from 'react';
import { financialData, formatCurrency, formatCompact, getMonthName } from './data';
import { 
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  AreaChart, Area
} from 'recharts';
import { 
  LayoutDashboard, TrendingUp, Calculator, Building2, Store, Users, 
  CheckCircle2, ShieldCheck, BadgePercent, Clock, Calendar, CreditCard, ChevronRight, X, BrainCircuit, Sparkles
} from 'lucide-react';

type Tab = 'dashboard' | 'trend' | 'simulator' | 'valuation' | 'monthly';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  // Calculate base metrics
  const { avgSales, avgProfit } = useMemo(() => {
    const sales = financialData.reduce((sum, d) => sum + d.sales, 0);
    const profit = financialData.reduce((sum, d) => {
      const exp = d.expenses.material + d.expenses.labor + d.expenses.rent + d.expenses.others;
      return sum + (d.sales - exp);
    }, 0);
    return {
      avgSales: sales / financialData.length,
      avgProfit: profit / financialData.length
    };
  }, []);

  if (showSplash) {
    return (
      <div className="fixed inset-0 bg-[#F5F5F7] flex flex-col items-center justify-center z-[100] animate-out fade-out duration-700 delay-1500 fill-mode-forwards">
        <div className="animate-in zoom-in duration-700 flex flex-col items-center text-center px-6">
          <div className="w-24 h-24 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex items-center justify-center mb-6">
            <Store size={48} className="text-[#007AFF]" />
          </div>
          <h1 className="text-3xl font-bold text-[#1D1D1F] tracking-tight">우지 밸런스</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] font-sans pb-28 animate-in fade-in duration-500 selection:bg-[#007AFF] selection:text-white">
      {/* Header */}
      <header className="pt-14 pb-4 px-6 sticky top-0 bg-[#F5F5F7]/80 backdrop-blur-2xl z-40 border-b border-[#000000]/5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight text-[#1D1D1F]">
            {activeTab === 'dashboard' && '매장 핵심 지표'}
            {activeTab === 'trend' && '매출 트렌드 분석'}
            {activeTab === 'simulator' && '순이익 시뮬레이터'}
            {activeTab === 'valuation' && '권리금 타당성 분석'}
            {activeTab === 'monthly' && '월별 상세 실적'}
          </h1>
          <Store size={24} className="text-[#007AFF]" />
        </div>
      </header>

      <main className="px-5 mt-6 max-w-lg mx-auto">
        {activeTab === 'dashboard' && <DashboardSection avgSales={avgSales} avgProfit={avgProfit} />}
        {activeTab === 'trend' && <TrendSection />}
        {activeTab === 'simulator' && <SimulatorSection avgSales={avgSales} />}
        {activeTab === 'valuation' && <ValuationSection avgProfit={avgProfit} />}
        {activeTab === 'monthly' && <MonthlySection />}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full max-w-lg left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-xl border-t border-[#E5E5EA] px-6 py-4 pb-8 z-50 rounded-t-3xl shadow-[0_-10px_40px_rgb(0,0,0,0.04)] flex justify-between">
        <NavItem 
          icon={<LayoutDashboard size={24} />} 
          label="대시보드" 
          isActive={activeTab === 'dashboard'} 
          onClick={() => setActiveTab('dashboard')} 
        />
        <NavItem 
          icon={<TrendingUp size={24} />} 
          label="트렌드" 
          isActive={activeTab === 'trend'} 
          onClick={() => setActiveTab('trend')} 
        />
        <NavItem 
          icon={<Calculator size={24} />} 
          label="시뮬레이터" 
          isActive={activeTab === 'simulator'} 
          onClick={() => setActiveTab('simulator')} 
        />
        <NavItem 
          icon={<Building2 size={22} />} 
          label="가치분석" 
          isActive={activeTab === 'valuation'} 
          onClick={() => setActiveTab('valuation')} 
        />
        <NavItem 
          icon={<Calendar size={22} />} 
          label="월별상세" 
          isActive={activeTab === 'monthly'} 
          onClick={() => setActiveTab('monthly')} 
        />
      </nav>
    </div>
  );
}

// ----------------------------------------------------
// 5. Monthly Details Section
// ----------------------------------------------------
function MonthlySection() {
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(financialData.length - 1);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const isEstimate = (monthStr: string) => {
    const monthNum = parseInt(monthStr.split('-')[1], 10);
    return monthNum > 4;
  };

  const currentData = useMemo(() => {
    const d = financialData[selectedMonthIndex];
    const expenses = d.expenses.material + d.expenses.labor + d.expenses.rent + d.expenses.others;
    return {
      title: `${getMonthName(d.month)} 현황`,
      isEstimate: isEstimate(d.month),
      sales: d.sales,
      expenses,
      profit: d.sales - expenses,
      details: d.expenses.details
    };
  }, [selectedMonthIndex]);

  const expenseRatio = (currentData.expenses / currentData.sales) * 100;
  const profitRatio = (currentData.profit / currentData.sales) * 100;

  const getAiInsight = (monthStr: string) => {
    const monthNum = parseInt(monthStr.split('-')[1], 10);
    switch (monthNum) {
      case 5:
        return {
          flow: "가정의 달 특수 및 연휴 효과로 4월(2,950만) 대비 매출이 상승(3,100만)하는 매우 긍정적이고 현실적인 예측치입니다.",
          warning: "예상 재료비 원가율이 약 34%로 연중 최고치를 기록합니다. 급증한 수요 대비 부재료 로스(Loss)가 없도록 철저한 발주 점검이 필요합니다."
        };
      case 6:
        return {
          flow: "여름의 시작으로 전월 대비 매출은 약간 안정세(2,600만)를 보이나, 본격 성수기를 앞둔 숨 고르기 기간으로 적절한 예측입니다.",
          warning: "예상 재료비 원가율이 약 25%로, 5월(34%) 대비 급격히 낮게 세팅되었습니다. 실제 빙수/아이스 메뉴 원가율 점검이 필요합니다."
        };
      case 7:
        return {
          flow: "본격적인 무더위 진입과 장마철 배달 수요 증가로 6월 대비 매출 상승(2,750만)이 예상된 매우 현실적인 지표입니다.",
          warning: "인건비가 575만 원으로 역대 최고치 부근입니다. 성수기 알바생 충원에 대비한 바쁜 피크타임 위주의 스케줄 배치가 핵심입니다."
        };
      case 8:
        return {
          flow: "연중 최대 매출(3,200만) 피크입니다. 아이스 음료 수요가 극에 달하는 폭염 시즌이므로 예측 흐름이 매우 타당합니다.",
          warning: "최고 매출임에도 재료비 원가율을 24.2%로 극히 낮게 잡았습니다. 부재료 극심한 로스를 반드시 막아야 달성 가능합니다."
        };
      case 9:
        return {
          flow: "휴가철 종료 및 선선해진 날씨로 인해 8월 대비 매출이 다소 하락(2,980만)하는 전형적인 카페 가을 초입 패턴입니다.",
          warning: "매출은 줄었으나 재료비 원가율이 31%로 상승합니다. 여름 부재료들의 꼼꼼한 재고 처리 및 관리가 순이익 방어의 키입니다."
        };
      case 10:
        return {
          flow: "가을 나들이 및 객단가 상승으로 하반기 2차 매출 피크(3,300만)를 달성하는 매우 훌륭한 시나리오입니다.",
          warning: "재료비가 예측치 중 처음으로 1천만 원을 돌파합니다. 핫음료 원가 비중이 높아져 순이익을 갉아먹지 않도록 점검하세요."
        };
      case 11:
        return {
          flow: "10월 피크 이후 조금씩 안정세(3,150만)에 접어드는 무난하고 현실적인 초겨울 매출 흐름입니다.",
          warning: "매출은 하락했으나 인건비(584만)는 1년 중 최고치입니다. 고정 비용을 어떻게 방어할 것인지가 11월의 숙제입니다."
        };
      case 12:
        return {
          flow: "한겨울 추위 진입으로 홀 방문객 매출이 감소(2,890만)하는 계절성이 아주 논리적으로 반영되었습니다.",
          warning: "크리스마스 프로모션 등을 위해 재료/홍보비 지출이 늘어날 수 있습니다. 내년을 준비하는 재고 정리에 집중하세요."
        };
      default:
        return {
          flow: "실제 매출 실적 데이터입니다. 우수한 성과를 보이고 있습니다.",
          warning: "안정적인 수익 구조를 유지하며 다음 달의 목표치를 세워보세요."
        };
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x">
        {financialData.map((d, idx) => {
          const isSelected = idx === selectedMonthIndex;
          const est = isEstimate(d.month);
          return (
            <button
              key={d.month}
              onClick={() => setSelectedMonthIndex(idx)}
              className={`snap-center whitespace-nowrap px-4 py-2 rounded-full text-[14px] font-semibold transition-all duration-300 flex items-center gap-1.5 ${
                isSelected 
                  ? 'bg-[#1D1D1F] text-white shadow-md' 
                  : 'bg-white text-[#86868B] border border-[#E5E5EA]/50'
              }`}
            >
              {getMonthName(d.month)}
              {est && <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${isSelected ? 'bg-white/20 text-white' : 'bg-[#F2F2F7] text-[#86868B]'}`}>예상</span>}
            </button>
          );
        })}
      </div>

      <section className="bg-white rounded-[32px] p-6 shadow-sm border border-[#E5E5EA]/50 relative overflow-hidden group">
        <div className="flex items-center gap-2 mb-2 relative z-10">
          <p className="text-[#86868B] text-[14px] font-semibold">{currentData.title}</p>
          {currentData.isEstimate && (
            <span className="bg-[#F2F2F7] text-[#86868B] text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
              <Sparkles size={10} /> 시뮬레이션
            </span>
          )}
        </div>

        <h2 className="text-[36px] leading-tight font-bold tracking-tight mb-6 relative z-10">
          <span className="text-[#007AFF] drop-shadow-sm">{formatCurrency(currentData.profit)}</span>
          <span className="block text-[#86868B] text-[18px] font-semibold mt-1">
            {currentData.isEstimate ? '예상 순이익' : '실제 순이익'}
          </span>
        </h2>

        <div className="mb-2 relative z-10">
          <div className="flex justify-between text-[14px] font-semibold mb-2">
            <span className="text-[#1D1D1F]">총 매출 {formatCompact(currentData.sales)}</span>
          </div>
          
          <div className="h-4 bg-[#F5F5F7] rounded-full overflow-hidden flex w-full shadow-inner mb-3">
            <div 
              className={`h-full bg-[#FF3B30] transition-all duration-1000 ${currentData.isEstimate ? 'opacity-50' : ''}`}
              style={{ width: `${expenseRatio}%` }}
            />
            <div 
              className={`h-full bg-[#007AFF] transition-all duration-1000 ${currentData.isEstimate ? 'opacity-50' : ''}`}
              style={{ width: `${profitRatio}%` }}
            />
          </div>
          
          <div className="flex justify-between text-[13px] px-1">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#FF3B30]"></div>
              <span className="text-[#86868B] font-medium">지출</span>
              <span className="font-bold text-[#1D1D1F]">{formatCompact(currentData.expenses)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#007AFF]"></div>
              <span className="text-[#86868B] font-medium">수익</span>
              <span className="font-bold text-[#1D1D1F]">{formatCompact(currentData.profit)}</span>
            </div>
          </div>
        </div>
      </section>

      {currentData.isEstimate && (
        <section className="bg-gradient-to-br from-[#F5F5F7] to-white rounded-[28px] p-6 shadow-sm border border-[#007AFF]/10">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-full bg-[#007AFF]/10 flex items-center justify-center">
              <BrainCircuit size={14} className="text-[#007AFF]" />
            </div>
            <h3 className="text-[16px] font-bold text-[#1D1D1F]">AI 시뮬레이션 리포트</h3>
          </div>
          
          <div className="space-y-3">
            <div className="bg-white/80 rounded-2xl p-4 border border-[#E5E5EA]/50">
              <h4 className="text-[13px] font-bold text-[#1D1D1F] mb-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#34C759]"></span> 매출 타당성
              </h4>
              <p className="text-[#86868B] text-[13px] leading-relaxed">
                {getAiInsight(financialData[selectedMonthIndex].month).flow}
              </p>
            </div>
            <div className="bg-white/80 rounded-2xl p-4 border border-[#E5E5EA]/50">
              <h4 className="text-[13px] font-bold text-[#1D1D1F] mb-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B30]"></span> 주의 구간
              </h4>
              <p className="text-[#86868B] text-[13px] leading-relaxed">
                {getAiInsight(financialData[selectedMonthIndex].month).warning}
              </p>
            </div>
          </div>
        </section>
      )}

      {currentData.details && (
        <button 
          onClick={() => setIsDetailsOpen(true)}
          className="w-full bg-white hover:bg-[#F5F5F7] transition-all rounded-[24px] p-4 flex items-center justify-between shadow-sm border border-[#E5E5EA]/50"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#FF3B30]/10 flex items-center justify-center">
              <CreditCard size={20} className="text-[#FF3B30]" />
            </div>
            <div className="text-left">
              <p className="text-[#1D1D1F] font-bold text-base mb-0.5">지출 상세 내역 확인</p>
              <p className="text-[#86868B] text-[13px] font-medium">총 지출 {formatCurrency(currentData.expenses)}</p>
            </div>
          </div>
          <ChevronRight size={20} className="text-[#86868B]" />
        </button>
      )}

      {isDetailsOpen && currentData.details && (
        <div className="fixed inset-0 z-[110] flex items-end justify-center sm:items-center animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsDetailsOpen(false)} />
          <div className="relative bg-white w-full sm:max-w-md rounded-t-[32px] sm:rounded-[32px] p-6 max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:zoom-in-95">
            <div className="flex justify-center mb-4 sm:hidden">
              <div className="w-12 h-1.5 bg-[#E5E5EA] rounded-full" />
            </div>
            
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[#1D1D1F]">{getMonthName(financialData[selectedMonthIndex].month)} 상세 지출</h3>
              <button onClick={() => setIsDetailsOpen(false)} className="bg-[#F5F5F7] p-2 rounded-full">
                <X size={20} className="text-[#86868B]" />
              </button>
            </div>
            
            <div className="overflow-y-auto flex-1 pb-4">
              <div className="space-y-1">
                <DetailRow label="재료비상반" amount={currentData.details.materialFirst} />
                <DetailRow label="재료비후반" amount={currentData.details.materialSecond} />
                <div className="h-px bg-[#F5F5F7] my-3" />
                <DetailRow label="인건비" amount={currentData.details.labor} />
                <DetailRow label="임대료" amount={currentData.details.rent} />
                <div className="h-px bg-[#F5F5F7] my-3" />
                <DetailRow label="관리비" amount={currentData.details.admin} />
                <DetailRow label="기장료" amount={currentData.details.accounting} />
                <DetailRow label="로열티" amount={currentData.details.royalty} />
                <DetailRow label="홍보비" amount={currentData.details.promotion} />
                <DetailRow label="CCTV/전화" amount={currentData.details.cctv} />
                <DetailRow label="화재보험" amount={currentData.details.insurance} />
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
    <div className="flex justify-between items-center py-2.5 px-1">
      <span className="text-[#86868B] font-medium text-[14px]">{label}</span>
      <span className="text-[#1D1D1F] font-bold text-[14px]">{formatCurrency(amount)}</span>
    </div>
  );
}

// ----------------------------------------------------
// 1. Dashboard Section
// ----------------------------------------------------
function DashboardSection({ avgSales, avgProfit }: { avgSales: number, avgProfit: number }) {
  // Assume if owner works directly, they save 3M in labor
  const directOperationProfit = avgProfit + 3000000; 
  
  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <section className="bg-gradient-to-br from-[#007AFF] to-[#0051D5] rounded-[32px] p-8 shadow-lg text-white">
        <p className="text-white/80 font-medium mb-1 flex items-center gap-2">
          <SparklesIcon /> 최근 1년 월평균 매출
        </p>
        <h2 className="text-[44px] font-bold tracking-tight mb-6">{formatCompact(avgSales)}원</h2>
        
        <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-md">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white/90 font-medium">오토 운영 시 순이익</span>
            <span className="font-bold text-xl">{formatCompact(avgProfit)}원</span>
          </div>
          <div className="h-px bg-white/20 w-full my-3" />
          <div className="flex justify-between items-center">
            <span className="text-white font-bold flex items-center gap-1.5"><Users size={16}/> 직접 운영 시 순이익</span>
            <span className="font-bold text-2xl text-[#FFD60A]">{formatCompact(directOperationProfit)}원+</span>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-[24px] p-5 shadow-sm border border-[#E5E5EA]/50 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-[#FF3B30]/10 rounded-full flex items-center justify-center mb-3">
            <BadgePercent size={24} className="text-[#FF3B30]" />
          </div>
          <h3 className="font-bold text-[#1D1D1F] mb-1">배달 비중 0%</h3>
          <p className="text-[12px] text-[#86868B] font-medium leading-tight">배달 수수료/라이더<br/>비용 발생 전혀 없음<br/>(홀/테이크아웃 100%)</p>
        </div>
        
        <div className="bg-white rounded-[24px] p-5 shadow-sm border border-[#E5E5EA]/50 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-[#34C759]/10 rounded-full flex items-center justify-center mb-3">
            <ShieldCheck size={24} className="text-[#34C759]" />
          </div>
          <h3 className="font-bold text-[#1D1D1F] mb-1">상권 독점 안정성</h3>
          <p className="text-[12px] text-[#86868B] font-medium leading-tight">주요 5대 브랜드<br/>이미 입점 완료<br/>추가 경쟁 리스크 제로</p>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 2. Trend Section
// ----------------------------------------------------
function TrendSection() {
  const chartData = useMemo(() => {
    return financialData.map(d => ({
      name: `${d.month.split('-')[1]}월`,
      매출: d.sales / 10000,
    }));
  }, []);

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <section className="bg-white rounded-[32px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <h3 className="text-lg font-bold text-[#1D1D1F] mb-1">월별 매출 안정성 (단위: 만원)</h3>
        <p className="text-[13px] text-[#86868B] mb-6">겨울 비수기에도 2,500만 원 강력한 하한선 방어</p>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#007AFF" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#007AFF" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F2F2F7" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#86868B' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#86868B' }} domain={['dataMin - 300', 'dataMax + 300']} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ color: '#007AFF', fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="매출" stroke="#007AFF" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="bg-white rounded-[32px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <h3 className="text-lg font-bold text-[#1D1D1F] mb-4">운영 효율 지표</h3>
        <div className="space-y-4">
          <div className="p-4 bg-[#F5F5F7] rounded-2xl">
            <h4 className="font-bold text-[#1D1D1F] flex items-center gap-2 mb-2">
              <Clock size={16} className="text-[#FF9500]" /> 피크타임 매출 집중도
            </h4>
            <p className="text-[14px] text-[#86868B] leading-relaxed">
              출근 시간(08:00~09:30) 및 점심 시간(12:00~13:30)에 일 매출의 60%가 집중됩니다. 해당 시간에만 파트타이머를 집중 배치하여 <strong>극강의 인건비 효율화</strong>가 가능합니다.
            </p>
          </div>
          <div className="p-4 bg-[#F5F5F7] rounded-2xl">
            <h4 className="font-bold text-[#1D1D1F] flex items-center gap-2 mb-2">
              <Users size={16} className="text-[#34C759]" /> 두터운 단골 고객층
            </h4>
            <p className="text-[14px] text-[#86868B] leading-relaxed">
              월평균 영수증 발급 건수 <strong>12,000건 이상</strong> 유지. 주변 오피스 및 주거 상권의 단골 고객이 탄탄하게 확보되어 매출의 변동성이 매우 적습니다.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

// ----------------------------------------------------
// 3. Simulator Section
// ----------------------------------------------------
function SimulatorSection({ avgSales }: { avgSales: number }) {
  const [workHours, setWorkHours] = useState(0); // 0 to 12 hours
  
  // Base fixed costs (Rent + Admin + Royalty + Insurance etc) = roughly 5,000,000
  const fixedCosts = 5000000; 
  const matRatio = 0.33; // 33%
  const matCost = avgSales * matRatio;
  
  // Base labor is about 5.5M. If owner works, save 10,000 KRW/hr * 30 days = 300,000 KRW per hour/day
  const baseLabor = 5500000;
  const savedLabor = workHours * 10000 * 30;
  const actualLabor = Math.max(0, baseLabor - savedLabor);
  
  const simulatedProfit = avgSales - matCost - fixedCosts - actualLabor;

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <section className="bg-white rounded-[32px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <h3 className="text-xl font-bold text-[#1D1D1F] mb-6 tracking-tight">투명한 비용 구조</h3>
        
        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center py-2 border-b border-[#F2F2F7]">
            <span className="text-[#86868B] font-medium">재료비 원가율 (평균)</span>
            <span className="font-bold text-[#1D1D1F]">32% ~ 34%</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-[#F2F2F7]">
            <span className="text-[#86868B] font-medium">월 고정비 (임대료/관리비 등)</span>
            <span className="font-bold text-[#1D1D1F]">약 500만 원</span>
          </div>
        </div>

        <div className="bg-[#F5F5F7] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-[#1D1D1F] text-[15px]">사장님 직접 근무 시뮬레이터</h4>
            <span className="bg-[#007AFF] text-white px-2 py-1 rounded-lg text-xs font-bold shadow-sm">핵심</span>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium text-[#86868B]">일 근무 시간</span>
              <span className="font-bold text-[#007AFF] text-lg">{workHours}시간</span>
            </div>
            <input 
              type="range" 
              min="0" max="12" step="1"
              value={workHours}
              onChange={(e) => setWorkHours(parseInt(e.target.value))}
              className="w-full accent-[#007AFF] h-2 bg-[#E5E5EA] rounded-lg appearance-none cursor-pointer"
            />
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border border-[#E5E5EA]/50">
            <p className="text-[13px] text-[#86868B] mb-1">예상 최종 월 순이익</p>
            <p className="text-[28px] font-bold text-[#FF3B30] tracking-tight">{formatCurrency(simulatedProfit)}</p>
            <p className="text-[12px] text-[#86868B] mt-2">알바 인건비 <span className="font-bold text-[#1D1D1F]">{formatCompact(savedLabor)}원</span> 절감 효과 반영</p>
          </div>
        </div>
      </section>
    </div>
  );
}

// ----------------------------------------------------
// 4. Valuation Section
// ----------------------------------------------------
function ValuationSection({ avgProfit }: { avgProfit: number }) {
  const basePremium = 70000000;
  const franchiseSave = 25000000;
  const facilityVal = 70000000;
  // Calculate based on direct operation to maximize valuation
  const opPremium = (avgProfit + 3000000) * 18; // 18 months of direct operation profit
  const totalPremium = basePremium + franchiseSave + facilityVal + opPremium;
  
  // ROI in months based on direct operation profit
  const roiMonths = Math.ceil(totalPremium / (avgProfit + 3000000));

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <section className="bg-white rounded-[32px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <h3 className="text-xl font-bold text-[#1D1D1F] mb-1 tracking-tight">권리금 타당성 분석</h3>
        <p className="text-[#86868B] text-[13px] mb-6">최고 효율 4억 원대 프리미엄의 논리적 근거</p>
        
        <div className="space-y-4 mb-6">
          <div className="bg-[#F5F5F7] p-4 rounded-2xl flex items-center justify-between">
            <div>
              <p className="font-bold text-[#1D1D1F] text-[15px]">바닥 권리금 (상권 가치)</p>
              <p className="text-[12px] text-[#86868B]">메인 대로변 A급 독점 상권 프리미엄</p>
            </div>
            <span className="font-bold text-[#1D1D1F]">{formatCompact(basePremium)}원</span>
          </div>

          <div className="bg-[#F5F5F7] p-4 rounded-2xl flex items-center justify-between">
            <div>
              <p className="font-bold text-[#1D1D1F] text-[15px]">초기 프랜차이즈 매몰비용 방어</p>
              <p className="text-[12px] text-[#86868B]">가맹비/교육비 등 신규 창업 소멸 비용 세이브</p>
            </div>
            <span className="font-bold text-[#1D1D1F]">{formatCompact(franchiseSave)}원</span>
          </div>
          
          <div className="bg-[#F5F5F7] p-4 rounded-2xl flex items-center justify-between">
            <div>
              <p className="font-bold text-[#1D1D1F] text-[15px]">시설 가치</p>
              <p className="text-[12px] text-[#86868B]">17개월 신급 장비/인테리어 감가상각</p>
            </div>
            <span className="font-bold text-[#1D1D1F]">{formatCompact(facilityVal)}원</span>
          </div>
          
          <div className="bg-[#F5F5F7] p-4 rounded-2xl flex items-center justify-between">
            <div>
              <p className="font-bold text-[#1D1D1F] text-[15px]">영업 권리금 (안정성 프리미엄)</p>
              <p className="text-[12px] text-[#86868B]">직접 운영 기준 최고 순이익 × 18개월</p>
            </div>
            <span className="font-bold text-[#007AFF]">{formatCompact(opPremium)}원</span>
          </div>
        </div>

        <div className="pt-4 border-t border-[#E5E5EA]">
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold text-[#86868B]">적정 권리금 총계</span>
            <span className="font-black text-2xl text-[#1D1D1F] tracking-tight">{formatCompact(totalPremium)}원</span>
          </div>
          
          <div className="bg-[#007AFF]/10 rounded-2xl p-4 border border-[#007AFF]/20">
            <p className="font-bold text-[#007AFF] mb-1 flex items-center gap-1.5"><CheckCircle2 size={16}/> 초기 투자금 초고속 회수</p>
            <p className="text-[13px] text-[#1D1D1F] font-medium leading-relaxed">
              직접 운영을 통한 극강의 마진율 확보 시, 인수 후 <strong>약 {roiMonths}개월</strong> 내에 초기 투자금(4억)을 전액 현금 회수할 수 있는 최상급 우량 매장입니다.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

// ----------------------------------------------------
// UI Components
// ----------------------------------------------------
function NavItem({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center gap-1 w-14 sm:w-16 transition-colors ${isActive ? 'text-[#007AFF]' : 'text-[#86868B] hover:text-[#1D1D1F]'}`}
    >
      <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-[#007AFF]/10' : ''}`}>
        {icon}
      </div>
      <span className="text-[10px] sm:text-[11px] font-bold tracking-tight whitespace-nowrap">{label}</span>
    </button>
  );
}

function SparklesIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
    </svg>
  );
}
