import User from "../model/user.model.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
 
 
 
export const Signup = async (req, res, next) => {
    try {
        console.log("Signup request received:", req.body);  // Log incoming request data

        const { name, telephone, email, password, role } = req.body;

        // Check if all required fields are provided
        if (!name || !telephone || !email || !password) {
            console.error("Signup failed: Missing required fields");
            return res.status(400).json({ message: "All fields are required" });
        }

        console.log("Checking if user already exists...");
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.warn("Signup failed: User already exists");
            return res.status(400).json({ message: "User already exists" });
        }

        console.log("Generating salt for password hashing...");
        const salt = await bcrypt.genSalt(10);

        console.log("Hashing password...");
        const hashedPassword = await bcrypt.hash(password, salt);
        console.log("Password hashed successfully");

        console.log("Creating new user...");
        const newUser = await User.create({
            name,
            telephone,
            email,
            password: hashedPassword,
            role: role || 'user'  // Default role to 'user' if not provided
        });

        console.log("User created successfully:", newUser);

        console.log("Generating JWT token...");
        const token = jwt.sign(
            { id: newUser._id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        console.log("Signup successful. Responding with token and user data...");
        res.status(201).json({
            success: true,
            message: `${name} created successfully`,
            data: { token, user: newUser }
        });

    } catch (error) {
        console.error("Error during Signup:", error.message);
        next(error);
    }
};

export const Login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            
            return res.status(404).json({ message: 'User not found' });
        }
 
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
        

        res.status(200).json({ success: true, message: `Welcome back ${user.name}`, data: { token, user } });
    } catch (error) {
        
        next(error);
    }
}
export const Logout = async (req, res, next) => {
 
        try {
           
            return res.status(200).json({ success: true, message: 'Logged out successfully' });
        } catch (error) {
            next(error);
        }
    };
