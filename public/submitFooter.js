document.addEventListener("DOMContentLoaded", () => {
    const footerForm = document.getElementById("footer-form");

    footerForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = {
            name: "Subscriber",
            email: document.getElementById("footer-email").value,
            message: "None",
            option_selected: document.getElementById("footer-option").value,
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
            alert(data.message || "Subscription successful!");
        } catch (error) {
            console.error("Error:", error.message);
            alert("Failed to subscribe. Please try again.");
        }
    });
});
