/* CONTACT section*/
function initContact() {
    const isMobile = window.isMobile();

    // Setting up contact form
    const contactForm = document.getElementById("contact-form");
    const sendBtn = document.getElementById("send-btn");
    let isSending = false;
    
    sendBtn.addEventListener("click", (event) => {
        if (event) event.preventDefault();
        if (!contactForm.checkValidity()) {
            contactForm.reportValidity();
            return;
        }
        if (isSending)  return;
        isSending = true;
    
        sendBtn.disabled = true;
        sendBtn.innerText = "SENDING";
    
        emailjs.init("jJxcj0PryYSoWXzXt");
    
        let _name = document.getElementById("name").value;
        let _email = document.getElementById("email").value;
        let _message = document.getElementById("message").value;
    
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (_email === "" || _name === "" || !emailRegex.test(_email)) {
            resetBtn();  
            return;
        }
        if (_message === "") {
            _message = "Please contact me! " + _email + ", " + _name;
        }
    
        let param = {
            name: _name,
            email: _email,
            message: _message
        }
    
        emailjs.send("service_eyvtkxd", "template_dhfp3b6", params).then(
            function (response) {
                console.log("SUCCESS!", response.status, response.text);
                alert("Message sent!");
                resetBtn(); 
            },
            function (error) {
                console.log("FAILED...", error);
                alert("Failed to send message, please try again later");
                resetBtn();
            }
        );
    });
    
    function resetBtn() {
        isSending = false;
        sendBtn.disabled = false;
        sendBtn.innerText = "SEND";
    }
}
