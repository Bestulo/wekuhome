steem.api.setOptions({ url: 'wss://standby.weku.io:8190' });
steem.config.set('address_prefix', "WKA");
steem.config.set('chain_id', "b24e09256ee14bab6d58bfa3a4e47b0474a73ef4d6c47eeea007848195fa085e");

const get3Posts = author =>
  new Promise((resolve, reject) =>
    steem.api.getDiscussionsByBlog({ tag: author, limit: 3 }, (err, results) =>
      err ? reject(err) : resolve(results)))

const firstNCharacters = (n, str) =>
  str.substring(0,n)

const getCardDetails = cardId =>
  ({
    imgId: "post-img" + cardId,
    titleId: "ttl-post-" + cardId,
    bodyId: "bdy-post-" + cardId
  })

const cardIds = [1,2,3].map(String)

const getFirstImage = body =>
  body.match(/https?:\/\/.*\.(?:png|jpg)/i)[1]
  || 'https://wekuwebsite.com/images/logo.png' // edit to proper logo

$(document).ready(() =>
  get3Posts('weku-account').then(post =>
    cardIds.map(getCardDetails).forEach(card => {

      const postImage = getFirstImage(post.body)
      let postTitle = firstNCharacters(50, post.title)
      let postBody = firstNCharacters(150, post.body)
      if (post.title.length > postTitle) postTitle += '...'
      if (post.body.length > postBody) postBody += '...'

      $('#' + card.imgId).attr(src, postImage)
      $('#' + card.titleId).text(postTitle)
      $('#' + card.bodyId).text(postBody)
    })))