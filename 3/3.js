document.addEventListener('DOMContentLoaded', () => {
  const chat = document.getElementById('echo-chat');
  const form = chat.querySelector('form');
  const input = chat.querySelector('input');
  const geoBtn = chat.querySelector('#btn-geo');
  const innerChat = chat.querySelector('.chat__inner');
  const spinner = document.createElement('div');
  spinner.classList.add('spinner');
  const sendWrap = document.createElement('div');
  sendWrap.classList.add('chat__message', 'chat__message_send');
  const echoWrap = document.createElement('div');
  echoWrap.classList.add('chat__message', 'chat__message_echo');
  let flag = true;
  const socket = new WebSocket("wss://echo-ws-service.herokuapp.com");
  socket.onopen = function (e) {
    console.log('Соединение установлено');
    console.log('Отправляем данные на сервер');
  }

  function sendMessage(e) {
    e.preventDefault();
    let value = input.value;
    flag = true;
    if (value) {
      socket.send(value)
      sendWrap.textContent = value;
      innerChat.append(sendWrap);
      innerChat.innerHTML += '';
      input.value = '';
    } else {
      alert('Введите сообщение!')
    }
  }

  socket.onmessage = function (e) {
    if (flag) {
      console.log(`Данные получены с сервера: ${e.data}`)
      echoWrap.textContent = e.data;
      innerChat.append(echoWrap);
    }
  }

  const success = (position) => {
    flag = false;
    const { coords } = position;
    value = `<a href='https://www.openstreetmap.org/#map=17/${coords.latitude}/${coords.longitude}'>Гео-позиция</a>`;
    sendWrap.innerHTML = value;
    spinner.remove();
    innerChat.append(sendWrap);
    innerChat.innerHTML += '';
    socket.send(value);
  }

  const error = () => {
    let error = "Позиция не может быть определена"
    addMessage(error);
  }

  form.addEventListener('submit', sendMessage);
  geoBtn.addEventListener('click', () => {
    if (!navigator.geolocation) {
      console.log("Геолокация не доступна")
    } else {
      innerChat.append(spinner);
      navigator.geolocation.getCurrentPosition(success, error);
    };
  });
})