fetch("/api/venues")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((venues) => {
    const listEl = document.getElementById("venues-list");
    venues.forEach((venue) => {
      const li = document.createElement("li");
      li.classList.add("venue-content");
      const button = document.createElement("button");
      button.classList.add("remove-venue");
      li.innerHTML = `<div class="venue-text" ><strong>${venue.name}</strong> - ${venue.district} - <a href="${venue.url}">${venue.url}</a></div>`;
      button.textContent = "X";
      button.addEventListener("click", async () => {
        try {
          const response = await fetch(`/api/venues/${venue.id}`, {
            method: "DELETE",
          });

          if (!response.ok) {
            throw new Error("Failed to delete venue");
          }

          li.remove();
        } catch (error) {
          console.error("Error deleting venue:", error);
        }
      });
      listEl.appendChild(li);
      li.appendChild(button);
    });
  })
  .catch((error) => console.error("Error fetching venues:", error));
