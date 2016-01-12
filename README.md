# Purpose
Pure javascript plugin with non intrusive data in &lt;table> in order to filter and sort 

# Requirements
None !

# Features
* Add filter ```<input>``` in header
* Add sort ```<img>``` in header
* No inject data in ```<table>``` to work, only the id table
* No jQuery requirement

# Installation
```html
<script type="text/javascript" src="smartable.js"></script>
```

# Usage
```javascript
var sortFilterTable = new smartab({
  tabId : '#table',
  linkUpSort : 'up-sort.png', //default
  linkDownSort : 'down-sort.png', //default
  linkNoSort : 'img/sort.png', //default
  widthFilter : 100, //default
  unsortCols : [1],
  unfilterCols : [1]
});
sortFilterTable.addHeader();
```
# Options

* ```tabId``` : table identifier
* ```linkUpSort``` : up sort image
* ```linkDownSort``` : down sort image
* ```linkNoSort``` : general sort image
* ```widthFilter``` : width of ```<input>``` filter in px
* ```unsortCols``` : list of column number don't sortable
* ```unfilterCols``` : list of column number don't filterable

# Browser support

![Chrome](https://raw.github.com/alrra/browser-logos/master/chrome/chrome_48x48.png) | ![Firefox](https://raw.github.com/alrra/browser-logos/master/firefox/firefox_48x48.png) | ![IE](https://raw.github.com/alrra/browser-logos/master/internet-explorer/internet-explorer_48x48.png) | ![Opera](https://raw.github.com/alrra/browser-logos/master/opera/opera_48x48.png) | ![Safari](https://raw.github.com/alrra/browser-logos/master/safari/safari_48x48.png)
--- | --- | --- | --- | --- |
?  | Latest  	&#10004;| ?| ?| ?|

