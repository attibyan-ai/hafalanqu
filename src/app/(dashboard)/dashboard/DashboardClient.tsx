"use client";

import { motion } from "framer-motion";
import { Users, BookOpen, BarChart3, CalendarCheck, ClipboardList, UserCog } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { StatCard, ChartCard } from "@/components/shared";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getInitials, formatDateShort } from "@/lib/utils";
import { useSession } from "next-auth/react";

interface DashboardClientProps {
  stats: {
    totalSantri: number;
    setoranHariIni: number;
    rataKualitas: number;
    kehadiran: number;
    trendSantri: number;
    trendSetoran: number;
    trendKualitas: number;
    trendKehadiran: number;
    recentActivities: Array<{
      id: string;
      santriNama: string;
      action: string;
      detail: string;
      timestamp: string;
      avatar: string | null;
    }>;
    topSantri: Array<{
      id: string;
      nama: string;
      ayat: number;
      skor: number;
      rank: number;
    }>;
    hafalanChartData: Array<any>;
    kualitasChartData: Array<any>;
    totalGuru?: number;
    totalHalaqoh?: number;
    adminChartAktivitas?: Array<any>;
    adminChartKualitas?: Array<any>;
    adminRecentActivities?: Array<{
      id: string;
      santriNama: string;
      action: string;
      detail: string;
      timestamp: string;
      avatar: string | null;
    }>;
    adminTopHalaqoh?: Array<{
      id: string;
      nama: string;
      ayat: number;
      skor: number;
      rank: number;
    }>;
  };
}

export default function DashboardClient({ stats }: DashboardClientProps) {
  const { data: session } = useSession();
  const role = session?.user?.role || "ustadz";
  const isAdmin = role === "admin";

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold tracking-tight"
        >
          Assalamu'alaikum, {session?.user?.name || "Ustadz"} 👋
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground"
        >
          {formatDateShort(new Date().toISOString())} — Berikut ringkasan aktivitas hari ini.
        </motion.p>
      </div>

      {isAdmin ? (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-3 gap-6"
        >
          <StatCard title="Total Guru" value={stats.totalGuru || 0} icon={UserCog} color="info" />
          <StatCard title="Total Halaqoh" value={stats.totalHalaqoh || 0} icon={ClipboardList} color="warning" />
          <StatCard title="Total Santri" value={stats.totalSantri} icon={Users} color="primary" />
        </motion.div>
      ) : (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <StatCard title="Total Santri" value={stats.totalSantri} trend={stats.trendSantri} icon={Users} color="primary" />
          <StatCard title="Setoran Hari Ini" value={stats.setoranHariIni} trend={stats.trendSetoran} icon={BookOpen} color="info" />
          <StatCard title="Rata-rata Kualitas" value={`${stats.rataKualitas}%`} trend={stats.trendKualitas} icon={BarChart3} color="success" />
          <StatCard title="Kehadiran" value={`${stats.kehadiran}%`} trend={stats.trendKehadiran} icon={CalendarCheck} color="warning" />
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isAdmin ? (
          <>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <ChartCard title="Aktivitas Input per Halaqoh">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.adminChartAktivitas || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorAktivitas" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0F7B53" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#0F7B53" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px -4px rgba(0,0,0,0.1)' }}
                      labelStyle={{ fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}
                    />
                    <Area type="monotone" dataKey="total" name="Total Setoran" stroke="#0F7B53" strokeWidth={3} fillOpacity={1} fill="url(#colorAktivitas)" />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartCard>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <ChartCard title="Distribusi Kualitas Global">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.kualitasChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={110}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {stats.kualitasChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      formatter={(value: number) => [`${value}%`, 'Persentase']}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px -4px rgba(0,0,0,0.1)' }}
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>
            </motion.div>
          </>
        ) : (
          <>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <ChartCard title="Tren Hafalan Mingguan">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.hafalanChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorZiyadah" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0F7B53" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0F7B53" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorMurajaah" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px -4px rgba(0,0,0,0.1)' }}
                  labelStyle={{ fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}
                />
                <Area type="monotone" dataKey="ziyadah" stroke="#0F7B53" strokeWidth={3} fillOpacity={1} fill="url(#colorZiyadah)" />
                <Area type="monotone" dataKey="murajaah" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorMurajaah)" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <ChartCard title="Distribusi Kualitas">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.kualitasChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {stats.kualitasChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  formatter={(value: number) => [`${value}%`, 'Persentase']}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px -4px rgba(0,0,0,0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </motion.div>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card p-6">
          <h3 className="font-bold text-xl mb-6">Aktivitas Terbaru</h3>
          <div className="space-y-6">
            {(isAdmin ? (stats.adminRecentActivities || []) : stats.recentActivities).length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">Belum ada aktivitas hari ini.</p>
            ) : (
              (isAdmin ? (stats.adminRecentActivities || []) : stats.recentActivities).map((activity, i) => (
                <div key={activity.id} className="flex gap-4 relative">
                  {i !== (isAdmin ? (stats.adminRecentActivities || []) : stats.recentActivities).length - 1 && (
                    <div className="absolute top-10 bottom-[-24px] left-5 w-0.5 bg-gray-100 dark:bg-white/10"></div>
                  )}
                  <Avatar className="h-10 w-10 shrink-0 border border-gray-100 dark:border-white/10">
                    {activity.avatar && <AvatarImage src={activity.avatar} />}
                    <AvatarFallback className="bg-primary-50 text-primary">{getInitials(activity.santriNama)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm">
                      <span className="font-semibold text-dark">{activity.santriNama}</span>
                      <span className="text-muted-foreground"> • {activity.action}</span>
                    </p>
                    <p className="text-sm font-medium mt-1">{activity.detail}</p>
                    <p className="text-xs text-muted-foreground mt-1">{formatDateShort(activity.timestamp)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="card p-6">
          <h3 className="font-bold text-xl mb-6">{isAdmin ? "Peringkat Halaqoh" : "Peringkat Santri (Hafalan Terbanyak)"}</h3>
          <div className="space-y-4">
            {(isAdmin ? (stats.adminTopHalaqoh || []) : stats.topSantri).length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">{isAdmin ? "Belum ada data halaqoh." : "Belum ada data santri."}</p>
            ) : (
              (isAdmin ? (stats.adminTopHalaqoh || []) : stats.topSantri).map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.03] hover:bg-primary-50 dark:hover:bg-primary-50/10 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                      ${item.rank === 1 ? 'bg-amber-100 text-amber-600' : 
                        item.rank === 2 ? 'bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-300' : 
                        item.rank === 3 ? 'bg-orange-100 text-orange-600' : 
                        'bg-white text-gray-400'}`}>
                      #{item.rank}
                    </div>
                    <div>
                      <p className="font-semibold text-dark">{item.nama}</p>
                      <p className="text-sm text-muted-foreground">{item.ayat} Ayat Terhafal</p>
                    </div>
                  </div>
                  <Badge variant="success" className="px-3 py-1 text-sm font-bold shadow-sm">{item.skor}</Badge>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
