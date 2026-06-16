import { useState } from 'react';
import { FiDownload, FiFileText, FiBarChart2, FiMessageSquare, FiCalendar, FiChevronDown } from 'react-icons/fi';

const reportTypes = [
  { id: 'sales', label: 'Sales Report', icon: FiBarChart2, description: 'Revenue, order volume, and sales trends' },
  { id: 'engagement', label: 'Engagement Report', icon: FiMessageSquare, description: 'User activity, retention, and engagement metrics' },
  { id: 'complaints', label: 'Complaints Report', icon: FiFileText, description: 'Dispute analysis, refunds, and issue tracking' },
];

const reportHistory = [
  { name: 'Monthly Sales Report - May 2026', type: 'Sales', date: '2026-06-01', format: 'PDF' },
  { name: 'Q2 Engagement Overview', type: 'Engagement', date: '2026-06-15', format: 'Excel' },
  { name: 'Complaint Analysis - May 2026', type: 'Complaints', date: '2026-06-02', format: 'PDF' },
  { name: 'Weekly Sales Snapshot (W23)', type: 'Sales', date: '2026-06-12', format: 'CSV' },
];

export default function ReportsDashboard() {
  const [selectedReport, setSelectedReport] = useState('sales');
  const [dateRange, setDateRange] = useState({ from: '2026-06-01', to: '2026-06-16' });
  const [format, setFormat] = useState('PDF');
  const [generating, setGenerating] = useState(false);

  const currentReport = reportTypes.find(r => r.id === selectedReport);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      alert('Report generated and ready for download!');
    }, 1500);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Reports Dashboard</h1>
        <span className="text-sm text-gray-500 bg-white px-3 py-1.5 rounded-lg border shadow-sm">{reportHistory.length} reports</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Generate Report</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {reportTypes.map(type => (
                <button key={type.id} onClick={() => setSelectedReport(type.id)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    selectedReport === type.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'
                  }`}>
                  <type.icon className={`text-2xl mb-2 ${selectedReport === type.id ? 'text-indigo-600' : 'text-gray-400'}`} />
                  <p className="font-medium text-gray-800">{type.label}</p>
                  <p className="text-xs text-gray-500 mt-1">{type.description}</p>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                <input type="date" value={dateRange.from} onChange={e => setDateRange({...dateRange, from: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                <input type="date" value={dateRange.to} onChange={e => setDateRange({...dateRange, to: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Format:</span>
                {['PDF', 'Excel', 'CSV'].map(f => (
                  <button key={f} onClick={() => setFormat(f)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg ${
                      format === f ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}>{f}</button>
                ))}
              </div>
              <button onClick={handleGenerate} disabled={generating}
                className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50">
                <FiDownload />
                {generating ? 'Generating...' : `Generate ${currentReport?.label}`}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Report Preview</h3>
            <div className="h-64 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center">
              <div className="text-center">
                <FiFileText className="text-4xl text-gray-300 mx-auto" />
                <p className="text-sm text-gray-500 mt-2">Select options and generate to preview</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Reports</h3>
            <div className="space-y-3">
              {reportHistory.map((report, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-indigo-50 rounded-lg">
                    <FiFileText className="text-indigo-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{report.name}</p>
                    <p className="text-xs text-gray-500">{report.date} • {report.format}</p>
                    <span className="text-xs text-indigo-600 font-medium">{report.type}</span>
                  </div>
                  <button className="p-1.5 text-gray-400 hover:text-indigo-600">
                    <FiDownload className="text-sm" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-5 text-white">
            <FiBarChart2 className="text-2xl opacity-80" />
            <p className="text-xl font-bold mt-3">Quick Insights</p>
            <div className="mt-3 space-y-2 text-sm">
              <p>📈 Revenue up 18% this month</p>
              <p>👥 Active users increased by 12%</p>
              <p>⭐ Avg rating: 4.3 across platform</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
