export function initLoginHandler() {
  document.querySelector('[js-hook-module-login]').addEventListener('submit', loginHandler)
}

export function initRegisterHandler() {
  console.log('heeyo')
}

function loginHandler(event) {
  document.querySelectorAll('[js-hook-validate]').forEach(node => {
    switch(node.name) {
      case 'email' : {
        const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        const valid = regex.test(node.value)

        valid == false ? appendError(node, 'Provided email is not a valid email adress') : event.target.submit()
        break;
      }
      case 'password' : {
        const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/
        const valid = regex.test(node.value)
        console.log(valid)

        valid == false ? appendError(node, 'Password does not match our patern criteria') : event.target.submit()
        break;
      }
      default: {
        break;
      }
    }
  })
  event.preventDefault()
}

function appendError(inputNode, errorMessage) {
  const errorNode = document.createElement('span')
  const textNode = document.createTextNode(errorMessage)
  errorNode.appendChild(textNode)

  errorNode.classList.add('form__error')

  inputNode.parentNode.insertBefore(errorNode, inputNode)
}

export default initLoginHandler
