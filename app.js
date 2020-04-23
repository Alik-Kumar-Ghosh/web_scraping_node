
const request = require("request-promise");
const cheerio = require("cheerio");
const fs = require('fs');
const json2csv = require("json2csv").Parser;
const url="https://www.mohfw.gov.in/";
async function main() {
 const result = await request.get({
   uri:url,
   headers:{
     accept:
     "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
     "accept-encoding": "gzip, deflate, br",
     "accept-language": "en-US,en;q=0.9",
   },
   gzip:true,
 });
 const $ = cheerio.load(result);
 const scrapedData = [];
 $("#state-data > div > div > div > div > table > tbody > tr").each((index, element) => 
 {
  //if (index === 32) return true;
  if (index === 33) return true;
  if (index === 34) return true;
  const trs = $(element).find("td");
  const sno = $(trs[0]).text()
  const state = $(trs[1]).text();
  const totalcases= $(trs[2]).text();
  const cured = $(trs[3]).text();
  const death = $(trs[4]).text();

  const tableRow = { sno,state, totalcases, cured, death };
  scrapedData.push(tableRow);
});
//console.log(scrapedData);
fs.writeFile('output.json', JSON.stringify(scrapedData, null, 4), function(err){
  console.log('mohfw site is successfully scraped! - Check your project directory for the output.json / output.csv file');
})

 const jtoc = new json2csv();
 const csv = jtoc.parse(scrapedData);
 
 fs.writeFileSync("./output.csv",csv,"utf-8"); 

}
 
main();