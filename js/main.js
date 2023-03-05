function genBookmark(data) {
  var mainContainer = document.getElementById("bookmark");
  for (var i = 0; i < data.length; i++) {
    if ('name' in data[i]) {
      var a = document.createElement('a');
      a.href = '' + data[i].link
      a.appendChild(document.createTextNode(data[i].name))
      mainContainer.appendChild(a);
      var s = document.createElement('span');
      s.className = 'description'
      var t = document.createTextNode(' ' + data[i].link)
      s.appendChild(t);
      mainContainer.appendChild(s);
      mainContainer.appendChild(document.createElement('br'));
    }
    if ('text' in data[i]) {
      var button = document.createElement('button');
      button.classList.add('forCopy')
      button.appendChild(document.createTextNode(data[i].text))
      mainContainer.appendChild(button);
    }
  }
}

/*
 * function toClipboard(text) {
 *   navigator.clipboard.writeText(this.innerText || text)
 *     .then(()=>{})
 * }
 */

/*
 * bookmar.json
 * [
 *   {
 *     "name": "afrontend",
 *     "link": "https://afrontend.github.io/"
 *   },
 * ]
 */
fetch('bookmark.json?' + (new Date()).valueOf())
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    genBookmark(data);
    /*
     * const ary = document.querySelectorAll(".forCopy");
     * for (let i = 0; i < ary.length; i++) {
     *   ary[i].addEventListener("click", toClipboard);
     * }
     */
  })
  .catch(function (err) {
    console.log('error: ' + err);
  });

