let clearListingsButton = document.getElementById('clearListings');

clearListingsButton.addEventListener('click', async () => {
  chrome.storage.local.set({ listings: [] }, () => {});
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.update(tabs[0].id, { url: tabs[0].url });
  });
});
