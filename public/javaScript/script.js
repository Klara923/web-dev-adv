document.addEventListener("DOMContentLoaded", function () {
  fetch("/api/venues")
    .then((response) => response.json())
    .then((venues) => {
      const listEl = document.getElementById("venues-list");

      const alphabetDivs = {};

      venues.forEach((venue) => {
        const firstLetter = venue.name[0].toUpperCase();

        if (!alphabetDivs[firstLetter]) {
          const letterDiv = document.createElement("div");
          letterDiv.id = `letter-${firstLetter}`;
          letterDiv.classList.add("venue-group");
          letterDiv.innerHTML = `<div class="letter-container"><p class="first-letter">${firstLetter}</p> <div class="line"></div></div>`;
          listEl.appendChild(letterDiv);

          alphabetDivs[firstLetter] = letterDiv;
        }

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

        alphabetDivs[firstLetter].appendChild(li);
        li.appendChild(buttonContainer);
        buttonContainer.appendChild(button);
        buttonContainer.appendChild(editbutton);

        button.addEventListener("click", async () => {
          try {
            const response = await fetch(`/api/venues/${venue.id}`, {
              method: "DELETE",
              credentials: "same-origin",
            });

            if (response.status === 200) {
              li.remove();
            } else if (response.status === 401) {
              window.location.href = "/login";
            } else if (response.status === 403) {
              alert(
                "Only admin users can delete venues. Please log in as an admin."
              );
              window.location.href = "/login";
            } else {
              const errorData = await response.json();
              alert(`Error: ${errorData.error || "Failed to delete venue"}`);
            }
          } catch (error) {
            console.error("Error deleting venue:", error);
            alert("Failed to delete venue. Please try again later.");
          }
        });
      });
    })
    .catch((error) => console.error("Error fetching venues:", error));
});
