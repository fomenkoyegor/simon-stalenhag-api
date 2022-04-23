const http = require("http");
const cheerio = require('cheerio');
const axios = require("axios");
const HOSTNAME = process.env.HOSTNAME || "0.0.0.0";
const PORT = process.env.PORT || 8000;

function error(res, code) {
  res.statusCode = code;
  res.end(`{"error": "${http.STATUS_CODES[code]}"}`);
}

async function index(res) {
  const response = await axios(`http://www.simonstalenhag.se/`);
  const node = await response.data;
  const $ = cheerio.load(node);
  console.log(  $('p a img'))
  const data = [];
  const ps = $(`p a img`);
  $(ps).each((i, link) => {
    const href = link.attribs.src;
    const match = href.match(/detalj/);
    if(!match) {
      data.push({
        id: i,
        src: `http://www.simonstalenhag.se/${href}`,
        srcBig:`http://www.simonstalenhag.se/bilderbig/${href.slice(0,-4).slice(7)}_big.jpg`
      })}
  });
  res.end(JSON.stringify(data));
}
const server = http.createServer((req, res) => {
  if (req.method !== "GET") return error(res, 405);
  if (req.url === "/") return index(res);
  error(res, 404);
});

server.listen(PORT, HOSTNAME, () => {
  console.log(`Server listening on port ${server.address().port}`);
});