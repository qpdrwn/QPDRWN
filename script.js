const form = document.querySelector(".brief-form");

if (form) {
  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData(form);

    try {
      const response = await fetch(
        "https://qpdrwn-telegram.ghm-ce7.workers.dev/",
        {
          method: "POST",
          body: formData
        }
      );

      const result = await response.json();

      console.log("Server response:", result);

      if (result.success) {
        alert("Your project brief has been sent successfully.");
        form.reset();
      } else {
        alert(
          result.error ||
          "Something went wrong."
        );
      }

    } catch (error) {
      console.error("Error:", error);
      alert("Connection error. Please try again.");
    }
  });
}
