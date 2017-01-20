var notify = function(msg) {
  var notificationManager = document.getElementById('notification-manager');
  var toast = document.createElement('div');
  var toastMsg = document.createTextNode(msg);
  toast.className='toast';
  toast.appendChild(toastMsg);
  notificationManager.appendChild(toast);
  var promise = new Promise(function(resolve, reject) {
    setTimeout(function() {
      toast.classList.toggle('toast--active');
      setTimeout(function() {
        toast.classList.toggle('toast--active');
        resolve();
      }, 1000);
    }, 1000);
  });
  promise.then(function() {
    setTimeout(function() {
      notificationManager.removeChild(toast);
    }, 300);
  });
}

module.exports = notify;