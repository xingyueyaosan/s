const baseUrl = "http://www.fqxs.org"

/**
 * 搜索
 * @params {string} key
 * @returns {[{name, author, cover, detail}]}
 */
const search = (key) => {
  let response = POST("http://www.fanqianxs.com/modules/article/search.php", {data: `keyword=${encodeURI(key)}`})
  let array = []
  let $ = HTML.parse(response)
    $('.novelslist2 >ul> li+li').forEach((child) => {
      let $ = HTML.parse(child)
      array.push({
        name: $('.s2').text(),
        author: $('.s4').text(),
        cover: `https://imgfqxs.cdn.bcebos.com/${$('.s3>a').attr('href').match(/\d+\/\d+/)[0]}.jpg`,
        detail: $('.s2>a').attr('href')
      })
    })
  return JSON.stringify(array)
}

/**
 * 详情
 * @params {string} url
 * @returns {[{summary, status, category, words, update, lastChapter, catalog}]}
 */
const detail = (url) => {
  let response = GET(url)
  let $ = HTML.parse(response)
  let book = {
    catalog: url
  }
  return JSON.stringify(book)
}

/**
 * 目录
 * @params {string} url
 * @returns {[{name, url, vip}]}
 */
const catalog = (url) => {
  let response = GET(url)
  let $ = HTML.parse(response)
  let array = []
    $('#list >dl >dt~dt~dd').forEach((chapter) => {
      let $ = HTML.parse(chapter)
      array.push({
        name: $('a').text(),
        url: `${baseUrl}${$('a').attr('href')}`
      })
    })
  return JSON.stringify(array)
}

/**
 * 章节
 * @params {string} url
 * @returns {string}
 */
const chapter = (url) => {
  let $ = HTML.parse(GET(url).replace(/.+咪咪阅读.+/,""))
  return $('#content')
}

var bookSource = JSON.stringify({
  name: "🍅番茄小说",
  url: "fqxs.org",
  version: 100
})
