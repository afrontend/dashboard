# Dashboard

Local web service to show bookmarks

## How to run

JSON/\* files are used to store bookmarks and text to copy.

```basd
git clone https://github.com/afrontend/dashboard.git
cd dashboard
yarn install
mkdir json
echo '[{"name": "google", "link": "https://google.com"}]' > json/dashboard.json
echo '[{"content": "This a text for copy"}]' > json/text.json
yarn run serve
```
