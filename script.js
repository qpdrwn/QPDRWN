const form = document.querySelector(".brief-form");

if (form) {
  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const button = form.querySelector("button[type='submit']");

    const formData = new FormData(form);

    const data = {
      name: formData.get("name"),
      brand: formData.get("brand"),
      email: formData.get("email"),
      service: formData.get("service"),
      budget: formData.get("budget"),
      message: formData.get("message")
    };

    // Remove old messages
    const oldMessage = form.querySelector(".form-status");

    if (oldMessage) {
      oldMessage.remove();
    }

    // Disable button while sending
    button.disabled = true;
    button.textContent = "Sending...";

    try {
      const response = await fetch(
        "https://qpdrwn-telegram.ghm-ce7.workers.dev/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        }
      );

      const result = await response.json();

      const status = document.createElement("div");
      status.className = "form-status";

      if (result.success) {
        status.textContent =
          "Your project brief has been sent successfully.";

        status.classList.add("success");

        form.reset();

      } else {
        status.textContent =
          "Something went wrong. Please try again.";

        status.classList.add("error");

        console.error(result);
      }

      form.appendChild(status);

    } catch (error) {

      console.error(error);

      const status = document.createElement("div");

      status.className = "form-status error";

      status.textContent =
        "Connection error. Please try again.";

      form.appendChild(status);

    } finally {

      button.disabled = false;
      button.textContent = "Send Brief →";

    }
  });
}
