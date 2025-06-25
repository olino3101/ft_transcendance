import { getCookie } from "./cookie";


export async function sendOtp(username) {
    const csrftoken = getCookie('csrftoken');
    const data = { username: username };

    const response = await fetch('http://localhost:8000/api/send-otp/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify(data),
    });

    const responseData = await response.json();
    
    if (response.status === 200) {
        console.log("OTP sent to your email.");
        document.getElementById('otp-message').innerText = "OTP sent to your email.";
    } else {
        console.error("Erreur lors de l'envoi de l'OTP:", responseData.error);
        document.getElementById('otp-message').innerText = responseData.error || "Une erreur est survenue.";
    }
}

export async function validateOtp(otp, accessToken) {
    const csrftoken = getCookie('csrftoken');
    if (!otp) {
        document.getElementById('otp-message').innerText = 'Please enter the OTP.';
        return;
    }
    // Use passed token or fallback to cookie
    const jwtToken = accessToken || getCookie('access_token');
    const response = await fetch('http://localhost:8000/api/validate-otp/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
            'Authorization': `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({ otp: otp }),
    });
    if (!response.ok) {
        const text = await response.text();
        document.getElementById('otp-message').innerText = text || 'Invalid OTP or expired.';
        console.error('OTP Validation Failed:', text);
        return;
    }
    const responseData = await response.json();
    if (response.status === 200) {
        console.log("OTP validé avec succès");
        document.getElementById('otp-message').innerText = '';
        return true;
    } else {
        console.error("Erreur de validation OTP:", responseData.message);
        document.getElementById('otp-message').innerText = responseData.message || "L'OTP est invalide ou expiré.";
        return false;
    }
}