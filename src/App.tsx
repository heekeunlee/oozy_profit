import { useState, useMemo, useEffect } from 'react';
import { financialData, formatCurrency, formatCompact, getMonthName } from './data';
import { ChevronRight, X, CreditCard, Coffee } from 'lucide-react';
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

  // Data processing based on selected range
  const currentData = useMemo(() => {
    if (timeRange === 'monthly') {
      const d = financialData[selectedMonthIndex];
      const expenses = d.expenses.material + d.expenses.labor + d.expenses.rent + d.expenses.others;
      return {
        title: `${getMonthName(d.month)} 현황`,
        sales: d.sales,
        expenses,
        profit: d.sales - expenses,
        details: d.expenses.details
      };
    } else if (timeRange === '6months') {
      const data = financialData.slice(Math.max(financialData.length - 6, 0));
      const sales = data.reduce((sum, d) => sum + d.sales, 0);
      const expenses = data.reduce((sum, d) => sum + d.expenses.material + d.expenses.labor + d.expenses.rent + d.expenses.others, 0);
      return {
        title: '최근 6개월 누적',
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
        매출: d.sales / 10000,
        지출: exp / 10000,
        순이익: (d.sales - exp) / 10000,
      };
    });
  }, [timeRange]);

  if (showSplash) {
    return (
      <div className="fixed inset-0 bg-[#F2F2F7] flex flex-col items-center justify-center z-[100] animate-out fade-out duration-500 delay-2500 fill-mode-forwards">
        <div className="animate-in zoom-in duration-500 flex flex-col items-center">
          <div className="w-24 h-24 bg-white rounded-full shadow-md flex items-center justify-center mb-6">
            <Coffee size={48} className="text-[#34C759]" strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-bold text-[#1C1C1E] tracking-tight">우지 밸런스</h1>
          <p className="text-[#8E8E93] mt-2 font-medium">스마트한 손익 관리의 시작</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F2F7] text-[#1C1C1E] font-sans selection:bg-[#34C759] selection:text-white pb-20 animate-in fade-in duration-500">
      {/* Header */}
      <header className="pt-12 pb-6 px-6 sticky top-0 bg-[#F2F2F7]/80 backdrop-blur-xl z-20 border-b border-[#E5E5EA]">
        <h1 className="text-3xl font-semibold tracking-tight text-[#1C1C1E] mb-6 flex items-center gap-2">
          우지 밸런스
        </h1>
        
        {/* Segmented Control */}
        <div className="flex bg-[#E5E5EA] p-1 rounded-xl">
          <button 
            onClick={() => setTimeRange('monthly')}
            className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-all ${timeRange === 'monthly' ? 'bg-white text-black shadow-sm' : 'text-[#8E8E93]'}`}
          >
            월별
          </button>
          <button 
            onClick={() => setTimeRange('6months')}
            className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-all ${timeRange === '6months' ? 'bg-white text-black shadow-sm' : 'text-[#8E8E93]'}`}
          >
            최근 6개월
          </button>
          <button 
            onClick={() => setTimeRange('1year')}
            className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-all ${timeRange === '1year' ? 'bg-white text-black shadow-sm' : 'text-[#8E8E93]'}`}
          >
            1년 (26년)
          </button>
        </div>
      </header>

      <main className="px-6 mt-6 max-w-lg mx-auto space-y-8">
        
        {/* Monthly Selector */}
        {timeRange === 'monthly' && (
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x">
            {financialData.map((d, idx) => (
              <button
                key={d.month}
                onClick={() => setSelectedMonthIndex(idx)}
                className={`snap-center whitespace-nowrap px-5 py-2.5 rounded-full text-[15px] font-medium transition-all duration-300 shadow-sm ${
                  idx === selectedMonthIndex 
                    ? 'bg-black text-white' 
                    : 'bg-white text-[#8E8E93] hover:bg-gray-50'
                }`}
              >
                {getMonthName(d.month)}
              </button>
            ))}
          </div>
        )}

        {/* Main Dashboard Card */}
        <section className="bg-white rounded-[32px] p-8 shadow-sm border border-[#E5E5EA]/50">
          <p className="text-[#8E8E93] text-[15px] font-medium mb-1">{currentData.title}</p>
          <h2 className="text-[40px] leading-tight font-bold tracking-tight mb-8">
            <span className={currentData.title.includes('.3') ? 'text-[#007AFF]' : 'text-[#34C759]'}>{formatCurrency(currentData.profit)}</span>
            <span className="block text-[#8E8E93] text-xl font-medium mt-1">순이익</span>
          </h2>

          {/* Visual Profit/Expense Bar */}
          <div className="mb-2">
            <div className="flex justify-between text-sm font-medium mb-3">
              <span className="text-[#1C1C1E]">총 매출 {formatCompact(currentData.sales)}</span>
              <span className="text-[#8E8E93]">100%</span>
            </div>
            
            <div className="h-5 bg-[#F2F2F7] rounded-full overflow-hidden flex w-full">
              <div 
                className="h-full bg-[#FF3B30] transition-all duration-1000 ease-out relative"
                style={{ width: `${expenseRatio}%` }}
              />
              <div 
                className={`h-full transition-all duration-1000 ease-out ${currentData.title.includes('.3') ? 'bg-[#007AFF]' : 'bg-[#34C759]'}`}
                style={{ width: `${profitRatio}%` }}
              />
            </div>
            
            <div className="flex justify-between mt-4 text-sm px-1">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FF3B30]"></div>
                <span className="text-[#8E8E93]">경비</span>
                <span className="font-medium text-[#1C1C1E]">{formatCompact(currentData.expenses)}</span>
                <span className="text-[#8E8E93] text-xs">({expenseRatio.toFixed(1)}%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className={`w-2.5 h-2.5 rounded-full ${currentData.title.includes('.3') ? 'bg-[#007AFF]' : 'bg-[#34C759]'}`}></div>
                <span className="text-[#8E8E93]">수익</span>
                <span className="font-medium text-[#1C1C1E]">{formatCompact(currentData.profit)}</span>
                <span className="text-[#8E8E93] text-xs">({profitRatio.toFixed(1)}%)</span>
              </div>
            </div>
          </div>
        </section>

        {/* Action Button for Details (Only in monthly mode) */}
        {timeRange === 'monthly' && currentData.details && (
          <button 
            onClick={() => setIsDetailsOpen(true)}
            className="w-full bg-white hover:bg-gray-50 transition-colors rounded-[24px] p-5 flex items-center justify-between group shadow-sm border border-[#E5E5EA]/50"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#FF3B30]/10 flex items-center justify-center">
                <CreditCard size={22} className="text-[#FF3B30]" />
              </div>
              <div className="text-left">
                <p className="text-[#1C1C1E] font-bold text-lg mb-0.5">지출 상세 내역 보기</p>
                <p className="text-[#8E8E93] text-sm font-medium">총 지출 {formatCurrency(currentData.expenses)}</p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#F2F2F7] flex items-center justify-center group-hover:bg-[#E5E5EA] transition-colors">
              <ChevronRight size={18} className="text-[#8E8E93] group-hover:text-[#1C1C1E] transition-colors" />
            </div>
          </button>
        )}

        {/* Chart Section */}
        {timeRange !== 'monthly' && (
          <section className="bg-white rounded-[32px] p-6 shadow-sm border border-[#E5E5EA]/50">
            <h3 className="text-lg font-bold text-[#1C1C1E] mb-6">수익 추이 (단위: 만원)</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5EA" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#8E8E93', fontWeight: 500 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#8E8E93', fontWeight: 500 }} />
                  <Tooltip 
                    cursor={{ fill: '#F2F2F7' }}
                    contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E5EA', color: '#1C1C1E', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: '#1C1C1E', fontWeight: 600 }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '13px', paddingTop: '10px', fontWeight: 500 }} />
                  <Bar dataKey="순이익" radius={[4, 4, 0, 0]} maxBarSize={16}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.name.endsWith('.3') ? '#007AFF' : '#34C759'} />
                    ))}
                  </Bar>
                  <Bar dataKey="지출" fill="#FF3B30" radius={[4, 4, 0, 0]} maxBarSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        )}
      </main>

      {/* Details Modal */}
      {isDetailsOpen && currentData.details && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4 animate-in fade-in duration-200">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
            onClick={() => setIsDetailsOpen(false)}
          />
          
          {/* Modal Content */}
          <div className="relative bg-white w-full sm:max-w-md rounded-t-[32px] sm:rounded-[32px] p-6 max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:zoom-in-95">
            <div className="flex justify-center mb-4 sm:hidden">
              <div className="w-12 h-1.5 bg-[#E5E5EA] rounded-full" />
            </div>
            
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-[#1C1C1E]">{getMonthName(financialData[selectedMonthIndex].month)} 세부 경비</h3>
              <button 
                onClick={() => setIsDetailsOpen(false)} 
                className="text-[#8E8E93] hover:text-[#1C1C1E] bg-[#F2F2F7] rounded-full p-2 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="overflow-y-auto flex-1 pr-2 custom-scrollbar">
              <div className="space-y-1 pb-6">
                <DetailRow label="재료비상반" amount={currentData.details.materialFirst} />
                <DetailRow label="재료비후반" amount={currentData.details.materialSecond} />
                <div className="h-px w-full bg-[#F2F2F7] my-3" />
                <DetailRow label="인건비" amount={currentData.details.labor} />
                <DetailRow label="임대료" amount={currentData.details.rent} />
                <div className="h-px w-full bg-[#F2F2F7] my-3" />
                <DetailRow label="관리비" amount={currentData.details.admin} />
                <DetailRow label="기장료" amount={currentData.details.accounting} />
                <DetailRow label="로열티" amount={currentData.details.royalty} />
                <DetailRow label="홍보비(배너 등)" amount={currentData.details.promotion} />
                <DetailRow label="cctv,전화" amount={currentData.details.cctv} />
                <DetailRow label="브랜드라디오" amount={currentData.details.radio} />
                <DetailRow label="화재보험" amount={currentData.details.insurance} />
              </div>
            </div>
            
            <div className="pt-5 border-t border-[#E5E5EA] mt-auto">
              <div className="flex justify-between items-center bg-[#FFF5F5] p-4 rounded-2xl">
                <span className="font-bold text-[#1C1C1E]">경비 합계</span>
                <span className="font-black text-2xl text-[#FF3B30]">{formatCurrency(currentData.expenses)}</span>
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
      <span className="text-[#8E8E93] font-medium text-[15px]">{label}</span>
      <span className="text-[#1C1C1E] font-semibold text-[15px]">{formatCurrency(amount)}</span>
    </div>
  );
}

export default App;
