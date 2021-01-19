const ESC_KEY_CODE = 27;

export const isEscEvent = (evt, action) => {
  if (evt.keyCode === ESC_KEY_CODE) {
    action();
  }
};

export const isOnline = () => {
  return window.navigator.onLine;
};
