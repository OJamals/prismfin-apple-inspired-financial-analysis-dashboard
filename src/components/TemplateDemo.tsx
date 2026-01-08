import React from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const HAS_TEMPLATE_DEMO = true

const glassCard = 'backdrop-blur-xl bg-white/10 dark:bg-black/20 border-white/20 shadow-2xl'

export function TemplateDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <Card className={`${glassCard} backdrop-blur-2xl sticky top-8 h-fit border-0 shadow-2xl shadow-black/5`}>
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-light tracking-tight text-slate-900">Dashboard</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-4">Metrics</h3>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600 font-medium">Revenue</span>
                      <span className="font-semibold text-teal-600">$124.5K</span>
                    </div>
                    <div className="w-full bg-slate-200/50 rounded-full h-2">
                      <div className="bg-gradient-to-r from-teal-500 to-blue-500 h-2 rounded-full" style={{width: '78%'}}></div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600 font-medium">Growth</span>
                      <span className="font-semibold text-emerald-600">+12.4%</span>
                    </div>
                    <div className="w-full bg-slate-200/50 rounded-full h-2">
                      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full" style={{width: '62%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Header */}
            <div className="space-y-2">
              <h1 className="text-4xl font-light tracking-tight text-slate-900 leading-tight">
                Financial Overview
              </h1>
              <p className="text-xl text-slate-600 font-light">Monthly performance metrics and key insights</p>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Area Chart Card */}
              <Card className="bg-white/80 backdrop-blur-xl border-0 shadow-xl shadow-black/10 hover:shadow-2xl transition-all duration-300 overflow-hidden">
                <CardHeader className="pb-6">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-light text-slate-900">Revenue Trend</CardTitle>
                    <div className="w-3 h-3 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full"></div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-80 bg-gradient-to-br from-slate-50 to-blue-50/50 rounded-3xl p-8 flex items-center justify-center">
                    <div className="w-full h-full bg-gradient-to-r from-teal-500/10 via-blue-500/10 to-indigo-500/10 rounded-2xl animate-pulse"></div>
                  </div>
                </CardContent>
              </Card>

              {/* Metrics Grid */}
              <Card className="bg-white/80 backdrop-blur-xl border-0 shadow-xl shadow-black/10 hover:shadow-2xl transition-all duration-300">
                <CardHeader className="pb-6">
                  <CardTitle className="text-lg font-light text-slate-900">Key Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-end pb-4 border-b border-slate-100">
                      <div>
                        <p className="text-3xl font-light text-slate-900">$124,500</p>
                        <p className="text-sm text-slate-500 font-medium uppercase tracking-wide">Monthly Revenue</p>
                      </div>
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">+12.4%</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div className="text-center p-4 rounded-2xl bg-slate-50/50">
                        <p className="text-2xl font-semibold text-slate-900">847</p>
                        <p className="text-xs text-slate-500 uppercase font-medium tracking-wide">Transactions</p>
                      </div>
                      <div className="text-center p-4 rounded-2xl bg-slate-50/50">
                        <p className="text-2xl font-semibold text-slate-900">$892</p>
                        <p className="text-xs text-slate-500 uppercase font-medium tracking-wide">Avg Order</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Table & Bar Chart Row */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Metrics Table */}
              <Card className="bg-white/80 backdrop-blur-xl border-0 shadow-xl shadow-black/10 hover:shadow-2xl transition-all duration-300 xl:row-span-2">
                <CardHeader className="pb-6">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-light text-slate-900">Performance</CardTitle>
                    <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-200">
                          <th className="text-left py-4 pr-6 font-medium text-sm text-slate-700">Category</th>
                          <th className="text-right py-4 pr-6 font-medium text-sm text-slate-700">Revenue</th>
                          <th className="text-right py-4 font-medium text-sm text-slate-700">Growth</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr>
                          <td className="py-4 pr-6 font-medium text-slate-900">Electronics</td>
                          <td className="text-right py-4 pr-6 font-semibold text-slate-900">$45.2K</td>
                          <td className="text-right py-4">
                            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">+18.2%</span>
                          </td>
                        </tr>
                        <tr>
                          <td className="py-4 pr-6 font-medium text-slate-900">Apparel</td>
                          <td className="text-right py-4 pr-6 font-semibold text-slate-900">$32.8K</td>
                          <td className="text-right py-4">
                            <span className="px-2.5 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">+3.7%</span>
                          </td>
                        </tr>
                        <tr>
                          <td className="py-4 pr-6 font-medium text-slate-900">Home Goods</td>
                          <td className="text-right py-4 pr-6 font-semibold text-slate-900">$28.5K</td>
                          <td className="text-right py-4">
                            <span className="px-2.5 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full">-2.1%</span>
                          </td>
                        </tr>
                        <tr>
                          <td className="py-4 pr-6 font-medium text-slate-900">Books</td>
                          <td className="text-right py-4 pr-6 font-semibold text-slate-900">$18.0K</td>
                          <td className="text-right py-4">
                            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">+9.8%</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Bar Chart */}
              <Card className="bg-white/80 backdrop-blur-xl border-0 shadow-xl shadow-black/10 hover:shadow-2xl transition-all duration-300">
                <CardHeader className="pb-6">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-light text-slate-900">Sales Distribution</CardTitle>
                    <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-96 bg-gradient-to-br from-slate-50 to-purple-50/30 rounded-3xl p-8 flex flex-col justify-end space-y-4">
                    <div className="flex space-x-2 h-64">
                      <div className="flex-1 bg-gradient-to-t from-orange-500 to-orange-400 rounded-xl relative group hover:scale-105 transition-all duration-300" style={{height: '80%'}}></div>
                      <div className="flex-1 bg-gradient-to-t from-blue-500 to-blue-400 rounded-xl relative group hover:scale-105 transition-all duration-300" style={{height: '60%'}}></div>
                      <div className="flex-1 bg-gradient-to-t from-teal-500 to-teal-400 rounded-xl relative group hover:scale-105 transition-all duration-300" style={{height: '95%'}}></div>
                      <div className="flex-1 bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-xl relative group hover:scale-105 transition-all duration-300" style={{height: '45%'}}></div>
                      <div className="flex-1 bg-gradient-to-t from-purple-500 to-purple-400 rounded-xl relative group hover:scale-105 transition-all duration-300" style={{height: '70%'}}></div>
                    </div>
                    <div className="grid grid-cols-5 gap-4 text-xs text-slate-600">
                      <span>Mon</span>
                      <span>Tue</span>
                      <span>Wed</span>
                      <span>Thu</span>
                      <span>Fri</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
