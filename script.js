const form = document.querySelector(".brief-form");

if (form) {
  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    alert("submit works");
    const formData = new FormData(form);

    const data = {
      name: formData.get("name"),
      brand: formData.get("brand"),
      email: formData.get("email"),
      service: formData.get("service"),
      budget: formData.get("budget"),
      message: formData.get("message")
    };

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

      if (result.success) {
        alert("Your project brief has been sent successfully.");
        form.reset();
      } else {
        alert("Something went wrong. Please try again.");
        console.error(result);
      }

    } catch (error) {
      console.error(error);
      alert("Connection error. Please try again.");
    }
  });
}
