 import React, { useState, useEffect } from 'react';
import { Flag, MapPin, Calendar, Search, ChevronLeft, ChevronRight, Clock, CheckCircle } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion'; // Fixed Import Name
import './admin-theme.css';

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // API base URL configuration
  const getBaseURL = () => {
    return (import.meta.env.DEV && window.location.hostname === 'localhost')
      ? 'http://localhost:4040'
      : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:4040');
  };

  useEffect(() => {
    fetchReports();
  }, [page]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${getBaseURL()}/api/admin/reports?page=${page}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReports(response.data.data || []);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${getBaseURL()}/api/admin/reports/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Status updated!');
      fetchReports(); // Refresh data
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-700 border-red-300';
      case 'in_progress': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'resolved': return 'bg-green-100 text-green-700 border-green-300';
      default: return 'bg-gray-100 text-black border-gray-300';
    }
  };

  const filteredReports = reports.filter(report =>
    report.reporterName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statusCounts = {
    open: reports.filter(r => r.status === 'open').length,
    in_progress: reports.filter(r => r.status === 'in_progress').length,
    resolved: reports.filter(r => r.status === 'resolved').length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatusCard title="Open Reports" count={statusCounts.open} Icon={Flag} color="text-red-600" />
          <StatusCard title="In Progress" count={statusCounts.in_progress} Icon={Clock} color="text-yellow-600" />
          <StatusCard title="Resolved" count={statusCounts.resolved} Icon={CheckCircle} color="text-green-600" />
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search reports..."
            className="w-full pl-12 pr-6 py-3 border-2 border-black rounded-xl focus:ring-2 focus:ring-black outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-2xl border-2 border-black overflow-hidden shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b-2 border-black font-['Courier_New']">
                <tr>
                  <th className="px-6 py-4 text-left">Reporter</th>
                  <th className="px-6 py-4 text-left">Location</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredReports.map((report) => (
                    <motion.tr 
                      key={report._id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 font-medium">{report.reporterName}</td>
                      <td className="px-6 py-4 flex items-center gap-2">
                        <MapPin size={14} /> {report.location}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={report.status}
                          onChange={(e) => handleStatusChange(report._id, e.target.value)}
                          className={`px-3 py-1 rounded-full text-xs font-bold border-2 cursor-pointer ${getStatusColor(report.status)}`}
                        >
                          <option value="open">Open</option>
                          <option value="in_progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {pagination?.pages > 1 && (
          <div className="flex justify-between items-center bg-white p-4 border-2 border-black rounded-xl">
            <button 
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="flex items-center gap-2 px-4 py-2 border-2 border-black rounded-lg disabled:opacity-30"
            >
              <ChevronLeft size={18} /> Prev
            </button>
            <span className="font-['Courier_New'] font-bold">Page {page} of {pagination.pages}</span>
            <button 
              disabled={page === pagination.pages}
              onClick={() => setPage(p => p + 1)}
              className="flex items-center gap-2 px-4 py-2 border-2 border-black rounded-lg disabled:opacity-30"
            >
              Next <ChevronRight size={18} />
            </button>
          </div>
        )}
      </motion.div>
      <ToastContainer />
    </div>
  );
};

// Reusable Card Component
const StatusCard = ({ title, count, Icon, color }) => (
  <div className="bg-white rounded-2xl shadow-md border-2 border-black p-5">
    <div className="flex justify-between items-center">
      <div>
        <p className="text-sm font-bold text-gray-500 uppercase">{title}</p>
        <p className="text-3xl font-black mt-1">{count}</p>
      </div>
      <div className={`p-3 bg-gray-50 rounded-xl border border-gray-200`}>
        <Icon size={24} className={color} />
      </div>
    </div>
  </div>
);

export default AdminReports;