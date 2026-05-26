import { useState, useMemo } from 'react';
import { financialData, formatCurrency, formatCompact, getMonthName } from './data';
import { ChevronRight, X, CreditCard } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

type TimeRange = 'monthly' | '6months' | '1year';

function App() {
  const [timeRange, setTimeRange] = useState<TimeRange>('monthly');
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(financialData.length - 1);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

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

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#34C759] selection:text-black pb-20">
      {/* Header */}
      <header className="pt-12 pb-6 px-6 sticky top-0 bg-black/80 backdrop-blur-xl z-20 border-b border-[#2C2C2E]">
        <h1 className="text-3xl font-semibold tracking-tight text-white mb-6">
          우지커피
        </h1>
        
        {/* Segmented Control */}
        <div className="flex bg-[#1C1C1E] p-1 rounded-xl">
          <button 
            onClick={() => setTimeRange('monthly')}
            className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-all ${timeRange === 'monthly' ? 'bg-[#3A3A3C] text-white shadow-sm' : 'text-gray-400'}`}
          >
            월별
          </button>
          <button 
            onClick={() => setTimeRange('6months')}
            className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-all ${timeRange === '6months' ? 'bg-[#3A3A3C] text-white shadow-sm' : 'text-gray-400'}`}
          >
            최근 6개월
          </button>
          <button 
            onClick={() => setTimeRange('1year')}
            className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-all ${timeRange === '1year' ? 'bg-[#3A3A3C] text-white shadow-sm' : 'text-gray-400'}`}
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
                className={`snap-center whitespace-nowrap px-5 py-2.5 rounded-full text-[15px] font-medium transition-all duration-300 ${
                  idx === selectedMonthIndex 
                    ? 'bg-white text-black' 
                    : 'bg-[#1C1C1E] text-gray-400 hover:bg-[#2C2C2E]'
                }`}
              >
                {getMonthName(d.month)}
              </button>
            ))}
          </div>
        )}

        {/* Main Dashboard Card */}
        <section>
          <p className="text-[#8E8E93] text-[15px] font-medium mb-1">{currentData.title}</p>
          <h2 className="text-[40px] leading-tight font-bold tracking-tight mb-8">
            <span className="text-[#34C759]">{formatCurrency(currentData.profit)}</span>
            <span className="block text-[#8E8E93] text-xl font-medium mt-1">순이익</span>
          </h2>

          {/* Visual Profit/Expense Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm font-medium mb-2">
              <span className="text-white">총 매출 {formatCompact(currentData.sales)}</span>
              <span className="text-[#8E8E93]">100%</span>
            </div>
            
            <div className="h-4 bg-[#1C1C1E] rounded-full overflow-hidden flex w-full">
              <div 
                className="h-full bg-[#FF3B30] transition-all duration-1000 ease-out relative"
                style={{ width: `${expenseRatio}%` }}
              />
              <div 
                className="h-full bg-[#34C759] transition-all duration-1000 ease-out"
                style={{ width: `${profitRatio}%` }}
              />
            </div>
            
            <div className="flex justify-between mt-3 text-sm">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#FF3B30]"></div>
                <span className="text-[#8E8E93]">경비</span>
                <span className="font-medium text-white">{formatCompact(currentData.expenses)}</span>
                <span className="text-[#8E8E93] text-xs">({expenseRatio.toFixed(1)}%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#34C759]"></div>
                <span className="text-[#8E8E93]">수익</span>
                <span className="font-medium text-white">{formatCompact(currentData.profit)}</span>
                <span className="text-[#8E8E93] text-xs">({profitRatio.toFixed(1)}%)</span>
              </div>
            </div>
          </div>
        </section>

        {/* Action Button for Details (Only in monthly mode) */}
        {timeRange === 'monthly' && currentData.details && (
          <button 
            onClick={() => setIsDetailsOpen(true)}
            className="w-full bg-[#1C1C1E] hover:bg-[#2C2C2E] transition-colors rounded-2xl p-4 flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FF3B30]/20 flex items-center justify-center">
                <CreditCard size={20} className="text-[#FF3B30]" />
              </div>
              <div className="text-left">
                <p className="text-white font-medium">지출 상세 내역 보기</p>
                <p className="text-[#8E8E93] text-sm">{formatCurrency(currentData.expenses)}</p>
              </div>
            </div>
            <ChevronRight className="text-[#8E8E93] group-hover:text-white transition-colors" />
          </button>
        )}

        {/* Chart Section */}
        {timeRange !== 'monthly' && (
          <section className="bg-[#1C1C1E] rounded-3xl p-6">
            <h3 className="text-lg font-semibold mb-6">수익 추이 (단위: 만원)</h3>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2C2C2E" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#8E8E93' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#8E8E93' }} />
                  <Tooltip 
                    cursor={{ fill: '#2C2C2E' }}
                    contentStyle={{ backgroundColor: '#1C1C1E', borderRadius: '12px', border: '1px solid #3A3A3C', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Bar dataKey="순이익" fill="#34C759" radius={[4, 4, 0, 0]} maxBarSize={16} />
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
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={() => setIsDetailsOpen(false)}
          />
          
          {/* Modal Content */}
          <div className="relative bg-[#1C1C1E] w-full sm:max-w-md rounded-t-[32px] sm:rounded-[32px] p-6 max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:zoom-in-95">
            <div className="flex justify-center mb-4 sm:hidden">
              <div className="w-12 h-1.5 bg-[#3A3A3C] rounded-full" />
            </div>
            
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">{getMonthName(financialData[selectedMonthIndex].month)} 세부 경비</h3>
              <button 
                onClick={() => setIsDetailsOpen(false)} 
                className="text-[#8E8E93] hover:text-white bg-[#2C2C2E] rounded-full p-2 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="overflow-y-auto flex-1 pr-2 custom-scrollbar">
              <div className="space-y-1 pb-6">
                <DetailRow label="재료비상반" amount={currentData.details.materialFirst} />
                <DetailRow label="재료비후반" amount={currentData.details.materialSecond} />
                <div className="h-px w-full bg-[#2C2C2E] my-2" />
                <DetailRow label="인건비" amount={currentData.details.labor} />
                <DetailRow label="임대료" amount={currentData.details.rent} />
                <div className="h-px w-full bg-[#2C2C2E] my-2" />
                <DetailRow label="관리비" amount={currentData.details.admin} />
                <DetailRow label="기장료" amount={currentData.details.accounting} />
                <DetailRow label="로열티" amount={currentData.details.royalty} />
                <DetailRow label="홍보비(배너 등)" amount={currentData.details.promotion} />
                <DetailRow label="cctv,전화" amount={currentData.details.cctv} />
                <DetailRow label="브랜드라디오" amount={currentData.details.radio} />
                <DetailRow label="화재보험" amount={currentData.details.insurance} />
              </div>
            </div>
            
            <div className="pt-4 border-t border-[#2C2C2E] mt-auto">
              <div className="flex justify-between items-center">
                <span className="font-medium text-white">경비 합계</span>
                <span className="font-bold text-xl text-[#FF3B30]">{formatCurrency(currentData.expenses)}</span>
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
    <div className="flex justify-between items-center py-2.5">
      <span className="text-[#8E8E93] font-medium">{label}</span>
      <span className="text-white font-medium">{formatCurrency(amount)}</span>
    </div>
  );
}

export default App;
