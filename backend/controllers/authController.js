const { supabase } = require('../config/supabase');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');

// Demo mode admin storage (fallback)
const demoAdmins = new Map();
const defaultAdmin = {
  id: '999-demo-admin-001',
  name: 'Demo Admin',
  email: 'admin@demo.com',
  password: 'demo123',
  role: 'admin',
};
demoAdmins.set('admin@demo.com', defaultAdmin);

// @desc    Admin login
// @route   POST /api/auth/login
// @access  Public
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    let admin = null;
    let isMatch = false;

    try {
      // Try Supabase first
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .eq('email', email)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows
        throw error;
      }

      if (data) {
        admin = data;
        // For demo purposes, just compare plain text
        isMatch = admin.password === password;
      }
    } catch (error) {
      console.log('⚠️  Supabase query failed, using demo mode');
      // Fall back to demo mode
      admin = demoAdmins.get(email);
      if (admin) {
        isMatch = admin.password === password;
      }
    }

    if (!admin || !isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Create JWT token
    const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET || 'secret', {
      expiresIn: '30d',
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Register admin
// @route   POST /api/auth/register
// @access  Public
exports.adminRegister = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password',
      });
    }

    // Check demo mode first
    if (demoAdmins.has(email)) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
      });
    }

    let existingAdmin = null;
    let admin = null;

    try {
      // Check if email already exists in Supabase
      const { data: existing, error: checkError } = await supabase
        .from('admins')
        .select('*')
        .eq('email', email)
        .single();

      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'Email already registered',
        });
      }

      // Create new admin in Supabase
      const { data: newAdmin, error: insertError } = await supabase
        .from('admins')
        .insert({
          name,
          email,
          password, // Store plain text for demo (in production, hash this)
          role: role || 'interviewer',
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      admin = newAdmin;
    } catch (dbError) {
      console.log('⚠️  Supabase insert failed, using demo mode');
      
      // Create demo admin
      admin = {
        id: `demo-${Date.now()}`,
        name,
        email,
        password,
        role: role || 'interviewer',
        created_at: new Date().toISOString(),
      };
      
      demoAdmins.set(email, admin);
    }

    // Create JWT token
    const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET || 'secret', {
      expiresIn: '30d',
    });

    res.status(201).json({
      success: true,
      message: 'Admin registered successfully',
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get current logged in admin
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    // Get admin ID from JWT token (set by auth middleware)
    const adminId = req.user.id;

    try {
      // Try Supabase first
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .eq('id', adminId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        return res.status(200).json({
          success: true,
          admin: {
            id: data.id,
            name: data.name,
            email: data.email,
            role: data.role,
          },
        });
      }
    } catch (error) {
      console.log('⚠️  Supabase query failed, using demo mode');
    }

    // Fall back to demo mode
    let admin = null;
    for (let [email, demoAdmin] of demoAdmins.entries()) {
      if (demoAdmin.id === adminId) {
        admin = demoAdmin;
        break;
      }
    }

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found',
      });
    }

    res.status(200).json({
      success: true,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
