import React, { useState, useEffect } from 'react';
import { CreditCard, Calendar, CheckCircle, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { motion } from 'framer-motion'; // Fixed import name
import './admin-theme.css';

const AdminDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDonations();
  }, [page]);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const baseURL = (import.meta.env.DEV && window.location.hostname === 'localhost')
        ? 'http://localhost:4040'
        : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:4040');
      
      const response = await axios.get(
        `${baseURL}/api/admin/donations?page=${page}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Backend response checks
      const data = response.data.data || [];
      setDonations(data);
      setPagination(response.data.pagination);
      
      // Calculate total only for SUCCESS status
      const total = data.reduce((sum, d) => 
        d.paymentStatus === 'SUCCESS' ? sum + (d.amount || 0) : sum, 0
      );
      setTotalAmount(total);
    } catch (error) {
      console.error('Error fetching donations:', error);
      toast.error('Failed to load donations');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'SUCCESS': return 'bg-green-100 text-green-700 border-green-300';
      case 'PENDING': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'FAILED': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-gray-100 text-black border-gray-300';
    }
  };

  const filteredDonations = donations.filter(donation =>
    donation.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    donation.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-200 rounded-full mx-auto animate-spin" 
               style={{ borderTopColor: '#000000' }}></div>
          <p className="mt-4 text-gray-600 font-medium">Loading donations...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-md border-2 border-black p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-['Courier_New']">Total Raised</p>
              <p className="text-3xl font-bold">₹{totalAmount.toLocaleString()}</p>
            </div>
            <CreditCard className="text-orange-500" size={32} />
          </div>
        </div>
        {/* Add other cards similarly... */}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search donor..."
          className="w-full pl-12 pr-6 py-3 border-2 border-black rounded-xl"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border-2 border-black overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b-2 border-black">
            <tr>
              <th className="px-6 py-4 text-left">Donor</th>
              <th className="px-6 py-4 text-left">Amount</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredDonations.map((donation) => (
              <tr key={donation._id} className="border-b border-gray-200">
                <td className="px-6 py-4">{donation.name}</td>
                <td className="px-6 py-4 font-bold">₹{donation.amount}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(donation.paymentStatus)}`}>
                    {donation.paymentStatus}
                  </span>
                </td>
                <td className="px-6 py-4">{new Date(donation.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination?.pages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <button 
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="px-4 py-2 border-2 border-black rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <span>Page {page} of {pagination.pages}</span>
          <button 
            disabled={page === pagination.pages}
            onClick={() => setPage(p => p + 1)}
            className="px-4 py-2 border-2 border-black rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
      <ToastContainer />
    </motion.div>
  );
};

export default AdminDonations;