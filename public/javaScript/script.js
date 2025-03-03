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
      li.innerHTML = `<strong>${venue.name}</strong> - ${venue.district} - <a href="${venue.url}">${venue.url}</a>`;
      listEl.appendChild(li);
    });
  })
  .catch((error) => console.error("Error fetching venues:", error));
