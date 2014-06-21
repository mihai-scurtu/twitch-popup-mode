function checkTwitchStream(url) {
	var fixedURIs = ['directory', 'videos'];

	var matches = url.toString().match(/^https?:\/\/(www\.)?twitch\.tv\/?([^\/]+)(\/(popout))?\/?$/);
	// console.log(matches);
	return matches != null && matches.index == 0 && fixedURIs.indexOf(matches[2]) == -1;
}

function checkTwitchPopup(url) {
	var matches = url.toString().match(/^https?:\/\/(www\.)?twitch\.tv\/?([^\/]+)(\/(popout)\/?)?$/);
	// console.log(matches);
	return matches != null && matches.index == 0 && matches[4] == 'popout';
}

chrome.pageAction.onClicked.addListener(function(tab) {
	if(checkTwitchStream(tab.url)) {
		var targetUrl = '';

		if(checkTwitchPopup(tab.url)) {
			targetUrl = tab.url.replace(/\/popout\/?/i, '');
		} else {
			targetUrl = tab.url + '/popout';
		}

		console.log(targetUrl);
		chrome.tabs.update(tab.id, {url: targetUrl});
	}
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	if(checkTwitchStream(tab.url)) {
		chrome.pageAction.show(tabId);
	} else {
		chrome.pageAction.hide(tabId);
	}
});

chrome.tabs.onActivated.addListener(function(activeInfo) {
	console.log(activeInfo);
	chrome.tabs.get(activeInfo.tabId, function(tab) {
		if(checkTwitchStream(tab.url)) {
			chrome.pageAction.show(tab.id);
		} else {
			chrome.pageAction.hide(tab.id);
		}
	});
	
});