let currentTabId;
let inboxTabId;
let previousTab;

function onError(e) {
  console.log("***Error: " + e);
};

function createPinnedTab() {
  browser.tabs.create(
    {
      url: "https://www.usajobs.gov/",
      pinned: true,
      active: true
    }
  )
};

function handleSearch(inboxTabs) {
  //console.log("currentTabId: " + currentTabId);
  if(inboxTabs.length > 0) {
    //console.log("there is a Inbox tab");
    inboxTabId = inboxTabs[0].id;
    if(inboxTabId === currentTabId) {
      //console.log("I'm in the Inbox tab");
      browser.tabs.update(previousTab, {active: true,});
    } else {
      //console.log("I'm NOT in the Inbox tab");
      previousTab = currentTabId;
      browser.tabs.update(inboxTabId, {active: true,});
    }
  } else {
    //console.log("there is NO Inbox tab");
    previousTab = currentTabId;
    createPinnedTab();
  }
};

function handleClick(tab) {
  //console.log("*********Button clicked*********");
  currentTabId = tab.id;
  var querying = browser.tabs.query({url: "*://*.usajobs.gov/*"});
  querying.then(handleSearch, onError);
};

function update(details) {
  if (details.reason === "install" || details.reason === "update") {
    var opening = browser.runtime.openOptionsPage();
    opening.then(onOpened, onError);
  }
};

browser.browserAction.onClicked.addListener(handleClick);
browser.runtime.onInstalled.addListener(update);