import { eventsService } from '../service/events-services.js';
import editEventsServices from '../service/editEvents-services.js';
import { error } from '../js/error.js';

const id = localStorage.getItem('editId');
let prevName = 0;
let prevBanner = 0;
let prevAttraction = 0;
let prevDescription = 0;
let prevDate = 0;
let prevTicket = 0;
let control = 0;

async function listEvent() {
  const butSubmit = document.querySelector('[data-editform] button');
  butSubmit.setAttribute('disabled', '');
  try {
    return await eventsService.eventsList();
  } catch {
    const erroredit = document.querySelector('[data-editerror]');
    error.showError('ops, ocorreu um erro, tente mais tarde', erroredit);
    erroredit.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  } finally {
    butSubmit.removeAttribute('disabled');
    const loader = document.querySelector('[data-loaderedit]');
    loader.style.display = 'none';
  }
}
listEvent().then((events) => {
  const form = document.querySelector('[data-editform]');

  events.forEach((evt) => {
    if (evt._id == id) {
      prevName = evt.name;
      form.elements[0].setAttribute('placeholder', prevName);
      prevBanner = evt.poster;
      form.elements[1].setAttribute('placeholder', prevBanner);
      prevAttraction = evt.attractions;
      form.elements[2].setAttribute('placeholder', prevAttraction);
      prevDescription = evt.description;
      form.elements[3].setAttribute('placeholder', prevDescription);
      prevDate = evt.scheduled;
      const newPrevDate = prevDate;
      const newInitialDate = newPrevDate.slice(0, 16);
      form.elements[4].value = newInitialDate;

      prevTicket = evt.number_tickets;
      form.elements[5].setAttribute('placeholder', prevTicket);
      control = 1;
    }
  });

  if (control == 0) {
    const erroredit = document.querySelector('[data-editerror]');
    error.showError(
      'evento não encontrado, verifique se este evento ainda existe',
      erroredit,
    );
  }

  function handleSubmit(event) {
    event.preventDefault();
    const formElements = this.elements;
    const editError = document.querySelector('[data-editerror]');
    editError.style.display = 'none';

    let valueName = formElements[0].value;
    valueName = valueName ? valueName : prevName;

    let valueBanner = formElements[1].value;
    valueBanner = valueBanner ? valueBanner : prevBanner;

    let valueAttraction = formElements[2].value;
    valueAttraction = valueAttraction
      ? valueAttraction.split(',').map((atraction) => atraction.trim())
      : prevAttraction;
    let valueDescription = formElements[3].value;
    valueDescription = valueDescription ? valueDescription : prevDescription;

    let valueDate = formElements[4].value;
    if (valueDate) {
      valueDate = valueDate + ':00.000Z';
    } else {
      valueDate = prevDate;
    }

    let valueTicket = formElements[5].value;
    valueTicket = valueTicket ? valueTicket : prevTicket;

    const bodyEdit = JSON.stringify({
      name: valueName,
      poster: valueBanner,
      attractions: valueAttraction,
      description: valueDescription,
      scheduled: valueDate,
      number_tickets: valueTicket,
    });

    const options = {
      method: 'PUT',
      body: bodyEdit,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    };

    editEventsServices(id, options);
  }

  form.addEventListener('submit', handleSubmit);
});
