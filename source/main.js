import moduleInit from '../source/javascript/utilities/module-init'

moduleInit('[js-hook-module-form-validation]', () => {
  return import('../source/components/form/javascript/form')
})
