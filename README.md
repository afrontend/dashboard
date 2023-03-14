# Dashboard
Local web service to show bookmarks

```
git clone https://github.com/afrontend/dashboard.git
cd dashboard
yarn install
mkdir json
echo '[{"name": "google", "link": "https://google.com"}]' > json/officeBookmark.json
echo '[{"name": "google", "link": "https://google.com"}]' > json/homeBookmark.json
echo '[{"content": "This a text for copy"}]' > json/text.json
yarn run serve
```
