document.addEventListener("DOMContentLoaded", () => {
    const contactForm = document.getElementById("contact-form");

    contactForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            message: document.getElementById("message").value,
            option_selected: document.querySelector('input[name="option_selected"]:checked').value,
        };

        try {
            const response = await fetch("/api/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error("Failed to submit data");
            }

            const data = await response.json();
            alert(data.message || "Your message has been sent successfully!");
        } catch (error) {
            console.error("Error:", error.message);
            alert("Failed to submit the form. Please try again.");
        }
    });
});
