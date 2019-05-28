const http = require('http')
const https = require('https')
const url = require('url')

const server = http.createServer(function (req, res) {
    let pathName = url.parse(req.url, true, false).pathname
    let queryWord = url.parse(req.url).query

    if (pathName == "/") {
        let queryUrl = `https://dictionary.cambridge.org/zht/autocomplete/english-chinese-traditional/?q=${queryWord}`;
        https.get(queryUrl, (queryResponse) => {
            
            let q = ""
            queryResponse.on("data", (data) => {
                q += data
            })

            queryResponse.on("end", () => {
                q = JSON.parse(q);
                let vocList = []
                for(element of q.results){
                    vocList.push(element.searchtext)
                }
                let result = JSON.stringify([queryWord, vocList])

                res.writeHead(200, { "Content-Type": "application/json" })
                res.end(result);
            })
        })

    }

})

const PORT = process.env.PORT || 8888;
server.listen(PORT);
console.log("Server is listening!");
