async function moduleInit(moduleName, callBack, functionName) {
  const element = document.querySelector(moduleName)
  element && callBack().then(value => {
    functionName ? value[functionName]() : value.default()
  })
}

export default moduleInit
