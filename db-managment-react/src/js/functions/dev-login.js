export async function devLogin() {
    localStorage.clear();

    const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            email: 'react@dev.com',
            password: 'react'
        })
    });

    if (!response.ok) {
        throw new Error('Login failed.');
    }

    const data = await response.json();

    localStorage.setItem("user", "react-dev");
    localStorage.setItem("access_token", data.access_token);
}