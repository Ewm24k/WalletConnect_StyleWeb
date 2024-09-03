// Initialize EmailJS with your public key
emailjs.init('Replace-Public-Key-Emailjs');  // Replace with your actual EmailJS public key

// Function to send email notification
function sendEmail(walletAddress) {
    const userMessage = `Hello sir, this wallet ${walletAddress} was successfully connected to your site.`;

    return emailjs.send('Replace-Service_ID', 'Replace-Template-ID', {  // Replace with your actual Service ID and Template ID
        userEmail: 'tengkufiboking@gmail.com',  // Replace with the recipient's email address
        message: userMessage
    }).then(function(response) {
        console.log('Email sent successfully:', response.status, response.text);
        return response;
    }).catch(function(error) {
        console.error('Failed to send email:', error);
        throw error;
    });
}

// Handle form submission (if there's a form)
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const userEmail = document.getElementById('userEmail').value;
            const userMessage = document.getElementById('userMessage').value;

            emailjs.send('Replace-Service_ID', 'Replace-Template-ID', {  // Replace with your actual Service ID and Template ID
                userEmail: userEmail,
                message: userMessage
            }).then(function(response) {
                console.log('Email sent successfully:', response.status, response.text);
                alert('Your email has been sent successfully!');
            }).catch(function(error) {
                console.error('Failed to send email:', error);

                // Enhanced error handling
                if (error.text) {
                    alert(`Failed to send email. Error: ${error.text}. Please try again.`);
                } else if (error.response && error.response.status === 401) {
                    alert('Failed to send email. Unauthorized access, please check your EmailJS API key.');
                } else if (error.response && error.response.status === 400) {
                    alert('Failed to send email. Bad request, please verify your email template and data.');
                } else if (error.response && error.response.status >= 500) {
                    alert('Failed to send email. Server error, please try again later.');
                } else {
                    alert('Failed to send email. An unknown error occurred, please try again.');
                }
            });
        });
    }
});
