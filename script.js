const form = document.querySelector(".brief-form");

if (form) {
  form.addEventListener("submit", async function (event) {
    event.preventDefault();

   
    const formData = new FormData(form);

    // Disable button while sending
    button.disabled = true;
    button.textContent = "Sending...";

    try {
      const response = await fetch(
        "https://qpdrwn-telegram.ghm-ce7.workers.dev/",
        {
          method: "POST",
          body: formData
        }
      );

      const result = await response.json();

      if (result.success) {
        alert("Your project brief has been sent successfully.");
        form.reset();
      } else {
        alert(
          result.error ||
          "Something went wrong. Please try again."
        );

        console.error(result);
      }

    } catch (error) {

      console.error(error);

      alert(
        "Connection error. Please try again."
      );

    } finally {

      button.disabled = false;
      button.textContent = "Send Brief →";

    }
  });
}
