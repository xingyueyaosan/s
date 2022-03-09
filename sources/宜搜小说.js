const baseUrl = "http://api.ieasou.com"

//搜索
const search = (key) => {
  let response = GET(`${baseUrl}/api/bookapp/searchdzh.m?word=${encodeURI(key)}&type=0&page_id=1&count=20&cid=eef_easou_book&os=android&appverion=1115`)
  let $ = JSON.parse(response)
  let array = []
  $.all_book_items.forEach((child) => {
    array.push({
      name: child.name,
      author: child.author,
      cover: child.imgUrl,
      detail: `${baseUrl}/api/bookapp/bookSummary.m?nid=${child.nid}&gid=${child.gid}&returnType=010&cid=eef_easou_book&os=android&appverion=1115`,
    })
  })
  return JSON.stringify(array)
}

//详情
const detail = (url) => {
  let response = GET(url)
  let $ = JSON.parse(response).coverInfo
  let book = {
    summary: $.desc,
    status: $.status == 1 ? '连载' : '完结',
    category: $.labels.replaceAll(","," ")||$.category,
    words: $.wordCount,
    update: timestampToTime($.last_time),
    lastChapter: $.last_chapter_name,
    catalog: `${baseUrl}/api/bookapp/bookSummary.m?gid=${$.gid}&nid=${$.nid}&sort=1&size=100000&returnType=100&cid=eef_easou_book&os=android&appverion=1115`
  }
  return JSON.stringify(book)
}

//转换更新时间 时间戳
function timestampToTime(timestamp) {
        var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1):date.getMonth()+1) + '-';
        var D = (date.getDate()< 10 ? '0'+date.getDate():date.getDate())+ ' ';
        var h = (date.getHours() < 10 ? '0'+date.getHours():date.getHours())+ ':';
        var m = (date.getMinutes() < 10 ? '0'+date.getMinutes():date.getMinutes()) + ':';
        var s = date.getSeconds() < 10 ? '0'+date.getSeconds():date.getSeconds();
        return Y+M+D+h+m+s;
}

//目录
const catalog = (url) => {
  let response = GET(url)
  let $ = JSON.parse(response)
  let array = []
  $.volumes.forEach((booklet) => {
    array.push({ name: booklet.name })
    booklet.chapters.forEach((chapter) => {
      array.push({
        name: chapter.chapter_name,
        url: `${baseUrl}/api/bookapp/chargeChapter.m?cid=eef_easou_book&os=android&udid=11db225c8bc8fd33cb6b16507eb2966b672b228e&ch=blf1298_10928_001&appverion=1115&gid=${url.query('gid')}&nid=${chapter.nid}&sort=${chapter.sort}`
      })
    })
  })
  return JSON.stringify(array)
}

//章节
const chapter = (url) => {
    let $ = JSON.parse(GET(url))
  return $.content.trim()
}

var bookSource = JSON.stringify({
  name: "宜搜小说",
  url: "ieasou.com",
  version: 100
})
