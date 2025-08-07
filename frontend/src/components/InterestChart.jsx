import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { useState } from 'react'

const allData = {
  2024: [
    { month: 'Jan', loan: 20000, interest: 2200, bills: 5 },
    { month: 'Feb', loan: 25000, interest: 2800, bills: 7 },
    { month: 'Mar', loan: 30000, interest: 3500, bills: 6 },
    { month: 'Apr', loan: 18000, interest: 2000, bills: 4 },
    { month: 'May', loan: 35000, interest: 3900, bills: 9 },
    { month: 'Jun', loan: 27000, interest: 3100, bills: 6 },
  ],
  2023: [
    { month: 'Jan', loan: 15000, interest: 1800, bills: 3 },
    { month: 'Feb', loan: 20000, interest: 2500, bills: 4 },
    { month: 'Mar', loan: 22000, interest: 2700, bills: 5 },
    { month: 'Apr', loan: 19000, interest: 2100, bills: 3 },
    { month: 'May', loan: 25000, interest: 3100, bills: 4 },
    { month: 'Jun', loan: 28000, interest: 3300, bills: 5 },
  ]
}

export default function InterestChart() {
  const [selectedYear, setSelectedYear] = useState(2024)
  const [visible, setVisible] = useState({
    loan: true,
    interest: true,
    bills: false,
  })

  const toggle = (key) => setVisible(prev => ({ ...prev, [key]: !prev[key] }))

  const data = allData[selectedYear]

  return (
    <div className="bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-3 sm:items-center">
        <h2 className="text-lg font-semibold">Loan & Interest Over Time</h2>
        <div className="flex items-center gap-3 text-sm text-white/80">
          <select
            className="bg-neutral-800 border border-white/10 rounded px-2 py-1"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            {Object.keys(allData).map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>

          {['loan', 'interest', 'bills'].map(key => (
            <label key={key} className="flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={visible[key]}
                onChange={() => toggle(key)}
              />
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </label>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="loanColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="intColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="billsColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="month" stroke="#ccc" />
          <YAxis stroke="#ccc" />
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <Tooltip />
          {visible.loan && <Area type="monotone" dataKey="loan" stroke="#10b981" fillOpacity={1} fill="url(#loanColor)" />}
          {visible.interest && <Area type="monotone" dataKey="interest" stroke="#6366f1" fillOpacity={1} fill="url(#intColor)" />}
          {visible.bills && <Area type="monotone" dataKey="bills" stroke="#f59e0b" fillOpacity={1} fill="url(#billsColor)" />}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
