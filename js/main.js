function genBookmark(data, target) {
  for (var i = 0; i < data.length; i++) {
    if ('name' in data[i]) {
      var a = document.createElement('a');
      a.href = '' + data[i].link
      a.appendChild(document.createTextNode(data[i].name))
      target.appendChild(a);
      var s = document.createElement('span');
      s.className = 'description'
      var t = document.createTextNode(' ' + data[i].link)
      s.appendChild(t);
      target.appendChild(s);
      target.appendChild(document.createElement('br'));
    }
  }
}

function genTextForCopy(data, target, className) {
  for (var i = 0; i < data.length; i++) {
    if ('text' in data[i]) {
      var button = document.createElement('button');
      button.classList.add(className)
      button.appendChild(document.createTextNode(data[i].text))
      target.appendChild(button);
    }
  }
}

function toClipboard(text) {
  navigator.clipboard.writeText(this.innerText || text)
    .then(()=>{})
}

function installClickHandlerToText(className) {
    const ary = document.querySelectorAll("." + className);
    for (let i = 0; i < ary.length; i++) {
      ary[i].addEventListener("click", toClipboard);
    }
}

/*
 * bookmark.json
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
    var target = document.getElementById("bookmark");
    genBookmark(data, target);
    genTextForCopy(data, target, 'forCopy');
    installClickHandlerToText('forCopy')
  })
  .catch(function (err) {
    console.log('error: ' + err);
  });

