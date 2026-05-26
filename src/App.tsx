import React, { useState } from 'react';
import { financialData, formatCurrency, getMonthName } from './data';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, LabelList } from 'recharts';
import { TrendingUp, TrendingDown, Coffee, ChevronRight, DollarSign, PieChart, Users, Home, Calendar, X } from 'lucide-react';

function App() {
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(financialData.length - 1);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const currentData = financialData[selectedMonthIndex];
  
  const totalExpenses = currentData.expenses.material + currentData.expenses.labor + currentData.expenses.rent + currentData.expenses.others;
  const netProfit = currentData.sales - totalExpenses;
  
  const profitIncrease = selectedMonthIndex > 0 
    ? netProfit - (financialData[selectedMonthIndex - 1].sales - (financialData[selectedMonthIndex - 1].expenses.material + financialData[selectedMonthIndex - 1].expenses.labor + financialData[selectedMonthIndex - 1].expenses.rent + financialData[selectedMonthIndex - 1].expenses.others))
    : 0;

  const year2026Data = financialData.filter(d => d.month.startsWith('2026'));
  const total2026Sales = year2026Data.reduce((acc, curr) => acc + curr.sales, 0);
  const total2026Expenses = year2026Data.reduce((acc, curr) => acc + curr.expenses.material + curr.expenses.labor + curr.expenses.rent + curr.expenses.others, 0);
  const total2026Profit = total2026Sales - total2026Expenses;

  const chartData = financialData.map(d => {
    const expenses = d.expenses.material + d.expenses.labor + d.expenses.rent + d.expenses.others;
    return {
      name: getMonthName(d.month),
      매출: d.sales / 10000,
      지출: expenses / 10000,
      순이익: (d.sales - expenses) / 10000,
    };
  });

  return (
    <div className="min-h-screen bg-[#F2F4F6] text-[#333D4B] font-sans pb-20">
      {/* Header */}
      <header className="sticky top-0 bg-[#F2F4F6]/80 backdrop-blur-md z-10 px-5 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Coffee className="text-blue-500" />
          2026년 우지커피 매출장
        </h1>
        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
          <img src="https://api.dicebear.com/7.x/notionists/svg?seed=oozy" alt="profile" />
        </div>
      </header>

      <main className="px-5 space-y-4 max-w-lg mx-auto">
        {/* Month Selector */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {financialData.map((d, idx) => (
            <button
              key={d.month}
              onClick={() => setSelectedMonthIndex(idx)}
              className={`whitespace-nowrap px-4 py-2 rounded-full font-medium transition-colors ${
                idx === selectedMonthIndex 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : 'bg-white text-gray-500 hover:bg-gray-100'
              }`}
            >
              {getMonthName(d.month)}
            </button>
          ))}
        </div>

        {/* Cumulative Year Card */}
        <section className="bg-white rounded-[24px] p-6 shadow-sm mb-2 mt-4">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Calendar size={20} className="text-blue-500" /> 
            2026년 누적 현황
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-gray-500 font-medium">총 매출</p>
              <p className="text-2xl font-extrabold text-[#3182F6]">{formatCurrency(total2026Sales)}</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-gray-500 font-medium">총 지출</p>
              <p className="text-2xl font-extrabold text-[#F04452]">{formatCurrency(total2026Expenses)}</p>
            </div>
            <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
              <p className="text-gray-500 font-bold">순이익</p>
              <p className="text-2xl font-extrabold text-[#00C471]">{formatCurrency(total2026Profit)}</p>
            </div>
          </div>
        </section>

        {/* Hero Card for Selected Month */}
        <section className="bg-white rounded-[24px] p-6 shadow-sm mb-4">
          <div className="flex justify-between items-center mb-4">
             <h2 className="text-lg font-bold">{getMonthName(currentData.month)} 현황</h2>
             {profitIncrease !== 0 && (
                <div className={`flex items-center gap-1 text-sm font-medium ${profitIncrease > 0 ? 'text-red-500' : 'text-blue-500'}`}>
                  {profitIncrease > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  전월 대비 {formatCurrency(Math.abs(profitIncrease))} {profitIncrease > 0 ? '증가' : '감소'}
                </div>
              )}
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-gray-500 font-medium">총 매출</p>
              <p className="text-2xl font-extrabold text-[#3182F6]">{formatCurrency(currentData.sales)}</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-gray-500 font-medium">총 지출</p>
              <p className="text-2xl font-extrabold text-[#F04452]">{formatCurrency(totalExpenses)}</p>
            </div>
            <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
              <p className="text-gray-500 font-bold">순이익</p>
              <p className="text-2xl font-extrabold text-[#00C471]">{formatCurrency(netProfit)}</p>
            </div>
          </div>
        </section>

        {/* Expense Breakdown */}
        <section className="bg-white rounded-[24px] p-6 shadow-sm">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-lg font-bold">지출 상세</h3>
            <button 
              onClick={() => setIsDetailsOpen(true)}
              className="text-sm text-gray-400 flex items-center hover:text-gray-600 transition-colors"
            >
              자세히 <ChevronRight size={16} />
            </button>
          </div>
          
          <div className="space-y-4">
            <ExpenseItem 
              icon={<Coffee size={20} className="text-amber-600" />}
              iconBg="bg-amber-100"
              title="재료비" 
              amount={currentData.expenses.material} 
              total={totalExpenses} 
            />
            <ExpenseItem 
              icon={<Users size={20} className="text-blue-600" />}
              iconBg="bg-blue-100"
              title="인건비" 
              amount={currentData.expenses.labor} 
              total={totalExpenses} 
            />
            <ExpenseItem 
              icon={<Home size={20} className="text-emerald-600" />}
              iconBg="bg-emerald-100"
              title="임대료" 
              amount={currentData.expenses.rent} 
              total={totalExpenses} 
            />
            <ExpenseItem 
              icon={<DollarSign size={20} className="text-purple-600" />}
              iconBg="bg-purple-100"
              title="기타 경비" 
              amount={currentData.expenses.others} 
              total={totalExpenses} 
              subtitle="관리비, 기장료, 로열티 등"
            />
          </div>
        </section>

        {/* Trend Chart */}
        <section className="bg-white rounded-[24px] p-6 shadow-sm">
          <h3 className="text-lg font-bold mb-5">최근 6개월 추이</h3>
          <p className="text-xs text-gray-400 mb-4">(단위: 만원)</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F2F4F6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#8B95A1' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#8B95A1' }} />
                <Tooltip 
                  cursor={{ stroke: '#F2F4F6', strokeWidth: 2 }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                <Line type="monotone" dataKey="매출" stroke="#3182F6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6 }}>
                  <LabelList dataKey="매출" position="top" fontSize={10} fill="#3182F6" formatter={(v: any) => Math.round(Number(v))} offset={10} />
                </Line>
                <Line type="monotone" dataKey="지출" stroke="#F04452" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6 }}>
                  <LabelList dataKey="지출" position="bottom" fontSize={10} fill="#F04452" formatter={(v: any) => Math.round(Number(v))} offset={10} />
                </Line>
                <Line type="monotone" dataKey="순이익" stroke="#00C471" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6 }}>
                  <LabelList dataKey="순이익" position="top" fontSize={10} fill="#00C471" formatter={(v: any) => Math.round(Number(v))} offset={10} />
                </Line>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Insight Card */}
        <section className="bg-blue-50 rounded-[24px] p-5 shadow-sm flex gap-4 items-start">
          <div className="bg-blue-500 rounded-full p-2 text-white shrink-0 mt-1">
            <PieChart size={20} />
          </div>
          <div>
            <h4 className="font-bold text-blue-900 mb-1">사장님을 위한 리포트</h4>
            <p className="text-sm text-blue-800/80 leading-relaxed">
              이번 달 재료비 비중이 전체 지출의 {((currentData.expenses.material / totalExpenses) * 100).toFixed(0)}%를 차지하고 있어요. 
              {((currentData.expenses.material / totalExpenses) * 100) > 40 ? ' 재료비 비중이 다소 높은 편이니 로스율을 점검해보세요!' : ' 적절한 수준으로 잘 유지되고 있습니다.'}
            </p>
          </div>
        </section>
      </main>

      {/* Details Modal */}
      {isDetailsOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[24px] w-full max-w-md p-6 max-h-[85vh] overflow-y-auto shadow-xl">
            <div className="flex justify-between items-center mb-5 sticky top-0 bg-white z-10 pt-2 pb-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-800">{getMonthName(currentData.month)} 지출 상세 현황표</h3>
              <button onClick={() => setIsDetailsOpen(false)} className="text-gray-400 hover:text-gray-700 bg-gray-100 rounded-full p-2">
                <X size={18} />
              </button>
            </div>
            <div className="overflow-hidden rounded-xl border border-gray-100">
              <table className="w-full text-[15px]">
                <thead className="bg-[#F2F4F6]">
                  <tr>
                    <th className="py-3 px-4 text-left font-bold text-gray-600">경비 항목</th>
                    <th className="py-3 px-4 text-right font-bold text-gray-600">금액</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr><td className="py-3 px-4 text-gray-700">재료비상반</td><td className="py-3 px-4 text-right font-medium text-gray-900">{formatCurrency(currentData.expenses.details.materialFirst)}</td></tr>
                  <tr><td className="py-3 px-4 text-gray-700">재료비후반</td><td className="py-3 px-4 text-right font-medium text-gray-900">{formatCurrency(currentData.expenses.details.materialSecond)}</td></tr>
                  <tr><td className="py-3 px-4 text-gray-700">인건비</td><td className="py-3 px-4 text-right font-medium text-gray-900">{formatCurrency(currentData.expenses.details.labor)}</td></tr>
                  <tr><td className="py-3 px-4 text-gray-700">임대료</td><td className="py-3 px-4 text-right font-medium text-gray-900">{formatCurrency(currentData.expenses.details.rent)}</td></tr>
                  <tr><td className="py-3 px-4 text-gray-700">관리비</td><td className="py-3 px-4 text-right font-medium text-gray-900">{formatCurrency(currentData.expenses.details.admin)}</td></tr>
                  <tr><td className="py-3 px-4 text-gray-700">기장료</td><td className="py-3 px-4 text-right font-medium text-gray-900">{formatCurrency(currentData.expenses.details.accounting)}</td></tr>
                  <tr><td className="py-3 px-4 text-gray-700">로열티</td><td className="py-3 px-4 text-right font-medium text-gray-900">{formatCurrency(currentData.expenses.details.royalty)}</td></tr>
                  <tr><td className="py-3 px-4 text-gray-700">홍보비(배너 등)</td><td className="py-3 px-4 text-right font-medium text-gray-900">{formatCurrency(currentData.expenses.details.promotion)}</td></tr>
                  <tr><td className="py-3 px-4 text-gray-700">cctv,전화</td><td className="py-3 px-4 text-right font-medium text-gray-900">{formatCurrency(currentData.expenses.details.cctv)}</td></tr>
                  <tr><td className="py-3 px-4 text-gray-700">브랜드라디오</td><td className="py-3 px-4 text-right font-medium text-gray-900">{formatCurrency(currentData.expenses.details.radio)}</td></tr>
                  <tr><td className="py-3 px-4 text-gray-700">화재보험</td><td className="py-3 px-4 text-right font-medium text-gray-900">{formatCurrency(currentData.expenses.details.insurance)}</td></tr>
                </tbody>
                <tfoot className="bg-[#FFF5F5] border-t-2 border-red-100">
                  <tr>
                    <td className="py-4 px-4 font-bold text-gray-800">경비 합계</td>
                    <td className="py-4 px-4 text-right font-extrabold text-[#F04452] text-lg">{formatCurrency(totalExpenses)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ExpenseItem({ icon, iconBg, title, subtitle, amount, total }: { icon: React.ReactNode, iconBg: string, title: string, subtitle?: string, amount: number, total: number }) {
  const percentage = Math.round((amount / total) * 100);
  
  return (
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${iconBg}`}>
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <p className="font-semibold text-[15px]">{title}</p>
          <p className="font-bold">{formatCurrency(amount)}</p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-xs text-gray-400">{subtitle || `${percentage}%`}</p>
          <div className="w-1/2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gray-300 rounded-full" 
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
