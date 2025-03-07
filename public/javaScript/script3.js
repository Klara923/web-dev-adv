document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const venueId = urlParams.get("id");
  console.log(venueId);

  try {
    const response = await fetch(`/api/venues/${venueId}`);
    const venue = await response.json();

    document.getElementById("venue-id").value = venue.id;
    document.getElementById("vname").value = venue.name;
    document.getElementById("vurl").value = venue.url;
    document.getElementById("vdistrict").value = venue.district;
  } catch (err) {
    console.error("Error loading venue:", err);
  }
});

document
  .getElementById("edit-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const id = document.getElementById("venue-id").value;
    const name = document.getElementById("vname").value.trim();
    const url = document.getElementById("vurl").value.trim();
    const district = document.getElementById("vdistrict").value.trim();

    try {
      const response = await fetch(`/api/venues/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, url, district }),
      });

      if (response.ok) {
        alert("Venue updated successfully!");
        window.location.href = "/discover";
      }
    } catch (error) {
      console.error("Error updating venue:", error);
    }
  });
