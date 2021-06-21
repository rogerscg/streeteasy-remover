let globalListings = null;

function getListingIdFromLinkAlternate() {
  const els = document.querySelectorAll('[rel=alternate]');
  if (els.length != 1) {
    return null;
  }
  const href = els[0].href;
  const splits = href.split('/');
  return splits[splits.length - 1];
}

function getListingIdForCard(card) {
  const els = card.getElementsByClassName('listingCard-globalLink');
  if (els.length != 1) {
    return null;
  }
  const innerCard = els[0];
  return innerCard.dataset.listingId;
}

function createBlockButton(listingId, card) {
  const els = card.getElementsByClassName('listingCardBottom--lowerBlock');
  if (els.length != 1) {
    return null;
  }
  const lowerBlock = els[0];
  lowerBlock.style.zIndex = 10;
  const button = document.createElement('button');
  button.textContent = 'Block Listing';
  lowerBlock.insertBefore(button, lowerBlock.childNodes[0]);
  button.addEventListener('click', () => {
    blockListing(listingId);
    card.parentElement.removeChild(card);
  });
}

function prepareSearchResult(card) {
  const listingId = getListingIdForCard(card);
  if (!listingId) {
    return;
  }
  if (globalListings.has(listingId)) {
    card.parentElement.removeChild(card);
    console.log('Removed listing', listingId);
    return;
  }
  createBlockButton(listingId, card);
}

function getAllSearchResults() {
  const listCards = Array.from(
    document.getElementsByClassName('searchCardList--listItem')
  );
  listCards.forEach((card) => {
    prepareSearchResult(card);
  });
}

function blockListing(listingId) {
  chrome.storage.local.get({ listings: [] }, (result) => {
    var listings = result.listings;
    listings.push(listingId);
    chrome.storage.local.set({ listings: listings }, () => {});
  });
}

function loadBlockedListings() {
  return new Promise((resolve) => {
    chrome.storage.local.get({ listings: [] }, (result) => {
      const listings = result.listings;
      resolve(listings);
    });
  });
}

function prepareMainInfo() {
  const els = document.body.getElementsByClassName('main-info');
  if (els.length != 1) {
    return null;
  }
  const mainInfo = els[0];
  const button = document.createElement('button');
  button.textContent = 'Block Listing';
  mainInfo.appendChild(button);
  button.addEventListener('click', () => {
    blockListing(getListingIdFromLinkAlternate());
    window.history.back();
  });
}

async function run() {
  const listings = await loadBlockedListings();
  globalListings = new Set(listings);
  getAllSearchResults();
  prepareMainInfo();
}

run();
