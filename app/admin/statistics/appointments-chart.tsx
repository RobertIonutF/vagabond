// app/admin/statistics/appointments-chart.tsx
"use client"

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'

type AppointmentData = {
  month: string
  appointments: number
}

export function AppointmentsChart({ data }: { data: AppointmentData[] }) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <XAxis
          dataKey="month"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip />
        <Line type="monotone" dataKey="appointments" stroke="#8884d8" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  )
}