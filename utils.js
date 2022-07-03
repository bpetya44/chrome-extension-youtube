//from google docks grabs the current actve tab
export async function getActiveTabURL() {
    let queryOptions = { active: true, currentWindow: true};
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}