const socket = io();

//elements
const $messageForm = document.querySelector('#message-form');
const $messageFormInput = document.querySelector('input');
const $messageFormButton = document.querySelector('button');
const $SendLocationButton = document.querySelector('#send-location');
const $messages = document.querySelector('#messages');

// templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML;
// const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

// Options
// const { username , room } = Qs.parse(location.search, { ignoreQueryPrefix : true })

const autoscroll = () => {
  //New message element
  const $newMessage = $messages.lastElementChild

  //height of the new message
  const newMessageStyles = getComputedStyle($newMessage)
  const newMessageMargin = parseInt(newMessageStyles.marginBottom)
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

  //visible Height
  const visibleHeight = $messages.offsetHeight

  //height of message container
  const containerHeight = $messages.scrollHeight

  //scroll 
  const scrollOffset = $messages.scrollTop + visibleHeight;

  //checking a condition for scrolling
  if( containerHeight - newMessageHeight <= scrollOffset) {
    $messages.scrollTop = $messages.scrollHeight
  }
} 

socket.on('message', (message)=> {
  const html = Mustache.render(messageTemplate, {
    message : message.text,
    createdAt : moment(message.createdAt).format('h:mm a')
  })
  $messages.insertAdjacentHTML('beforeend', html);
  autoscroll();
})

socket.on('locationMessage', (message)=> {
  const html = Mustache.render(locationMessageTemplate, {
    url : message.url,
    createdAt : moment(message.createdAt).format('h:mm a')
  });
  $messages.insertAdjacentHTML('beforeend', html)
  autoscroll();
})

$messageForm.addEventListener('submit', (e)=> {
  e.preventDefault();
  $messageFormButton.setAttribute('disabled', 'disabled');
  //disable
  const message = e.target.elements.message.value
  socket.emit('sendMessage', message, (error)=>{
    $messageFormButton.removeAttribute('disabled');
    $messageFormInput.value = '';
    $messageFormInput.focus()
    if(error){
      return console.log(error);
    }
  })
})

$SendLocationButton.addEventListener('click', ()=> {
  if(!navigator.geolocation){
    return alert('Geolocation is not supported by your browser')
  }
  //disable sendLocation button
  $SendLocationButton.setAttribute('disabled', 'disabled')
  navigator.geolocation.getCurrentPosition((position)=> {
    socket.emit('sendLocation', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    }, ()=> {
      $SendLocationButton.removeAttribute('disabled');
      console.log('location shared !')
    })
  })
});