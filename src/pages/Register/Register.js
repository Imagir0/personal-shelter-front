import React, { useState } from 'react';

const Register = ({ onRegisterSuccess }) => {
    const [form, setForm] = useState({ username: '', email: '', password: '' });
    const [isRegistered, setIsRegistered] = useState(false); // Pour contrôler l'affichage du formulaire

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            if (response.ok) {
                console.log("Registration successful");
                setIsRegistered(true); // Cacher le formulaire et afficher le message de succès
                onRegisterSuccess(); // Appeler la fonction parent pour afficher le message de succès
            } else {
                const data = await response.json();
                console.error("Registration failed:", data);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    if (isRegistered) {
        return null; // Ne plus afficher le formulaire après l'inscription réussie
    }

    return (
        <form onSubmit={handleRegister}>
            <input
                type="text"
                placeholder="Username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
            <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <button type="submit">Register</button>
        </form>
    );
};

export default Register;
