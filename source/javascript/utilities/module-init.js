async function moduleInit(moduleName, callBack) {
  const element = document.querySelector(moduleName)
  element && callBack().then(value => {
    value.default()
  })
}

export default moduleInit
