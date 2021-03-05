import moduleInit from '../source/javascript/utilities/module-init'

moduleInit('[js-hook-module-login]', () => {
  return import('../source/components/form/javascript/form')
})
