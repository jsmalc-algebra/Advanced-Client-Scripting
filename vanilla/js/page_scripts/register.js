async function register(name, email, password) {
    const response = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: name,
            email: email,
            password: password,
        })
    });

    if (!response.ok) {
        throw new Error('Registration failed.');
    }
}

async function userRegister() {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    await register(name, email, password);
    window.location.href = "login.html";
}

document.querySelector("#registerForm").addEventListener("submit", event => {
    event.preventDefault();
    userRegister()
        .catch(error => {
            if (error.message === 'Registration failed.') {
                alert("Registration failed. Please try again.");
            }
            else {console.error(error);}
        });
});