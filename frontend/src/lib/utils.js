export const capitialize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

// Token management utilities
export const getStoredToken = () => {
  // console.log("Retrieving token from localStorage",localStorage.getItem('authToken'));
  return localStorage.getItem('authToken');
};

export const setStoredToken = (token) => {
  if (token) {
    localStorage.setItem('authToken', token);
    // console.log("Token stored in localStorage:", localStorage);  
  }
};

export const removeStoredToken = () => {
  localStorage.removeItem('authToken');
};

export const isAuthenticated = () => {
  return !!getStoredToken();
};
