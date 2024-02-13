const setNotificationWithTimeout = (setNotification, message, type) => {
  setNotification({ message, type });
  setTimeout(() => {
    setNotification({ message: '', type: '' });
  }, 5000);
};

export { setNotificationWithTimeout }