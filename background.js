chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ listings: [] });
  console.info('Initialized blocked listings.');
});
