import InterestChart from "../components/InterestChart"
import GenderPieChart from '../components/GenderPieChart'


import {
  PieChart, Pie, Cell, Tooltip as PieTooltip,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { useEffect, useState } from 'react'

const COLORS = ['#6366f1', '#ec4899']

const pieData = [
  { name: 'Male', value: 70 },
  { name: 'Female', value: 30 },
]


const recentPawns = [
  { bill: 101, name: 'Amit', item: 'Gold Ring', amount: 12000 },
  { bill: 102, name: 'Priya', item: 'Necklace', amount: 25000 },
  { bill: 103, name: 'Rahul', item: 'Bracelet', amount: 18000 },
]

export default function Dashboard() {
  const [stats, setStats] = useState({
    customers: 120,
    loan: 275000,
    interest: 46000,
    pawnItems: 78,
  })

  return (
    <div className="min-h-screen bg-black text-white p-6 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
        
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title="Customers" value={stats.customers} />
        <Card title="Loan Given" value={`₹${stats.loan.toLocaleString()}`} />
        <Card title="Interest Earned" value={`₹${stats.interest.toLocaleString()}`} />
        <Card title="Total Pawns" value={stats.pawnItems} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
       
        <GenderPieChart/>
        <InterestChart/>
        
            
      </div>

      {/* Recent Pawn Table */}
      <div className="bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow">
        <h2 className="text-lg font-semibold mb-4">Recent Pawned Items</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-white/10 text-white/80">
                <th className="py-2">Bill No</th>
                <th>Name</th>
                <th>Item</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentPawns.map((pawn, i) => (
                <tr key={i} className="border-b border-white/10 hover:bg-white/5 transition">
                  <td className="py-2">{pawn.bill}</td>
                  <td>{pawn.name}</td>
                  <td>{pawn.item}</td>
                  <td>₹{pawn.amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function Card({ title, value }) {
  return (
    <div className="bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow flex flex-col justify-between">
      <p className="text-sm text-white/70">{title}</p>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  )
}
