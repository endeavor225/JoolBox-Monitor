import { boot } from 'quasar/wrappers'
import { date } from 'quasar'
//import { fr } from "date-fns/locale";

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ({ app }) => {
  // something to do
  const dateF = (params) => {
    return date.formatDate(params, 'DD MMM YYYY')
  }
  app.config.globalProperties.$date = dateF

  const dateFormater = (params) => {
    return date.formatDate(params, `ddd DD MMM YY`)
  }
  app.config.globalProperties.$formatDate = dateFormater

  const jourFormat = (params) => {
    return date.formatDate(params, 'DD')
  }
  app.config.globalProperties.$jour = jourFormat

  const MoisFormat = (params) => {
    return date.formatDate(params, 'MMM')
  }
  app.config.globalProperties.$mois = MoisFormat

  const anneeFormat = (params) => {
    return date.formatDate(params, 'YYYY')
  }
  app.config.globalProperties.$annee = anneeFormat

  const temps = (params) => {
    return date.formatDate(params, 'HH:mm')
  }
  app.config.globalProperties.$tempsFormat = temps
})
