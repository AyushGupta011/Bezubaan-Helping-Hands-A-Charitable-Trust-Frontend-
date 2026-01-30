import React, { useState, useEffect } from 'react';
import { Trash2, Mail, Calendar, Search, ChevronLeft, ChevronRight, MessageSquare, User } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { motion } from 'motion/react';
import './admin-theme.css';

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    fetchContacts();
  }, [page]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const baseURL = (import.meta.env.DEV && window.location.hostname === 'localhost')
        ? 'http://localhost:4040'
        : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:4040');
      const response = await axios.get(
        `${baseURL}/api/admin/contacts?page=${page}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setContacts(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast.error('Failed to load contacts', { position: 'top-right', autoClose: 3000 });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        const token = localStorage.getItem('token');
        const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4040';
        await axios.delete(`${baseURL}/api/admin/contacts/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Message deleted successfully!', { position: 'top-right', autoClose: 2000 });
        fetchContacts();
      } catch (error) {
        console.error('Error deleting contact:', error);
        toast.error('Failed to delete message', { position: 'top-right', autoClose: 3000 });
      }
    }
  };

  const handleViewMessage = (contact) => {
    setSelectedContact(contact);
  };

  const closeModal = () => {
    setSelectedContact(null);
  };

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center h-64"
      >
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 rounded-full mx-auto animate-spin" 
               style={{ borderTopColor: '#000000' }}></div>
          <motion.p 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-gray-600 font-medium font-['Courier_New']"
          >
            Loading messages...
          </motion.p>
        </div>
      </motion.div>
    );
  }

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
      {/* Header Section with Stats */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-bold text-gray-800 font-['Courier_New']"
          >
            Contact Messages
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 mt-2 font-['Courier_New']"
          >
            Manage and respond to contact form submissions
          </motion.p>
        </div>
        
        {/* Quick Stats */}
        <div className="flex gap-4">
          <motion.div 
            whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(249, 115, 22, 0.3)" }}
            className="bg-gradient-to-br from-black to-gray-800 text-white px-6 py-4 rounded-2xl shadow-lg border-2 border-black transition-all"
          >
            <div className="text-3xl font-bold">{pagination?.total || 0}</div>
            <div className="text-sm opacity-90 mt-1">Total Messages</div>
          </motion.div>
          <motion.div 
            whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            className="bg-white border-2 border-black px-6 py-4 rounded-2xl shadow-lg transition-all"
          >
            <div className="text-3xl font-bold text-black">{filteredContacts.length}</div>
            <div className="text-sm text-gray-600 mt-1">Showing</div>
          </motion.div>
        </div>
      </div>

      {/* Search Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="relative mb-8"
      >
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400" size={22} />
        <input
          type="text"
          placeholder="Search by name, email, or message..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-6 py-4 text-lg border-2 border-stone-200 rounded-xl 
                   focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent
                   bg-white shadow-sm transition-all duration-300"
        />
      </motion.div>

      {/* Contacts Container */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl shadow-lg overflow-hidden border border-stone-100"
      >
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 border-b-2 border-black">
                <th className="px-8 py-5 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider font-['Courier_New']">
                  <div className="flex items-center gap-2">
                    <User size={18} />
                    Contact
                  </div>
                </th>
                <th className="px-8 py-5 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider font-['Courier_New']">
                  Message Preview
                </th>
                <th className="px-8 py-5 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider font-['Courier_New']">
                  Date
                </th>
                <th className="px-8 py-5 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider font-['Courier_New']">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredContacts.length > 0 ? (
                filteredContacts.map((contact, index) => (
                  <motion.tr 
                    key={contact._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-all duration-300"
                  >
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-lg font-semibold text-gray-800 mb-1">
                          {contact.name}
                        </span>
                        <a 
                          href={`mailto:${contact.email}`}
                          className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 text-sm"
                        >
                          <Mail size={16} />
                          {contact.email}
                        </a>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div 
                        className="max-w-md cursor-pointer group"
                        onClick={() => handleViewMessage(contact)}
                      >
                        <p className="text-gray-600 line-clamp-2 group-hover:text-gray-800 transition-colors">
                          {contact.message}
                        </p>
                        <span className="text-sm text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                          Click to read full message →
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3 text-gray-600">
                        <Calendar size={18} className="text-black" />
                        <span className="font-medium">
                          {new Date(contact.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <motion.button
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleViewMessage(contact)}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-md flex items-center gap-2"
                          title="View Message"
                        >
                          <MessageSquare size={18} />
                          <span>View</span>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDelete(contact._id)}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium shadow-md flex items-center gap-2"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                          <span>Delete</span>
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-8 py-16 text-center">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center gap-4"
                    >
                      <MessageSquare className="text-stone-300" size={48} />
                      <p className="text-xl text-stone-500">
                        {searchTerm ? 'No messages match your search' : 'No messages yet'}
                      </p>
                    </motion.div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-8 py-6 border-t-2 border-black flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div className="text-sm text-gray-600 font-['Courier_New']">
              Showing page {pagination.page} of {pagination.pages} • {pagination.total} total messages
            </div>
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-5 py-2.5 bg-white border-2 border-black text-black rounded-lg hover:bg-gray-100 
                         disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 
                         font-medium flex items-center gap-2 font-['Courier_New']"
              >
                <ChevronLeft size={20} />
                Previous
              </motion.button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                  let pageNum;
                  if (pagination.pages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= pagination.pages - 2) {
                    pageNum = pagination.pages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`w-10 h-10 rounded-lg font-medium transition-all duration-300 ${
                        page === pageNum
                          ? 'bg-black text-white border-2 border-black'
                          : 'bg-white text-gray-800 hover:bg-gray-100 border border-gray-300'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setPage(Math.min(pagination.pages, page + 1))}
                disabled={page === pagination.pages}
                className="px-5 py-2.5 bg-white border-2 border-black text-black rounded-lg hover:bg-gray-100 
                         disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 
                         font-medium flex items-center gap-2 font-['Courier_New']"
              >
                Next
                <ChevronRight size={20} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Message Modal */}
      {selectedContact && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={closeModal}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden border-2 border-black"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-black px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <User className="text-white" size={24} />
                  <div>
                    <h3 className="text-2xl font-bold text-white font-['Courier_New']">{selectedContact.name}</h3>
                    <a 
                      href={`mailto:${selectedContact.email}`}
                      className="text-gray-300 hover:text-white flex items-center gap-2 text-sm"
                    >
                      <Mail size={16} />
                      {selectedContact.email}
                    </a>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="text-white hover:text-gray-300 text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="flex items-center gap-2 mt-4 text-white/80">
                <Calendar size={16} />
                <span className="text-sm">
                  {new Date(selectedContact.createdAt).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-8 overflow-y-auto max-h-[50vh]">
              <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2 font-['Courier_New']">
                <MessageSquare size={20} className="text-black" />
                Message
              </h4>
              <div className="bg-gray-50 border-l-4 border-black px-6 py-4 rounded-r-lg">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {selectedContact.message}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-8 py-6 border-t-2 border-black flex justify-end gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  window.location.href = `mailto:${selectedContact.email}`;
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg 
                         hover:bg-blue-700 transition-all duration-300 font-medium border-2 border-blue-600 font-['Courier_New']"
              >
                Reply via Email
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this message?')) {
                    handleDelete(selectedContact._id);
                    closeModal();
                  }
                }}
                className="px-6 py-3 bg-red-600 text-white rounded-lg 
                         hover:bg-red-700 transition-all duration-300 font-medium border-2 border-red-600 font-['Courier_New']"
              >
                Delete Message
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
      <ToastContainer />
    </div>
  );
};

export default AdminContacts;