document.addEventListener("DOMContentLoaded", function () {
  fetch("/api/venues")
    .then((response) => response.json())
    .then((venues) => {
      const listEl = document.getElementById("venues-list");

      // Create a mapping of letter-based divs
      const alphabetDivs = {};

      venues.forEach((venue) => {
        const firstLetter = venue.name[0].toUpperCase();

        // Check if the div for this letter already exists
        if (!alphabetDivs[firstLetter]) {
          // Create a new div for this letter
          const letterDiv = document.createElement("div");
          letterDiv.id = `letter-${firstLetter}`;
          letterDiv.classList.add("venue-group");
          letterDiv.innerHTML = `<div class="letter-container"><p class="first-letter">${firstLetter}</p> <div class="line"></div></div>`;
          listEl.appendChild(letterDiv);

          // Store the div in the mapping for future use
          alphabetDivs[firstLetter] = letterDiv;
        }

        // Create the venue list item
        const li = document.createElement("div");
        const buttonContainer = document.createElement("div");
        const button = document.createElement("button");
        const editbutton = document.createElement("button");

        li.classList.add("venue-content");
        buttonContainer.classList.add("button-container");
        button.classList.add("remove-venue");
        editbutton.classList.add("edit-venue");

        li.innerHTML = `<a class="venue-link" target="_blank" href="https://${venue.url}"><div class="venue-text"> <div><p><strong>${venue.name} </strong> - ${venue.district}</p><p></p>Go to website</div> <div class="arrow"></div></div></a>`;
        button.textContent = "X";
        editbutton.innerHTML = `<a href="/edit-venue?id=${venue.id}">Edit</a>`;

        // Append the venue to the appropriate letter div
        alphabetDivs[firstLetter].appendChild(li);
        li.appendChild(buttonContainer);
        buttonContainer.appendChild(button);
        buttonContainer.appendChild(editbutton);

        button.addEventListener("click", async () => {
          try {
            await fetch(`/api/venues/${venue.id}`, { method: "DELETE" });
            li.remove();
          } catch (error) {
            console.error("Error deleting venue:", error);
          }
        });
      });
    })
    .catch((error) => console.error("Error fetching venues:", error));
});
