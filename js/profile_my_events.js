$(document).ready(function() {

  // Load events from localStorage
  function loadEvents() {
    const booked = JSON.parse(localStorage.getItem("bookedEvents") || "[]");
    const favourites = JSON.parse(localStorage.getItem("favouriteEvents") || "[]");

    const bookedContainer = $('#booked-events');
    const favouriteContainer = $('#favourite-events');

    // Clear previous cards
    bookedContainer.find('.event-card').remove();
    favouriteContainer.find('.event-card').remove();

    // Render booked events
    booked.forEach((event, index) => {
      const card = $(`
        <div class="event-card">
          <h3>${event.subject}</h3>
          <p>${event.description || "No description available"}</p>
          <button class="delete-event" data-type="booked" data-index="${index}">Remove</button>
        </div>
      `);
      bookedContainer.append(card);
    });

    // Render favourite events
    favourites.forEach((event, index) => {
      const card = $(`
        <div class="event-card">
          <h3>${event.subject}</h3>
          <p>${event.description || "No description available"}</p>
          <button class="delete-event" data-type="favourite" data-index="${index}">Remove</button>
        </div>
      `);
      favouriteContainer.append(card);
    });

    // Attach delete button click
    $('.delete-event').off('click').on('click', function() {
      const type = $(this).data('type');
      const index = $(this).data('index');

      if (type === "booked") {
        let booked = JSON.parse(localStorage.getItem("bookedEvents") || "[]");
        booked.splice(index, 1); // remove the event at this index
        localStorage.setItem("bookedEvents", JSON.stringify(booked));
      } else if (type === "favourite") {
        let favourites = JSON.parse(localStorage.getItem("favouriteEvents") || "[]");
        favourites.splice(index, 1); // remove the event at this index
        localStorage.setItem("favouriteEvents", JSON.stringify(favourites));
      }

      loadEvents(); // refresh UI
    });
  }

  // Function to add events (called from event_details page)
  window.addEvent = function(event, type) {
    if (!event || !type) return;

    if (type === "booked") {
      let booked = JSON.parse(localStorage.getItem("bookedEvents") || "[]");
      if (!booked.find(e => e.subject === event.subject && e.start === event.start && e.end === event.end)) {
        booked.push(event);
        localStorage.setItem("bookedEvents", JSON.stringify(booked));
      }
    } else if (type === "favourite") {
      let favourites = JSON.parse(localStorage.getItem("favouriteEvents") || "[]");
      if (!favourites.find(e => e.subject === event.subject && e.start === event.start && e.end === event.end)) {
        favourites.push(event);
        localStorage.setItem("favouriteEvents", JSON.stringify(favourites));
      }
    }

    loadEvents();
  }

  // Initial load
  loadEvents();
});
