const baseUrl = "https://69shu.net"

//搜索
const search = (key) => {
    let response = POST(`${baseUrl}/s.php`, {data: `s=${ENCODE(key,'gbk')}&type=articlename`})
    let array = []
    let $ = HTML.parse(response)
    $('p.search_list').forEach((child) => {
        let $ = HTML.parse(child)
        let b = $('a').attr('href').match(/\d+/)
        let q = parseInt(b/1000)
        array.push({
            name: $('a').text(),
            author: $('p').text().replace(/.*- /,''),
            cover: `https://img.69shu.net/${q}/${b}/${b}s.jpg`,
            detail: `${baseUrl}/${b}/?qid=${q}&bid=${b}`
        })
    })
    return JSON.stringify(array)
}

//详情
const detail = (url) => {
    let response = GET(url)
    let $ = HTML.parse(response)
    let page = $('option:last-child').attr('value').match(/(?<=_).+(?=\/)/)
    let book = {
        catalog: url + `&pid=${page}`
    }
    return JSON.stringify(book)
}

//目录
const catalog = (url) => {
    let array = []
    let pageC = 540
    for (i=1;i<=pageC;i++) {
        let response = GET(`${baseUrl}/${url.query("qid")}/${url.query("bid")}_${i}/#all`)
        let $ = HTML.parse(response)
        pageC = url.query("pid")
        $('ul ~ ul > li').forEach((chapter) => {
            let $ = HTML.parse(chapter)
                array.push({
                name: $('a').text(),
                url: `${baseUrl}${$('a').attr('href')}`
            })
        })
    }
    return JSON.stringify(array)
}

//章节
const chapter = (url) => {
    let $ = HTML.parse(GET(url))
    return $('#novelcontent')
}

var bookSource = JSON.stringify({
    name: "69书吧",
    url: "69shu.net",
    version: 100
})