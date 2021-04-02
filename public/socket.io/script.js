let socket = io('http://localhost:3000');

let form = document.getElementById('form');
let input = document.getElementById('input');
let message_container = document.getElementById('messages');
let buttonOpenOnlineUserModal = document.getElementById('openUserOnlineModal');

let name = prompt('Your name?');
appendMessage('You joined chat room');
socket.emit('new-user-connected', name);

socket.on('new-user-connected', (name) => {
    appendMessage(`${name} joined chat room`)
})

socket.on('user-disconnect', (name) => {
    appendMessage(`${name} outed chat room`)
})

socket.on('get-user-online', (data) => {
    $('#user-online-container').empty();
    let i = 1;
    Object.keys(data.users).forEach(index => {
        let userOnlineItem = document.createElement('p');
        if (index === data.user_id) {
            userOnlineItem.textContent = `${i}. ${data.users[index].name} (You)`;
        }
        else {
            userOnlineItem.textContent = `${i}. ${data.users[index].name}`;
        }
        $('#user-online-container').append(userOnlineItem);
        i++;
    })
})

socket.on('send-message', (data) => {
    appendMessage(`${data.name}: ${data.msg}`)
})

socket.on('user-on-typing', (name) => {
    $('#typing').css('display', 'inline');
    $('#typing').text(`${name} is typing ...`);
})

socket.on('user-not-typing', () => {
    $('#typing').css('display', 'none');
})

form.addEventListener('submit', (e) => {
    e.preventDefault();
    appendMessage('You: ' + input.value);
    socket.emit('send-message', input.value);
    input.value = '';
})

buttonOpenOnlineUserModal.addEventListener('click', (e) => {
    socket.emit('get-user-online');
    $('#userOnlineModal').modal('show');
})

input.addEventListener('input', (e) => {
    if (input.value === '') {
        socket.emit('user-not-typing');
    }
    else {
        socket.emit('user-on-typing');
    }
})

input.addEventListener('blur', (e) => {
    socket.emit('user-not-typing');
})

function appendMessage(msg) {
    let message_item = document.createElement('li');
    message_item.textContent = msg;
    message_container.appendChild(message_item);
}