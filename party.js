//cohort
const COHORT = "2403-ftb-wt-web-pt";
//API URL
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;

//State holds the data for the events object
const state = {
  events: [],
};

//Function that fetches all of the parties
const fetchAllEvents = async () => {
  try {
    const response = await fetch(API_URL);
    const data = response.json();
    state.events = data.data;
    renderAllEvents();
  } catch (error) {
    console.log(error);
  }
};

//Function that creates a POST request for a new party
const createNewEvent = async (name, imageURL, description, date) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        imageURL: imageURL,
        description: description,
        date: new Date(date).toISOString(),
      }),
    });
    const data = await response.json();
    fetchAllEvents();
  } catch (error) {
    console.log(error);
  }
};

//Function that makes a DELETE request and removes the designated event
const removeEvent = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    fetchAllEvents();
  } catch (error) {
    console.log(error);
  }
};

//Render all of the events on the webpage
const renderAllEvents = () => {
  const eventsConstainer = document.getElementById("events-container");
  const eventList = state.events;

  if (!eventList || eventList.length === 0) {
    eventsConstainer.innerHTML = "<h3>No events found</h3>";
    return;
  }

  //Resets the HTML of all the events
  eventsConstainer.innerHTML = "";

  //Creates a new card for each (that's a hint for the array method) event
  eventList.forEach((event) => {
    const eventElement = document.createElement("div");
    eventElement.classList.add("recipe-card");
    eventElement.innerHTML = `
        <h4>${event.name}</h4>
        <img src="${event.imageUrl}" alt="${event.name}">
        <p>${event.desscription}</p>
        <button class="delete-button" data-id="${event.id}">Remove</button>
        `;
    eventsConstainer.appendChild(eventElement);

    const deleteButton = eventElement.querySSelector(".delete-button");
    //Add an event listener to the new Delete button so it can delete the intended event
    deleteButton.addEventListener("click", (event) => {
      try {
        event.preventDefault();
        removeEvent(event.id);
      } catch (error) {
        console.log(error);
      }
    });
  });
};

//Adds a listener to the form so it creates a new event when ssubmitted
const addListenerToForm = () => {
  const form = document.querySelector("#new-event-form");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    await createNewEvent(
      form.name.value,
      form.imageUrl.value,
      form.description.value,
      form.date.value
    );

    //Clears the form after a new event is created
    form.name.value = "";
    form.imageUrl.value = "";
    form.description.value = "";
    form.date.value = "";
  });
};

//Initialize function for when the page loads
const init = async () => {
  //Grabs all the events from the API
  await fetchAllEvents();
  //Adds the listener to the form so an event is added when the form is submitted
  addListenerToForm();
};

init();
