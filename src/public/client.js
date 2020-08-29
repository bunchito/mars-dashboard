const server = `http://localhost:3000`

let store = Immutable.Map({
  selectedRover: '',
  data: [],
  manifests: [],
  rovers: ['Curiosity', 'Opportunity', 'Spirit']
});

let updatedStore = store;


// console.log(store);

// add our markup to the page
const root = document.getElementById('root');

const updateStore = async (storeKey, storeKeyValue) => {
  console.log(1, 'To update in state', storeKeyValue);
  console.log(2, 'Previous state', updatedStore.get('selectedRover'));

  // store = Object.assign(store, newState);

  const selectedRover = updatedStore.get('selectedRover');
  const manifests = updatedStore.get('manifests');

  // let data = store.get('data');
  // console.log('data', data);

  // let updatedStore = store

  if (selectedRover != storeKeyValue) {
    console.log('yes');
    data = await getRoverImages(storeKeyValue);
    updatedStore = store.set('data', data.data).set(storeKey, storeKeyValue);
  }

  render(root, updatedStore);
};

const render = async (root, state) => {

  console.log('Render');
  console.log(state);
  const selectedRover = state.get('selectedRover');
  console.log(
    `
    Selected rover ${selectedRover}
    `
  );
  root.innerHTML = App(state);
  addClickListeners();
};

// This also is a side effect
const addClickListeners = () => {
  let buttons = document.querySelectorAll('.button');
  for (const button of buttons) {
    const text = button.innerHTML;
    button.addEventListener(
      'click',
      function () {
        updateStore('selectedRover', text);
      },
      false
    );
  }
};

// create content
const App = state => {
  console.log('App -> state', state.toJS());

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
            <section>
            Aca deberia hacer un render de lo que tengo en data
              <div class="container">
                <div class="row row-cols-3">
                  ${Images(state.get('data'))}
                </div>
              </div>
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
  console.log('Greeting');
  if (rover) {
    return `
            <h1>Welcome to ${rover}!</h1>
        `;
  }

  return `
        <h1>Welcome!</h1>
    `;
};

const Menu = rovers => {
  console.log('Menu');
  let menu = '';
  rovers.map(eachRover => {
    return menu += `<a class="nav-item nav-link button button--${eachRover}">${eachRover}</a>`;
  });
  return menu;
};

const Images = images => {
  console.log('Images');
  console.log(images);
  let imagesGrid = '';
  images.map(({
    img_src,
    camera
  }) => {
    return imagesGrid += `<div class="col">
    <h3>${camera.name}</h3>
      <img src="${img_src}" style="width: 100%"></div>`;
  });
  return imagesGrid;
  // console.log('data', data);
  //data.map(el => console.log(el))
};

const getRoverImages = selectedRover => {
  console.log('getRoverImages -> Fetching');
  return fetch(
    `${server}/rovers/${selectedRover}`
  ).then(res => res.json());
};

const getAllRoversManifests = (roversList) => {
  console.log('getAllRoversManifests -> Fetching')
  return fetch(
    `${server}/rovers/manifests?rovers=${roversList}`
  ).then(res => res.json());
}

async function init(rovers) {
    const data = await getAllRoversManifests(rovers)
    updateStore('manifests', data.data);
    console.log('manifests', data)
}
init(updatedStore.get('rovers'))




// Example of a pure function that renders information requested from the backend
// const ImageOfTheDay = (selectedRover) => {

// Note:
/* I don't need to do the following since I am hitting the latest photos endpoint
https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/latest_photos?api_key=${process.env.API_KEY}
which retrieves the LATEST ones and ONLY photos
*/
// If image does not already exist, or it is not from today -- request it again
// const today = new Date()
// const photodate = new Date(selectedRover.date)
// console.log(photodate.getDate(), today.getDate());

// console.log(photodate.getDate() === today.getDate());
// if (!selectedRover || selectedRover.date === today.getDate() ) {
//     getImageOfTheDay(store)
// }