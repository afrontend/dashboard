
function genBookmark(data, target) {
  for (let i = 0; i < data.length; i++) {
    if ('name' in data[i]) {
      const a = document.createElement('a');
      a.href = '' + data[i].link
      a.appendChild(document.createTextNode(data[i].name))
      target.appendChild(a);
      const s = document.createElement('span');
      s.className = 'description'
      const t = document.createTextNode(' ' + data[i].link)
      s.appendChild(t);
      target.appendChild(s);
      target.appendChild(document.createElement('br'));
    }
  }
}

function genTextForCopy(data, target, className) {
  for (let i = 0; i < data.length; i++) {
    if ('text' in data[i]) {
      const button = document.createElement('button');
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
    const target = document.getElementById("bookmark");
    genBookmark(data, target);
  })
  .catch(function (err) {
    console.log('error: ' + err);
  });

/*
 * text.json
 * [
 *   {
 *     "text": "text for copy",
 *   },
 * ]
 */

fetch('text.json?' + (new Date()).valueOf())
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    const target = document.getElementById("textForCopy");
    genTextForCopy(data, target, 'forCopy');
    installClickHandlerToText('forCopy')
  })
  .catch(function (err) {
    console.log('error: ' + err);
  });
