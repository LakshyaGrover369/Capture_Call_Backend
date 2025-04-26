const User = require('../models/User');

// Create admin
const createAdmin = async (req, res) => {
    try {
        const { name, email, phoneNumber, password, BatchNumber } = req.body;

        // Check if admin exists
        const adminExists = await User.findOne({ email });
        if (adminExists) {
            return res.status(400).json({ message: 'Admin already exists with this email' });
        }

        // Create admin user
        const admin = await User.create({
            name,
            email,
            phoneNumber,
            password,
            BatchNumber,
            role: 'admin' // Set role as admin
        });

        res.status(201).json({
            success: true,
            data: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                phoneNumber: admin.phoneNumber,
                BatchNumber: admin.BatchNumber,
                role: admin.role
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all admins
const getAllAdmins = async (req, res) => {
    try {
        const admins = await User.find({ role: 'admin' })
            .select('-password')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: admins
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete admin
const deleteAdmin = async (req, res) => {
    try {
        const admin = await User.findByIdAndDelete(req.params.id);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        if (admin.role !== 'admin') {
            return res.status(400).json({ message: 'User is not an admin' });
        }

        res.status(200).json({
            success: true,
            message: 'Admin removed successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createAdmin,
    getAllAdmins,
    deleteAdmin
}; 