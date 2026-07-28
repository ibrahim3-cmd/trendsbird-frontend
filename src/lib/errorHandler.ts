type ErrorCallback = () => void;

let errorCallback: ErrorCallback | null = null;

export const setErrorCallback = (callback: ErrorCallback) => {
  errorCallback = callback;
};

export const triggerSystemError = () => {
  errorCallback?.();
};
