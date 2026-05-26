import React, { useState } from 'react';
import { financialData, formatCurrency, getMonthName } from './data';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { TrendingUp, TrendingDown, Coffee, ChevronRight, DollarSign, PieChart, Users, Home } from 'lucide-react';

function App() {
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(financialData.length - 1);
  const currentData = financialData[selectedMonthIndex];
  
  const totalExpenses = Object.values(currentData.expenses).reduce((a, b) => a + b, 0);
  const netProfit = currentData.sales - totalExpenses;
  
  const profitIncrease = selectedMonthIndex > 0 
    ? netProfit - (financialData[selectedMonthIndex - 1].sales - Object.values(financialData[selectedMonthIndex - 1].expenses).reduce((a, b) => a + b, 0))
    : 0;

  const chartData = financialData.map(d => {
    const expenses = Object.values(d.expenses).reduce((a, b) => a + b, 0);
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
          우지커피 매출장
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

        {/* Hero Card */}
        <section className="bg-white rounded-[24px] p-6 shadow-sm">
          <p className="text-[15px] font-medium text-gray-500 mb-1">
            {getMonthName(currentData.month)} 순이익
          </p>
          <div className="flex items-end gap-2 mb-4">
            <h2 className="text-3xl font-extrabold tracking-tight">
              {formatCurrency(netProfit)}
            </h2>
          </div>
          
          {profitIncrease !== 0 && (
            <div className={`flex items-center gap-1 text-sm font-medium ${profitIncrease > 0 ? 'text-red-500' : 'text-blue-500'}`}>
              {profitIncrease > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              지난달보다 {formatCurrency(Math.abs(profitIncrease))} {profitIncrease > 0 ? '늘었어요' : '줄었어요'}
            </div>
          )}

          <div className="mt-6 pt-5 border-t border-gray-100 flex justify-between">
            <div>
              <p className="text-xs text-gray-400 mb-1">총 매출</p>
              <p className="font-semibold text-gray-700">{formatCurrency(currentData.sales)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 mb-1">총 지출</p>
              <p className="font-semibold text-gray-700">{formatCurrency(totalExpenses)}</p>
            </div>
          </div>
        </section>

        {/* Expense Breakdown */}
        <section className="bg-white rounded-[24px] p-6 shadow-sm">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-lg font-bold">지출 상세</h3>
            <button className="text-sm text-gray-400 flex items-center">
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
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F2F4F6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#8B95A1' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#8B95A1' }} />
                <Tooltip 
                  cursor={{ fill: '#F2F4F6' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                <Bar dataKey="매출" fill="#E8F3FF" radius={[4, 4, 0, 0]} barSize={12} />
                <Bar dataKey="지출" fill="#FFCCD5" radius={[4, 4, 0, 0]} barSize={12} />
                <Bar dataKey="순이익" fill="#3182F6" radius={[4, 4, 0, 0]} barSize={12} />
              </BarChart>
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
