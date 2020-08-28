let store = Immutable.Map({
  selectedRover: '',
  data: [],
  rovers: ['Curiosity', 'Opportunity', 'Spirit']
});

console.log(store);

// add our markup to the page
const root = document.getElementById('root');

const updateStore = (store, storeKey, storeKeyValue, previousStoreKeyValue) => {
  console.log(previousStoreKeyValue, storeKeyValue);
  console.log('selectedRover', store.get('selectedRover'));
  // store = Object.assign(store, newState);
  if (previousStoreKeyValue !== storeKeyValue) {
    console.log('yes');
    getRoverImages(storeKeyValue);
  }
  const updatedStore = store.set(storeKey, storeKeyValue);
  render(root, updatedStore);
};

const render = async (root, state) => {
  const lastCalledRover = state.get('selectedRover');
  root.innerHTML = App(state);
  console.log('render');
  addClickListeners(lastCalledRover);
};

// This also is a side effect
const addClickListeners = lastCalledRover => {
  let buttons = document.querySelectorAll('.button');
  for (const button of buttons) {
    const text = button.innerHTML;
    button.addEventListener(
      'click',
      function() {
        updateStore(store, 'selectedRover', text, lastCalledRover);
      },
      false
    );
  }
};

// create content
const App = state => {
  // let {
  //   user,
  //   selectedRover,
  //   rovers
  // } = state;

  // console.log(state.get('selectedRover'))

  return `
        <header></header>
        <main>
            ${Greeting(state.get('selectedRover'))}
            <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <a class="navbar-brand" href="#">Navbar</a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
              <div class="navbar-nav">
              ${Menu(state.get('rovers'))}
              </div>
            </div>
          </nav>
            <section>
                <h3>Put things on the page!</h3>
                <p>Here is an example section.</p>
                <p>
                    One of the most popular websites at NASA is the Astronomy Picture of the Day. In fact, this website is one of
                    the most popular websites across all federal agencies. It has the popular appeal of a Justin Bieber video.
                    This endpoint structures the selectedRover imagery and associated metadata so that it can be repurposed for other
                    applications. In addition, if the concept_tags parameter is set to True, then keywords derived from the image
                    explanation are returned. These keywords could be used as auto-generated hashtags for twitter or instagram feeds;
                    but generally help with discoverability of relevant imagery.
                </p>
            </section>
        </main>
        <footer></footer>
    `;
};

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
  render(root, store);
});

// ------------------------------------------------------  COMPONENTS

// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
const Greeting = rover => {
  if (rover) {
    return `
            <h1>Welcome, ${rover}!</h1>
        `;
  }

  return `
        <h1>Hello!</h1>
    `;
};

const Menu = rovers => {
  console.log(rovers);
  let menu = '';
  rovers.map(eachRover => {
    return (menu += `<a class="nav-item nav-link button button--${eachRover}">${eachRover}</a>`);
  });
  return menu;
};

// const Rover = selectedRover => {
//   getImageOfTheDay(store);
//   return selectedRover;
// };

// Example of a pure function that renders infomation requested from the backend
// const ImageOfTheDay = (selectedRover) => {

//     // If image does not already exist, or it is not from today -- request it again
//     const today = new Date()
//     const photodate = new Date(selectedRover.date)
//     console.log(photodate.getDate(), today.getDate());

//     console.log(photodate.getDate() === today.getDate());
//     if (!selectedRover || selectedRover.date === today.getDate() ) {
//         getImageOfTheDay(store)
//     }

//     // check if the photo of the day is actually type video!
//     if (selectedRover.media_type === "video") {
//         return (`
//             <p>See today's featured video <a href="${selectedRover.url}">here</a></p>
//             <p>${selectedRover.title}</p>
//             <p>${selectedRover.explanation}</p>
//         `)
//     } else {
//         return (`
//             <img src="${selectedRover.image.url}" height="350px" width="100%" />
//             <p>${selectedRover.image.explanation}</p>
//         `)
//     }
// }

// ------------------------------------------------------  API CALLS

// Example API call
const getRoverImages = selectedRover => {
  //let { selectedRover } = state;

  //fetch(`http://localhost:3000/selectedRover`)
  fetch(`http://localhost:3000/rovers?rover=${selectedRover}`)
    .then(res => res.json())
    .then(data => console.log('data', data));
  //.then(selectedRover => updateStore(store, { selectedRover }))
};
