const ticketForm = document.getElementById('ticketForm');
const messageElement = document.getElementById('message');
const qrCodeContainer = document.getElementById('qrCodeContainer');

ticketForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    try {
        const tokenResponse = await fetch('/auth/get-token');
        const tokenData = await tokenResponse.json();

        if (!tokenResponse.ok) {
            throw new Error('Failed to fetch access token');
        }

        const response = await fetch('/generate-ticket', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenData.accessToken}`,
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            const result = await response.json();
            messageElement.innerText = '';
            qrCodeContainer.innerHTML = `<img src="${result.qrCode}">`;
        } else {
            const errorData = await response.json();
            messageElement.innerText = errorData.error;
            qrCodeContainer.innerHTML = '';
        }
    } catch (error) {
        messageElement.innerText = 'An error occurred while generating the ticket.';
        console.error('Error:', error);
    }
});
