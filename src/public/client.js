const server = `http://localhost:3000`;

const SWITCH_ROVER = 'SWITCH_ROVER';
const LOAD_MANIFESTS = 'LOAD_MANIFESTS';
const SELECTED_ROVER = 'SELECTED_ROVER';

let store = Immutable.Map({
  selectedRover: '',
  data: [],
  manifests: [],
  rovers: ['Curiosity', 'Opportunity', 'Spirit']
});

// add our markup to the page
const root = document.getElementById('root');

function stateUpdate(state, action) {
  switch (action.type) {
    case LOAD_MANIFESTS: {
      store = state.set('manifests', action.value);
      return;
    }
    case SWITCH_ROVER: {
      store = state.set('data', action.value);
      return;
    }
    case SELECTED_ROVER: {
      store = state.set('selectedRover', action.value);
      return;
    }
    default:
      return state;
  }
}

const render = async (root, state) => {
  root.innerHTML = App(state);
  addClickListeners();
};

const addClickListeners = () => {
  let buttons = document.querySelectorAll('.button');
  for (const button of buttons) {
    const value = button.innerHTML;
    button.addEventListener(
      'click',
      async function() {
        if (store.get('selectedRover') !== value) {
          const { data } = await getRoverImages(value);
          stateUpdate(store, {
            type: SELECTED_ROVER,
            value
          });
          stateUpdate(store, {
            type: SWITCH_ROVER,
            value: data
          });
          render(root, store);
        }
      },
      false
    );
  }
};

const App = state => {
  return `
        <header>
          <nav class="navbar navbar-expand-lg navbar-light">
            <a class="navbar-brand" href="#">MENU</a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
             <div class="navbar-nav">
               ${Menu(state.get('rovers'))}
             </div>
            </div>
          </nav>
        </header>
        <main>
            ${Greeting(state.get('selectedRover'))}
            <section>
              <p>
                ${Info(state.get('selectedRover'))}
              </p>
            </section>
            <section>
              <div class="container">
                <div class="row row-cols-3">
                  ${Images(state.get('data'))}
                </div>
              </div>
            </section>
        </main>
        <footer>Mars Dashboard @ 2020</footer>
    `;
};

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
  render(root, store);
});

// ------------------------------------------------------  COMPONENTS
const Greeting = rover => {
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
  let menu = '';
  rovers.map(eachRover => {
    return (menu += `<a class="nav-item nav-link button button--${eachRover}">${eachRover}</a>`);
  });
  return menu;
};

const Info = rover => {
  if (rover) {
    const { status, launch_date, landing_date, total_photos } = store.get(
      'manifests'
    )[rover];
    return `
      <div>
        <span>Status: ${status}</div>
        <div>Launch date: ${launch_date}</div>
        <div>Landing date: ${landing_date}</div>
        <div>Total photos: ${total_photos}</div>
      </div>
    `;
  }
  return ``
};

const Images = images => {
  let imagesGrid = '';
  images.map(({ img_src, camera, earth_date }) => {
    return (imagesGrid += `<div class="col m-x-0">
       <h3>${camera.name}</h3>
       <div>Date: ${earth_date}</div>
       <img src="${img_src}" style="width: 100%">
    </div>`);
  });
  return imagesGrid;
};

const getRoverImages = selectedRover => {
  return fetch(`${server}/rovers/${selectedRover}`).then(res => res.json());
};

const getAllRoversManifests = roversList => {
  return fetch(`${server}/rovers/manifests?rovers=${roversList}`).then(res =>
    res.json()
  );
};

// I wanted to fetch all the info at once instead of requesting when switching rovers as a different approach as fetching data for rovers
async function init(rovers) {
  const { data } = await getAllRoversManifests(rovers);
  store = store.set('manifests', data);
}
init(store.get('rovers'));
