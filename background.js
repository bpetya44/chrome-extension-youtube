chrome.tabs.onUpdated.addListener((tabId, tab) => { //listen on update to tabs
    if (tab.url && tab.url.includes("youtube.com/watch")) { //if there is tab url check if includes the url youtube.com/watch as youtube urls are in the format https://www.youtube.com/watch?v=0n809nd4Zu4

      const queryParameters = tab.url.split("?")[1]; //we split the url to ? and each url  are unique in our case is 'v=0n809nd4Zu4' we pass it to urlParameters

      const urlParameters = new URLSearchParams(queryParameters);
      console.log(urlParameters);

      chrome.tabs.sendMessage(tabId, { //from the documentation of chrome.tabs.sendMessage method takes tabId and unique object, which we choose
        type: "NEW", //new video event
        videoId: urlParameters.get("v"), //video parameters v='0n809nd4Zu4'
      });
    }
  });
  