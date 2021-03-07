import "regenerator-runtime/runtime.js";
import moduleInit from '@javascript/utilities/module-init'

moduleInit('[js-hook-module-form-validation]', () => {
  return import('@components/form/javascript/form')
})
