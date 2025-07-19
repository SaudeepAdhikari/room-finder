// This script forces a hard refresh in the browser
window.localStorage.setItem('forceRefresh', Date.now());
location.reload(true);
