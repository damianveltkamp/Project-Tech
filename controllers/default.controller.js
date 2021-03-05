export async function home(req, res) {
  req.session.userID
  const data = {
    layout:  'layout.html',
    title: 'Home page',
    loggedInUser: req.session.userID
  }

  res.render('pages/home.html', data)
}

export function notFound(req, res) {
  const data = {
    layout:  'layout.html',
    title: 'Page not found'
  }

  res.render('pages/not-found.html', data)
}

export function like(req, res) {
  res.send('hallo')
}

export function likepost(req, res) {
  res.send('nog een keer hallo')
}
