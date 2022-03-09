const baseUrl = "https://wenxue.iqiyi.com"

//搜索
const search = (key) => {
  let response = GET(`https://search.video.iqiyi.com/o?key=${encodeURI(key)}&if=book&pageSize=20&pageNum=1&access_play_control_platform=15&need_qc=1`)
  let array = []
  let $ = JSON.parse(response)
    $.docinfos.forEach((d) => {
      let i = d.albumDocInfo
        array.push({
          name: i.book.title,
          author: i.book.author[0],
          cover: i.book.image_url,
          detail: JSON.stringify({
            url: `${baseUrl}/book/detail-${i.book.id}.html`,
          })
        })
    })
  return JSON.stringify(array)
}

//详情
const detail = (url) => {
  let xyys = JSON.parse(url)
  let response = GET(xyys.url)
  let $ = HTML.parse(response)
  let words = $('.book-details-about').text().match(/\d+/)[0]
  let book = {
    summary: $('.book-details-briefing').text(),
    category: $('.breadCrumbNav>a~a').text(),
    status: $('.stacksBook-tag').text(),
    words: parseInt(words/10000) + '万',
    update: $('h4 > em').text(),
    lastChapter: $('.clearfix > a').text(),
    catalog: xyys.url.replace('detail','catalog')
  }
  return JSON.stringify(book)
}

//目录
const catalog = (url) => {
  let array = []
  let pageC = 100
  for (i=1;i<=pageC;i++) {
    let curl = url.replace(".html",'')
    let response = GET(curl + `-${i}.html`)
    let $ = HTML.parse(response)
      pageC = $('.curPage').text() + 1
      $('.catalog-list').forEach((booklet) => {
        let $ = HTML.parse(booklet)
        array.push({ name: $('dt').text() })
        $('.catalog-chapter').forEach((cha) => {
          let $ = HTML.parse(cha)
          array.push({
            name: $('a').text(),
            url: 'https:' + $('a').attr('href'),
          //没钱要什么VIP
          //vip: $('i').attr('class')=='icon-diamond'
          })
        })
      })
  }
  return JSON.stringify(array)
}

//章节
const chapter = (url) => {
  let $ = HTML.parse(GET(url))
  return $('.reader-article')
}

var bookSource = JSON.stringify({
  name: "爱奇艺文学",
  url: "wenxue.iqiyi.com",
  version: 100
})
