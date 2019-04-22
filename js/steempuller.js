steem.api.setOptions({ url: 'wss://standby.weku.io:8190' });
steem.config.set('address_prefix', "WKA");
steem.config.set('chain_id', "b24e09256ee14bab6d58bfa3a4e47b0474a73ef4d6c47eeea007848195fa085e");

const get3Posts = author =>
  new Promise((resolve, reject) =>
    steem.api.getDiscussionsByBlog({ tag: author, limit: 3 }, (err, results) =>
      err ? reject(err) : resolve(results)))

function strip(html) {
    var tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
}

const firstNCharacters = (n, text) => {
  text = text.replace(/!\[]\((http\S+(?:\.jpg|\.png|.gif))\)/, '$1')
  text = text.replace(/\[.+?]\((http\S+)\)/, '')
  text = text.replace(/ http\S+(?:\.jpg|\.png|\.gif) /g, '')
  text = text.replace(/http\S+(?:\.jpg|\.png|\.gif) /g, '')
  text = text.replace(/ http\S+(?:\.jpg|\.png|\.gif)/g, '')
  text = text.replace(/http\S+(?:\.jpg|\.png|\.gif)/g, '')
  text = text.replace(/!\[\]\(\)/, '')
  text = text.replace(/https?:\/\/\S+/, '')
  text = text.replace(/\*+/g, '')
  text = strip(text)
  text = text.substring(0, n).trim() + '...'
  return text
}

const getCardDetails = cardId =>
  ({
    imgId: "img-post-" + cardId,
    titleId: "ttl-post-" + cardId,
    bodyId: "bdy-post-" + cardId,
    wrapperId: "wrapper-" + cardId
  })

const cardIds = [1,2,3].map(String)

const getFirstImage = body =>
  body.match(/https?:\/\/.+?\.(?:png|jpg)/i)[0]
  // || 'https://i.imgur.com/3cQIBTK.jpg' // edit to Weku logo or something

$(document).ready(() =>
  get3Posts('mazinga').then(posts =>
    cardIds.map(getCardDetails).forEach((card, i) => {
      const post = posts[i]

      const postImage = getFirstImage(post.body)
      const defaultImage = 'https://i.imgur.com/3cQIBTK.jpg'
      console.log(postImage)

      let postTitle = firstNCharacters(35, post.title)
      let postBody = firstNCharacters(150, post.body)
      if (post.title.length > postTitle) postTitle += '...'
      if (post.body.length > postBody) postBody += '...'

      if (postImage) $('#' + card.imgId).css("background-image", `url(${postImage})`)
      else $('#' + card.imgId).css("background-image", `url(${defaultImage})`)
      $('#' + card.titleId).text(postTitle)
      $('#' + card.bodyId).text(postBody)

      $('#' + card.wrapperId).attr('href', 'https://deals.weku.io/@' + post.author + '/' + post.permlink)

    })))