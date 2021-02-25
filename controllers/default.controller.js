export function home(req, res) {
  const data = {
    layout:  'layout.html',
    title: 'Home page'
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
