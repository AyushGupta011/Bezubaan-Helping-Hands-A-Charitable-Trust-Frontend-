import Admin from '../models/Admin.js';
import Contact from '../models/Contact.js';
import Volunteer from '../models/Volunteer.js';
import Report from '../models/Report.js';
import Donation from '../models/Donation.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your_secret_key', {
    expiresIn: '7d'
  });
};

// Admin Login
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if admin is active
    if (!admin.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Admin account is inactive'
      });
    }

    // Compare password
    const isPasswordMatch = await admin.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate token
    const token = generateToken(admin._id);

    res.status(200).json({
      success: true,
      message: 'Admin login successful',
      token,
      data: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        permissions: admin.permissions
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error during login',
      error: error.message
    });
  }
};

// Get Dashboard Statistics
export const getDashboardStats = async (req, res) => {
  try {
    const contacts = await Contact.find();
    const volunteers = await Volunteer.find();
    const reports = await Report.find();
    const donations = await Donation.find();

    // Overview stats
    const overview = {
      contacts: {
        total: contacts.length,
        unread: contacts.filter(c => !c.read).length || 0
      },
      volunteers: {
        total: volunteers.length,
        new: volunteers.filter(v => {
          const date = new Date(v.createdAt);
          const monthAgo = new Date();
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return date > monthAgo;
        }).length,
        byRole: volunteers.reduce((acc, v) => {
          const existing = acc.find(item => item._id === (v.role || 'Unspecified'));
          if (existing) {
            existing.count += 1;
          } else {
            acc.push({ _id: v.role || 'Unspecified', count: 1 });
          }
          return acc;
        }, [])
      },
      reports: {
        total: reports.length,
        open: reports.filter(r => r.status === 'open').length || 0,
        inProgress: reports.filter(r => r.status === 'in_progress').length || 0
      },
      donations: {
        successful: donations.filter(d => d.paymentStatus === 'SUCCESS').length || 0,
        monthAmount: donations
          .filter(d => {
            const date = new Date(d.createdAt);
            const monthAgo = new Date();
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return date > monthAgo && d.paymentStatus === 'SUCCESS';
          })
          .reduce((sum, d) => sum + (d.amount || 0), 0)
      }
    };

    // Monthly donations
    const monthlyDonations = donations
      .filter(d => d.paymentStatus === 'SUCCESS')
      .reduce((acc, d) => {
        const date = new Date(d.createdAt);
        const key = `${date.getFullYear()}-${date.getMonth()}`;
        const existing = acc.find(item => 
          item._id.year === date.getFullYear() && 
          item._id.month === date.getMonth() + 1
        );
        if (existing) {
          existing.total += d.amount || 0;
        } else {
          acc.push({
            _id: { month: date.getMonth() + 1, year: date.getFullYear() },
            total: d.amount || 0
          });
        }
        return acc;
      }, [])
      .sort((a, b) => {
        if (a._id.year !== b._id.year) return a._id.year - b._id.year;
        return a._id.month - b._id.month;
      });

    res.status(200).json({
      success: true,
      data: {
        overview,
        monthlyDonations
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard stats',
      error: error.message
    });
  }
};

// Get All Contacts
export const getAllContacts = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const contacts = await Contact.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Contact.countDocuments();

    res.status(200).json({
      success: true,
      data: contacts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching contacts',
      error: error.message
    });
  }
};

// Get All Volunteers
export const getAllVolunteers = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const volunteers = await Volunteer.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Volunteer.countDocuments();

    res.status(200).json({
      success: true,
      data: volunteers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching volunteers',
      error: error.message
    });
  }
};

// Get All Reports
export const getAllReports = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const reports = await Report.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Report.countDocuments();

    res.status(200).json({
      success: true,
      data: reports,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching reports',
      error: error.message
    });
  }
};

// Get All Donations
export const getAllDonations = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const donations = await Donation.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Donation.countDocuments();

    res.status(200).json({
      success: true,
      data: donations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching donations',
      error: error.message
    });
  }
};

// Update Report Status
export const updateReportStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['open', 'in_progress', 'resolved', 'closed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const report = await Report.findByIdAndUpdate(
      id,
      { status, updatedAt: new Date() },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Report status updated',
      data: report
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating report',
      error: error.message
    });
  }
};

// Delete Contact
export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findByIdAndDelete(id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Contact deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting contact',
      error: error.message
    });
  }
};

// Verify Token & Get Current Admin
export const verifyAdmin = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
    const admin = await Admin.findById(decoded.id).select('-password');

    if (!admin || !admin.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or inactive admin'
      });
    }

    res.status(200).json({
      success: true,
      data: admin
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token',
      error: error.message
    });
  }
};

// Logout (optional - token validation happens on frontend)
export const adminLogout = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error during logout',
      error: error.message
    });
  }
};
