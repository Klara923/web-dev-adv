document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("venue-form")
    .addEventListener("submit", async (event) => {
      event.preventDefault();
      console.log("Form submitted");

      const vname = document.getElementById("vname").value.trim();
      const vurl = document.getElementById("vurl").value.trim();
      const vdistrict = document.getElementById("vdistrict").value.trim();
      const messageEl = document.getElementById("message");

      if (!vname || !vurl || !vdistrict) {
        messageEl.textContent = "All fields are required!";
        messageEl.style.color = "red";
        return;
      }

      console.log("vname:", vname);
      console.log("vurl:", vurl);
      console.log("vdistrict:", vdistrict);

      try {
        const response = await fetch("/api/venues/new", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ vname, vurl, vdistrict }),
        });
        if (response.ok) {
          messageEl.textContent = "Venue added successfully!";
          messageEl.style.color = "green";
          document.getElementById("venue-form").reset();
          console.log("Venue added successfully");
        }
      } catch (error) {
        console.error("Error adding venue:", error);
      }
    });
});
