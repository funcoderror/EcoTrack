import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sql from "../database/db.js";

export const signup = async (req, res) => {
    const { name, firstName, lastName, email, password } = req.body;

    // Support both formats: name OR firstName+lastName
    const first = firstName || name || '';
    const last = lastName || name || '';

    if ((!first && !last) || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email?.trim())) {
        return res.status(400).json({ error: "Invalid email format" });
    }

    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({
            error:
                "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character"
        });
    }

    try {
        const existingUser =
            await sql`SELECT id FROM users WHERE email = ${email}`;
        if (existingUser.length > 0) {
            return res.status(400).json({ message: "User already exists" });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const otp = Math.floor(100000 + Math.random() * 900000);

        const otpString = otp.toString();

        const [newUser] =
            await sql`INSERT INTO users (first_name, last_name, email, password) 
                      VALUES (${first}, ${last}, ${email}, ${hashedPassword})
                      RETURNING id, first_name, last_name, email`;

        const token = jwt.sign(
            {
                userId: newUser.id,
                name: `${newUser.first_name} ${newUser.last_name}`,
                email: newUser.email,
            },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: "7d",
            }
        );

        res.cookie("token", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: process.env.NODE_ENV === 'production' ? "none" : "lax",
            secure: process.env.NODE_ENV === 'production',
            path: "/",
        });

        res.status(201).json({
            message: "User created successfully",
            user: {
                id: newUser.id,
                name: `${newUser.first_name} ${newUser.last_name}`,
                email: newUser.email
            },
            token
        });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email?.trim() || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
        return res.status(400).json({ error: "Invalid email format" });
    }

    try {
        const [user] =
            await sql`SELECT id, first_name, last_name, email, password FROM users WHERE email = ${email}`;

        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, {
            expiresIn: "7d",
        });

        res.cookie("token", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true, 
            sameSite: process.env.NODE_ENV === 'production' ? "none" : "lax",
            secure: process.env.NODE_ENV === 'production',
            path: "/",
        });

        const userResponse = {
            id: user.id,
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
        };

        res.status(200).json({
            message: "Login successful",
            user: userResponse,
            token,
        });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            sameSite: process.env.NODE_ENV === 'production' ? "none" : "lax",
            secure: process.env.NODE_ENV === 'production',
            path: "/",
        });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Error during logout:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};