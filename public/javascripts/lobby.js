var socket = io();
socket.emit('getRooms');
socket.on('roomList', function(roomList) {
  var lobby = document.getElementById('lobby');
  var list = document.createElement('ul');
  list.classList.add('list-group');

  //remove the list prior to re-rendering
  if(lobby.firstChild) lobby.removeChild(lobby.firstChild);

  //check for active rooms
  if(roomList.length) {

    //remove duplicate entries from array
    var filteredRoomList = roomList.filter(function(elem, index, self) {
      return index == self.indexOf(elem);
    });

    for(var i in filteredRoomList) {
      var link = document.createElement('a');
      var listItem = document.createElement('li');
      link.classList.add('list-group-item');
      link.innerText = filteredRoomList[i];
      link.setAttribute('href', '/room/' + filteredRoomList[i]);
      listItem.appendChild(link);
      list.appendChild(listItem);
    }
  }
  else {
    var msg = document.createElement('p');
    msg.innerText = 'None Active :(';
    list.appendChild(msg);
  }

  lobby.appendChild(list);
});