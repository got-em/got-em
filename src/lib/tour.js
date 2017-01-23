import Shepherd from 'tether-shepherd';
import css from 'tether-shepherd/dist/css/shepherd-theme-arrows.css';
import jump from 'jump.js';

let tour = new Shepherd.Tour({
  defaults: {
    classes: 'shepherd-theme-arrows',
    showCancelLink: true,
    scrollTo: true,
    scrollToHandler: (el) => {
      jump(el, {duration: 400, offset: -200});
    }
  }
});

// default buttons need a handle on the tour instance
tour.options.defaults.buttons = [
  {text: 'Back', action: tour.back},
  {text: 'Next', action: tour.next}
]

tour.addStep('welcome', {
  title: 'Welcome!',
  text: 'Got\'Em is a social soundboard. Triggering sounds notifies listeners in the room.',
  attachTo: '.page-header bottom',
  buttons: [
    {text: 'Next', action: tour.next}
  ]
});

tour.addStep('welcome', {
  title: 'Share',
  text: 'Copy and pasta this link with folks',
  attachTo: '#share bottom'
});

tour.addStep('example', {
  title: 'Sounds',
  text: 'Try clicking on a sound!',
  attachTo: '[data-sound="goat"] top'
});

tour.addStep('filter', {
  title: 'Filtering',
  text: 'You can filter sounds by name',
  attachTo: '#filter bottom'
});

tour.addStep('voice', {
  title: 'Voice',
  text: 'and send text-to-speech messages!',
  attachTo: '#voice top',
  buttons: [
    {text: 'Back', action: tour.back},
    {text: 'Done', action: tour.next}
  ]
});

tour.on('cancel', complete);
tour.on('complete', complete);

function complete() {
  if (storageAvailable('localStorage') && !localStorage.getItem('toured')) {
    localStorage.setItem('toured', true);
  }
}

function storageAvailable(type) {
  try {
    var storage = window[type],
    x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch(e) {
    return false;
  }
}

// start will tour first time users
export function start() {
  if (storageAvailable('localStorage') && localStorage.getItem('toured')) {
    return;
  }

  tour.start();
}

// replay will rerun the tour
export function replay() {
  if (storageAvailable('localStorage')) {
    localStorage.removeItem('toured');
  }

  if (Shepherd.activeTour) {
    tour.show('welcome');
  } else {
    start();
  }
}
