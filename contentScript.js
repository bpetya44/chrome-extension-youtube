(() => {
    let youtubeLeftControls, youtubePlayer;//add variables to acces youtube player and access the left controls
    let currentVideo = "";
    let currentVideoBookmarks = [];

    //listen for the current video being played from the background.js file
    chrome.runtime.onMessage.addListener((obj, sender, response) => {
        const { type, value, videoId } = obj;

        if (type === "NEW") { //if the video is a new one then, set the var currentVideo to that value we get from the background.js file
            currentVideo = videoId;
            newVideoLoaded(); //and call this function
        } else if (type === "PLAY") {
            youtubePlayer.currentTime = value;
        } else if ( type === "DELETE") {
            currentVideoBookmarks = currentVideoBookmarks.filter((b) => b.time != value);
            chrome.storage.sync.set({ [currentVideo]: JSON.stringify(currentVideoBookmarks) });
      
            response(currentVideoBookmarks);
        }
    });

    const newVideoLoaded = async () => {
        const bookmarkBtnExists = document.getElementsByClassName("bookmark-btn")[0];
        //console.log(bookmarkBtnExists); //at first bookmark button does not exists so this returns undefined
        currentVideoBookmarks = await fetchBookmarks();

        if (!bookmarkBtnExists) {//if bookmark button does not exists then
            const bookmarkBtn = document.createElement("img"); //create element in the img DOM 

            bookmarkBtn.src = chrome.runtime.getURL("assets/bookmark.png");
            bookmarkBtn.className = "ytp-button " + "bookmark-btn"; //add a class to DOM
            bookmarkBtn.title = "Click to bookmark current timestamp"; //on hover we will see

            youtubeLeftControls = document.getElementsByClassName("ytp-left-controls")[0]; //left controls on you tube are the buttons on the bottom left play-forward-backward, so we select the 1st one-play, we find this by using inspect tool from the dev-tools and type console
            youtubePlayer = document.getElementsByClassName("video-stream")[0]; //here we grab the youtube video player
            
            youtubeLeftControls.appendChild(bookmarkBtn);// we add bookmark button  
            bookmarkBtn.addEventListener("click", addNewBookmarkEventHandler);//add eventlistener for that button
        }
    };

    const fetchBookmarks= () => {
        return new Promise((resolve,reject) => {
         chrome.storage.sync.get([currentVideo], (obj) => {
            //we check if there is any bookmarks for the current video we parse them to storage, otherwise we return empty array 
            resolve(obj[currentVideo] ? JSON.parse(obj[currentVideo]) : []);
         })
        })
    };


    const addNewBookmarkEventHandler = async () => {
        const currentTime = youtubePlayer.currentTime; //get the current timestamp
        const newBookmark = {
            time: currentTime,
            desc: "Bookmark at " + getTime(currentTime),
        };
        //console.log(newBookmark);

        currentVideoBookmarks = await fetchBookmarks();

        chrome.storage.sync.set({//sync to chrome storage
            [currentVideo]: JSON.stringify([...currentVideoBookmarks, newBookmark].sort((a, b) => a.time - b.time))
        });
    }

    newVideoLoaded();

   
})();

const getTime = t => {
    var date = new Date(0);
    date.setSeconds(t);

    return date.toISOString().substr(11, 8);
}
