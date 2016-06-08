var socket = io();
socket.emit('getRooms');
socket.on('roomList', function(roomList) {
  var list = document.getElementById('list');
  var ul = document.createElement('ul');
  ul.classList.add('list-unstyled');

  //remove the list prior to re-rendering
  if(list.firstChild) list.removeChild(list.firstChild);

  //check for active rooms
  if(roomList.length) {

    //remove duplicate entries from array
    var filteredRoomList = roomList.filter(function(elem, index, self) {
      return index == self.indexOf(elem);
    });

    for(var i in filteredRoomList) {
      var li = document.createElement('li');
      var link = document.createElement('a');
      link.innerText = filteredRoomList[i];
      link.setAttribute('href', '/room/' + filteredRoomList[i]);
      li.appendChild(link);
      ul.appendChild(li);
    }
  }
  else {
    var msg = document.createElement('li');
    msg.innerText = 'None Active :(';
    ul.appendChild(msg);
  }

  list.appendChild(ul);
});