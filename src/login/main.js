console.log('nested');
import { supabase } from '../api-client.js';

const form = document.getElementById("loginForm");
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const emailInput = document.getElementById("login").value;
    const passwordInput = document.getElementById("password").value;
    const { user, session, error } = await supabase.auth.signInWithPassword({
        email: emailInput,
        password: passwordInput,
    });

    if (error) {
        console.error("Błąd logowania:", error.message);
        const errorMsg = document.createElement("p");
        const errorMsgT = document.createTextNode("Błędne dane logowania");
        errorMsg.className = "text-red-500";
        errorMsg.appendChild(errorMsgT);
        form.prepend(errorMsg);
    } else {
        console.log("Zalogowano:", user);
        window.location.href = "../index.html";
    };


});

