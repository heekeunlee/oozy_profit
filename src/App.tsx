import { useState, useMemo, useEffect } from 'react';
import { financialData, formatCurrency, formatCompact } from './data';
import { 
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  AreaChart, Area
} from 'recharts';
import { 
  LayoutDashboard, TrendingUp, Calculator, Building2, Store, Users, 
  CheckCircle2, ShieldCheck, BadgePercent, Clock
} from 'lucide-react';

type Tab = 'dashboard' | 'trend' | 'simulator' | 'valuation';

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
          <h1 className="text-3xl font-bold text-[#1D1D1F] tracking-tight mb-2">우지커피 양수도 리포트</h1>
          <p className="text-[#86868B] font-medium">프리미엄 상권의 압도적 수익률을 확인하세요</p>
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
          </h1>
          <Store size={24} className="text-[#007AFF]" />
        </div>
      </header>

      <main className="px-5 mt-6 max-w-lg mx-auto">
        {activeTab === 'dashboard' && <DashboardSection avgSales={avgSales} avgProfit={avgProfit} />}
        {activeTab === 'trend' && <TrendSection />}
        {activeTab === 'simulator' && <SimulatorSection avgSales={avgSales} />}
        {activeTab === 'valuation' && <ValuationSection avgProfit={avgProfit} />}
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
          icon={<Building2 size={24} />} 
          label="가치분석" 
          isActive={activeTab === 'valuation'} 
          onClick={() => setActiveTab('valuation')} 
        />
      </nav>
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
  const basePremium = 30000000;
  const facilityVal = 70000000;
  const opPremium = avgProfit * 12; // 1 year profit
  const totalPremium = basePremium + facilityVal + opPremium;
  
  // ROI in months based on avg profit
  const roiMonths = Math.ceil(totalPremium / avgProfit);

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <section className="bg-white rounded-[32px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <h3 className="text-xl font-bold text-[#1D1D1F] mb-1 tracking-tight">권리금 타당성 분석</h3>
        <p className="text-[#86868B] text-[13px] mb-6">합리적인 2억 원대 권리금의 명확한 근거</p>
        
        <div className="space-y-4 mb-6">
          <div className="bg-[#F5F5F7] p-4 rounded-2xl flex items-center justify-between">
            <div>
              <p className="font-bold text-[#1D1D1F] text-[15px]">바닥 권리금 보존</p>
              <p className="text-[12px] text-[#86868B]">메인 대로변 A급 상권 입지</p>
            </div>
            <span className="font-bold text-[#1D1D1F]">{formatCompact(basePremium)}원</span>
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
              <p className="font-bold text-[#1D1D1F] text-[15px]">영업 권리금</p>
              <p className="text-[12px] text-[#86868B]">월평균 순이익 × 12개월</p>
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
              현재 평균 수익 기준, 인수 후 <strong>약 {roiMonths}개월</strong> 내에 초기 투자금(권리금)을 전액 회수할 수 있는 초우량 매장입니다.
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
      className={`flex flex-col items-center gap-1.5 w-16 transition-colors ${isActive ? 'text-[#007AFF]' : 'text-[#86868B] hover:text-[#1D1D1F]'}`}
    >
      <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-[#007AFF]/10' : ''}`}>
        {icon}
      </div>
      <span className="text-[11px] font-bold tracking-tight">{label}</span>
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
