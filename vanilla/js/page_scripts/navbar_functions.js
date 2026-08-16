const logoutButton = document.getElementById("logout-btn");

function adjustNavbar() {
    const navbarUser = document.getElementById('user-display')

    if (localStorage.getItem("user")) {
        navbarUser.innerHTML = `<a href="#" class="nav-link">User: ${localStorage.getItem("user")}</a>`
    } else {navbarUser.innerHTML = `User: anonymous`}
}

function logOut() {
    localStorage.clear();
    window.location.href = "login.html";
}

logoutButton.addEventListener("click", event => {
    logOut();
})

adjustNavbar()