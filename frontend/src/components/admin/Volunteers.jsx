import React, { useState, useEffect } from 'react';
import { Users, Phone, MapPin, Calendar, Search, ChevronLeft, ChevronRight, Award } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion'; // Fixed Import
import './admin-theme.css';

const AdminVolunteers = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchVolunteers();
  }, [page]);

  const fetchVolunteers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const baseURL = (import.meta.env.DEV && window.location.hostname === 'localhost')
        ? 'http://localhost:4040'
        : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:4040');
      
      const response = await axios.get(
        `${baseURL}/api/admin/volunteers?page=${page}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const data = response.data.data || [];
      setVolunteers(data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching volunteers:', error);
      toast.error('Failed to load volunteers');
    } finally {
      setLoading(false);
    }
  };

  // Optional Chaining added to prevent crashes if name/email is missing
  const filteredVolunteers = volunteers.filter(v =>
    v.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Optimized role counting
  const roleCounts = filteredVolunteers.reduce((acc, v) => {
    const role = v.role || 'Volunteer';
    acc[role] = (acc[role] || 0) + 1;
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
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
        <header>
          <h1 className="text-4xl font-bold font-['Courier_New']">Volunteers</h1>
          <p className="text-gray-600">Manage registrations and activities</p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard title="Total" count={filteredVolunteers.length} icon={<Users />} isDark />
          <StatCard title="Caregivers" count={roleCounts['Caregiver'] || 0} icon={<Award />} />
          <StatCard title="Feeders" count={roleCounts['Feeder'] || 0} icon={<Award />} />
          <StatCard title="Rescuers" count={roleCounts['Rescuer'] || 0} icon={<Award />} />
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search volunteers..."
            className="w-full pl-12 pr-6 py-3 border-2 border-black rounded-xl focus:ring-2 focus:ring-black outline-none font-['Courier_New']"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border-2 border-black overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b-2 border-black">
                <tr>
                  {['Name', 'Email', 'Phone', 'Role', 'Date'].map(h => (
                    <th key={h} className="px-6 py-4 text-left font-['Courier_New'] font-bold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredVolunteers.map((v, i) => (
                    <motion.tr 
                      key={v._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-black">{v.name}</td>
                      <td className="px-6 py-4 text-gray-600">{v.email}</td>
                      <td className="px-6 py-4 text-gray-600">{v.phone || 'N/A'}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-bold border border-black bg-orange-50">
                          {v.role || 'Volunteer'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-sm">
                        {new Date(v.createdAt).toLocaleDateString()}
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
              className="px-4 py-2 border-2 border-black rounded-lg disabled:opacity-30 hover:bg-gray-100"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="font-['Courier_New'] font-bold">Page {page} / {pagination.pages}</span>
            <button 
              disabled={page === pagination.pages}
              onClick={() => setPage(p => p + 1)}
              className="px-4 py-2 border-2 border-black rounded-lg disabled:opacity-30 hover:bg-gray-100"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </motion.div>
      <ToastContainer />
    </div>
  );
};

// Sub-component for clean code
const StatCard = ({ title, count, icon, isDark = false }) => (
  <motion.div 
    whileHover={{ y: -4 }}
    className={`p-5 rounded-2xl border-2 border-black shadow-md ${isDark ? 'bg-black text-white' : 'bg-white text-black'}`}
  >
    <div className="flex justify-between items-start">
      <div>
        <p className={`text-xs font-bold uppercase ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{title}</p>
        <p className="text-3xl font-black mt-1">{count}</p>
      </div>
      <div className={`p-2 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
        {React.cloneElement(icon, { size: 24 })}
      </div>
    </div>
  </motion.div>
);

export default AdminVolunteers;