import { useState, useEffect } from 'react';
import { FiActivity, FiServer, FiDatabase, FiWifi, FiCheckCircle, FiAlertTriangle, FiXCircle, FiRefreshCw, FiCpu, FiHardDrive } from 'react-icons/fi';
import { FaDollarSign } from 'react-icons/fa';

const initialServices = [
  { name: 'API Gateway', status: 'healthy', uptime: '99.99%', icon: FiServer, latency: '12ms' },
  { name: 'Auth Service', status: 'healthy', uptime: '99.97%', icon: FiShield, latency: '8ms' },
  { name: 'Order Service', status: 'healthy', uptime: '99.95%', icon: FiDatabase, latency: '15ms' },
  { name: 'Payment Gateway', status: 'healthy', uptime: '99.99%', icon: FaDollarSign, latency: '45ms' },
  { name: 'Notification Service', status: 'degraded', uptime: '98.50%', icon: FiBell, latency: '120ms' },
  { name: 'Search Service', status: 'healthy', uptime: '99.90%', icon: FiSearch, latency: '25ms' },
  { name: 'Delivery Tracking', status: 'healthy', uptime: '99.85%', icon: FiMapPin, latency: '18ms' },
  { name: 'Recommendation Engine', status: 'down', uptime: '95.20%', icon: FiCpu, latency: 'N/A' },
];

const kafkaTopics = [
  { name: 'order.created', partitions: 6, messagesPerMin: 245, lag: 0, status: 'healthy' },
  { name: 'payment.processed', partitions: 4, messagesPerMin: 180, lag: 2, status: 'healthy' },
  { name: 'delivery.updated', partitions: 4, messagesPerMin: 160, lag: 5, status: 'degraded' },
  { name: 'notification.send', partitions: 3, messagesPerMin: 320, lag: 0, status: 'healthy' },
  { name: 'analytics.event', partitions: 8, messagesPerMin: 1200, lag: 45, status: 'degraded' },
];

const systemMetrics = [
  { label: 'CPU Usage', value: '62%', color: 'bg-yellow-500', width: '62%' },
  { label: 'Memory', value: '78%', color: 'bg-orange-500', width: '78%' },
  { label: 'Disk I/O', value: '34%', color: 'bg-green-500', width: '34%' },
  { label: 'Network', value: '45%', color: 'bg-blue-500', width: '45%' },
];

import { FiShield, FiBell, FiSearch, FiMapPin } from 'react-icons/fi';

export default function SystemHealth() {
  const [services, setServices] = useState(initialServices);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setLastUpdated(new Date());
      setRefreshing(false);
    }, 1000);
    const randomize = services.map(s => ({
      ...s,
      status: Math.random() > 0.85 ? (Math.random() > 0.5 ? 'degraded' : 'down') : 'healthy',
      latency: Math.random() > 0.7 ? `${Math.floor(Math.random() * 80 + 10)}ms` : s.latency,
    }));
    setServices(randomize);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'bg-green-50 text-green-600 border-green-200';
      case 'degraded': return 'bg-yellow-50 text-yellow-600 border-yellow-200';
      case 'down': return 'bg-red-50 text-red-600 border-red-200';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy': return <FiCheckCircle className="text-green-500" />;
      case 'degraded': return <FiAlertTriangle className="text-yellow-500" />;
      case 'down': return <FiXCircle className="text-red-500" />;
      default: return null;
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">System Health</h1>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500">Last updated: {lastUpdated.toLocaleTimeString()}</span>
          <button onClick={handleRefresh} disabled={refreshing} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-2 disabled:opacity-50">
            <FiRefreshCw className={`${refreshing ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-xl border shadow-sm p-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2"><FiServer className="text-indigo-500" /> Service Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {services.map((service, idx) => (
                <div key={idx} className={`flex items-center justify-between p-3 rounded-lg border ${getStatusColor(service.status)}`}>
                  <div className="flex items-center gap-3">
                    <service.icon className="text-lg" />
                    <div>
                      <p className="text-sm font-medium">{service.name}</p>
                      <p className="text-xs opacity-80">Uptime: {service.uptime}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 justify-end">
                      {getStatusIcon(service.status)}
                      <span className="text-xs font-medium capitalize">{service.status}</span>
                    </div>
                    <p className="text-xs opacity-80 mt-0.5">{service.latency}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border shadow-sm p-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2"><FiActivity className="text-indigo-500" /> Kafka Topics</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Topic</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Partitions</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Msg/min</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Lag</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {kafkaTopics.map((topic, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-800">{topic.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{topic.partitions}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{topic.messagesPerMin.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={`text-sm font-medium ${topic.lag > 10 ? 'text-red-600' : 'text-green-600'}`}>{topic.lag}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${
                          topic.status === 'healthy' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'
                        }`}>
                          {topic.status === 'healthy' ? <FiCheckCircle /> : <FiAlertTriangle />}
                          {topic.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-white rounded-xl border shadow-sm p-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2"><FiCpu className="text-indigo-500" /> System Metrics</h3>
            <div className="space-y-4">
              {systemMetrics.map((metric, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">{metric.label}</span>
                    <span className="text-sm font-medium text-gray-800">{metric.value}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className={`h-2 rounded-full ${metric.color} transition-all duration-500`} style={{ width: metric.width }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border shadow-sm p-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Alert Summary</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                <FiXCircle className="text-red-500" />
                <div>
                  <p className="text-sm font-medium text-red-700">Recommendation Engine Down</p>
                  <p className="text-xs text-red-500">Affecting personalized suggestions</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                <FiAlertTriangle className="text-yellow-500" />
                <div>
                  <p className="text-sm font-medium text-yellow-700">High Kafka Lag</p>
                  <p className="text-xs text-yellow-500">analytics.event topic has 45ms lag</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <FiCheckCircle className="text-green-500" />
                <div>
                  <p className="text-sm font-medium text-green-700">All Critical Systems Operational</p>
                  <p className="text-xs text-green-500">API, Auth, Orders, Payments healthy</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-5 text-white">
            <FiHardDrive className="text-2xl opacity-80" />
            <p className="text-lg font-bold mt-2">Overall Health</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <span className="text-green-400 font-medium">Operational</span>
            </div>
            <p className="text-xs opacity-70 mt-1">5/6 services healthy</p>
            <div className="mt-3 w-full bg-gray-700 rounded-full h-2">
              <div className="h-2 rounded-full bg-green-400" style={{ width: '83%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
