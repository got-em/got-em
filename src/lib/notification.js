export default function notify(msg) {
  const notificationManager = document.getElementById('notification-manager');
  const toast = document.createElement('div');
  const toastMsg = document.createTextNode(msg);
  toast.className='toast';
  toast.appendChild(toastMsg);
  notificationManager.appendChild(toast);
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      toast.classList.toggle('toast--active');
      setTimeout(() => {
        toast.classList.toggle('toast--active');
        resolve();
      }, 1000);
    }, 1000);
  });
  promise.then(() => {
    setTimeout(() => {
      notificationManager.removeChild(toast);
    }, 300);
  });
}