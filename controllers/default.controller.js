export async function home(req, res) {
  req.app.settings.redisClient.get('loggedInUser', (error, user) => {
    const data = {
      layout:  'layout.html',
      title: 'Home page',
      loggedInUser: user
    }

    res.render('pages/home.html', data)
  })
}

export function notFound(req, res) {
  const data = {
    layout:  'layout.html',
    title: 'Page not found'
  }

  res.render('pages/not-found.html', data)
}
