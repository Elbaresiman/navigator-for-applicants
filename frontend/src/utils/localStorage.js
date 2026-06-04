const QUIZ_STATE_KEY = 'it_navigator_quiz_state';

export const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('localStorage not available');
  }
};

export const loadFromStorage = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (e) {
    console.warn('localStorage not available');
    return null;
  }
};

export const saveQuizState = (state) => {
  saveToStorage(QUIZ_STATE_KEY, state);
};

export const loadQuizState = () => {
  return loadFromStorage(QUIZ_STATE_KEY);
};

export const clearQuizState = () => {
  localStorage.removeItem(QUIZ_STATE_KEY);
};

export const saveResult = (result) => {
  saveToStorage('it_navigator_result', result);
};

export const loadResult = () => {
  return loadFromStorage('it_navigator_result');
};
