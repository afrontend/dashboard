# Dashboard

Local web service to show bookmarks

## How to run

JSON/\* files are used to store bookmarks and text to copy.

```bash
git clone https://github.com/afrontend/dashboard.git
cd dashboard
npm install
mkdir json
echo '{"urls":[{"emoji":"🍑","label":"Google","url":"https://google.com"}]}' > json/dashboard.json
echo '{"urls":[{"emoji":"","label":"This is a text for copy","url":""}]}' > json/text.json
npm run serve
```
