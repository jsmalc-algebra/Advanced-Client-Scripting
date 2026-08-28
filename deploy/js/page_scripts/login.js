async function login(email, password) {
    const response = await fetch("http://localhost:3000/auth/login", {
       method: "POST",
       headers: {
           "Content-Type": "application/json"
       },

        body: JSON.stringify({
           email: email,
           password: password
       })
    });

    if (!response.ok) {
        throw new Error('Login failed.');
    }

    const data = await response.json();

    return data.access_token;
}

async function setUserLocally(token, email) {
    const response = await fetch(`http://localhost:3000/User?email=${email}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    const data = await response.json();
    const user_data = data.pop();

    localStorage.setItem("user", user_data.name);
    localStorage.setItem("access_token", token);
}

async function userLogin() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const token = await login(email, password);
    await setUserLocally(token, email);
    window.location.href = "customers.html";
}

document.querySelector("#loginForm").addEventListener("submit",  event => {
    event.preventDefault();
    userLogin()
        .catch(error => {
            if (error.message === 'Login failed.') {
                alert("Login failed. Please try again.");
            }
            else {console.error(error);}
        });
})