/* ===========================
   CONTACT FORM (VALIDATION + FORMSPREE)
=========================== */

const contactForm = document.getElementById("contactForm");
const formMsg = document.getElementById("formMsg");

if (contactForm) {
  const inputs = contactForm.querySelectorAll("input, textarea");

  // Save original placeholders
  inputs.forEach((input) => {
    input.dataset.originalPlaceholder = input.placeholder;

    input.addEventListener("input", () => {
      input.classList.remove("input-error", "placeholder-error", "shake");

      if (input.dataset.originalPlaceholder) {
        input.placeholder = input.dataset.originalPlaceholder;
      }
    });
  });

  function setError(input, message) {
    input.classList.add("input-error", "placeholder-error", "shake");
    input.value = "";
    input.placeholder = message;

    setTimeout(() => {
      input.classList.remove("shake");
    }, 400);
  }

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    let isValid = true;

    // Required field check
    inputs.forEach((input) => {
      const value = input.value.trim();

      if (!value) {
        isValid = false;

        if (input.name === "name") setError(input, "Name Required");
        else if (input.name === "email") setError(input, "Email Required");
        else if (input.name === "number") setError(input, "Phone Required");
        else if (input.name === "message") setError(input, "Message Required");
        else setError(input, "Required");
      }
    });

    // Email validation
    const emailInput = contactForm.querySelector('input[name="email"]');

    if (emailInput && emailInput.value.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(emailInput.value.trim())) {
        isValid = false;
        setError(emailInput, "Enter Valid Email");
      }
    }

    if (!isValid) {
      formMsg.textContent = "⚠️ Please fill all fields correctly.";
      formMsg.classList.add("error");
      return;
    }

    // Send to Formspree / third-party
    try {
      formMsg.textContent = "⏳ Sending message...";
      formMsg.classList.remove("error", "success");

      const formData = new FormData(contactForm);

      const response = await fetch(contactForm.action, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        formMsg.textContent = "✅ Message sent successfully!";
        formMsg.classList.add("success");
        contactForm.reset();
      } else {
        formMsg.textContent = "❌ Something went wrong. Try again.";
        formMsg.classList.add("error");
      }
    } catch (error) {
      formMsg.textContent = "❌ Network error. Try later.";
      formMsg.classList.add("error");
    }
  });
}