<template>
  <q-card style="width: 690px; max-width: 80vw; border-radius: 10px;">
    <q-card-section class="row items-center q-pb-none">
      <q-item-section>
        <q-item-label class="q-ml-md q-mt-sm" style="border-left: 2px solid #55AAA0; height: 20px; font-size: 18px;">
            <span class="q-pl-xs text-primary">Ajouter nouvelle </span> occurence
        </q-item-label>
      </q-item-section>
    </q-card-section>

    <q-card-section class="q-mt-md q-pa-sm">
      <q-item-section class="q-ml-lg">
        <q-item-label style="font-size: 15px;">
            <span style="border-bottom: 2px solid #55AAA0;">Début</span> de l’occurence
        </q-item-label>
      </q-item-section>
    </q-card-section>

    <q-card-section class="q-mr-md q-ml-md q-mb-none q-pt-none">
      <q-form
          ref="createForm"
          @submit="onSubmit"
        >
          <q-card-section class="text-subtitle1 q-pa-xs">
            <div class="row q-gutter-x-xl">
              <div class="col">
                <q-input
                  borderless
                  dense
                  label="Date"
                  v-model="formData.date"
                  :rules="['date']"
                  mask="date"
                >
                  <template v-slot:prepend>
                    <q-avatar square size="15px">
                      <img :src="formData.date ? 'date_iconActif.svg' : 'date_icon.svg' "/>
                    </q-avatar>
                  </template>

                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer" >
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="formData.date" :options="optionsFn" >
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Valider" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>

              <div class="col">
                <q-input
                  borderless
                  dense
                  label="Heure"
                  v-model="formData.heure"
                  :rules="['time']"
                  mask="time"
                >
                  <template v-slot:prepend>
                    <q-avatar square size="15px">
                      <img :src="formData.heure ? 'date_iconActif.svg' : 'date_icon.svg' "/>
                    </q-avatar>
                  </template>

                  <template v-slot:append>
                    <q-icon name="access_time" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-time v-model="formData.heure" format24h>
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Valider" color="primary" flat />
                          </div>
                        </q-time>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
            </div>
          </q-card-section>

          <q-card-section class="q-mt-none q-pa-none">
            <q-item-section >
              <q-item-label style="font-size: 15px;">
                  <span style="border-bottom: 2px solid #55AAA0;">Choix</span> de la récurrence
              </q-item-label>
            </q-item-section>
          </q-card-section>


          <q-card-section class="q-mt-md q-pa-none">
            <q-tabs
              v-model="choix"
              dense
              class="text-grey"
              active-color="primary"
              indicator-color="primary"
              align="justify"
            >
              <q-tab no-caps name="default" label="Une fois" />
              <q-tab no-caps name="hebdomadaire" label="Hebdomadaire" />
              <q-tab no-caps name="mensuel" label="Mensuel" />
            </q-tabs>

            <q-tab-panels v-model="choix">
              <q-tab-panel name="default" class="q-pl-none q-pr-none text-weight-light">
                <q-card flat style="height: 25px;">
                  <div class="q-pt-xs">Cette occurence se produira seulement à la date indiquée</div>
                </q-card>
              </q-tab-panel>

              <q-tab-panel name="hebdomadaire" class="q-pa-none q-pt-md text-weight-light">
                <q-card flat style="height: 100px;">
                  <div class="q-gutter-x-md" style="padding-top: 6px; position: relative; left: -2px;">
                    <q-checkbox size="xs" v-model="formData.semaine.lundi" label="Lundi" color="teal" />
                    <q-checkbox size="xs" v-model="formData.semaine.mardi" label="Mardi" color="teal" />
                    <q-checkbox size="xs" v-model="formData.semaine.mercredi" label="Mercredi" color="teal" />
                    <q-checkbox size="xs" v-model="formData.semaine.jeudi" label="Jeudi" color="teal" />
                    <q-checkbox size="xs" v-model="formData.semaine.vendredi" label="Vendredi" color="teal" />
                    <q-checkbox size="xs" v-model="formData.semaine.samedi" label="Samedi" color="teal" />
                    <q-checkbox size="xs" v-model="formData.semaine.dimanche" label="Dimanche" color="teal" />
                  </div>

                  <div class="q-mt-md q-pl-xs" style="max-width: 300px">
                    <q-input
                      borderless
                      dense
                      label="Fin de l’occurence"
                      v-model="formData.dateDeFin"
                      :rules="['date']"
                      mask="date"
                    >
                      <template v-slot:prepend>
                        <q-avatar square size="15px">
                          <img :src="formData.dateDeFin ? 'date_iconActif.svg' : 'date_icon.svg' "/>
                        </q-avatar>
                      </template>

                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer" >
                          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                            <q-date v-model="formData.dateDeFin" :options="optionsFn" >
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup label="Valider" color="primary" flat />
                              </div>
                            </q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                </q-card>
              </q-tab-panel>

              <q-tab-panel name="mensuel" class="q-pa-none q-pt-md text-weight-light" >
                <q-card flat style="height: 100px;">
                  <div class="row q-gutter-x-md justify-between">
                    <q-btn v-if="options.firstOption" class="text-weight-light" no-caps unelevated color="primary" style="width: 50%" @click="selectBouton(1)">
                      <span>Tous les mois, chaque {{ labelMensuel.jourDeSamaine }}</span>
                    </q-btn>
                    <q-btn v-else class="text-weight-light" no-caps unelevated outline style="width: 50%" @click="selectBouton(1)">
                      <span>Tous les mois, chaque {{ labelMensuel.jourDeSamaine }}</span>
                    </q-btn>

                    <q-btn v-if="options.secondOption" class="text-weight-light" no-caps unelevated color="primary" style="width: 45%" @click="selectBouton(2)">
                      <span>Tous les mois, le {{ labelMensuel.numeroJourDansMois }}</span>
                    </q-btn>
                    <q-btn v-else class="text-weight-light" no-caps unelevated outline style="width: 45%" @click="selectBouton(2)">
                      <span>Tous les mois, le {{ labelMensuel.numeroJourDansMois }}</span>
                    </q-btn>
                  </div>

                  <!-- <q-btn-toggle
                    style="border :1px solid #c3c3c3;"
                    class="q-ma-none q-mt-md text-weight-light"
                    name="genre"
                    no-caps
                    unelevated
                    spread
                    v-model="formData.genre"
                    toggle-color="primary"
                    :options="[
                      {label: 'Tous les mois, chaque premier samedi', value: 'rock'},
                      {label: 'Tous les 10 du mois', value: 'funk'},
                    ]"
                    :option-class="['text-weight-light']"
                  /> -->

                  <div class="q-mt-md q-pl-xs" style="max-width: 300px">
                      <q-input
                        borderless
                        dense
                        label="Fin de l’occurence"
                        v-model="formData.dateDeFin"
                        :rules="['date']"
                        mask="date"
                      >
                        <template v-slot:prepend>
                          <q-avatar square size="15px">
                            <img :src="formData.dateDeFin ? 'date_iconActif.svg' : 'date_icon.svg' "/>
                          </q-avatar>
                        </template>

                        <template v-slot:append>
                          <q-icon name="event" class="cursor-pointer" >
                            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                              <q-date v-model="formData.dateDeFin" :options="optionsFn" >
                                <div class="row items-center justify-end">
                                  <q-btn v-close-popup label="Valider" color="primary" flat />
                                </div>
                              </q-date>
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                      </q-input>
                    </div>
                </q-card>
              </q-tab-panel>
            </q-tab-panels>
          </q-card-section>

          <q-card-actions align="center" class="q-mt-none">
            <div class="q-gutter-md">
              <q-btn
                no-caps
                style="border-radius: 5px; width: 100px; border: 1px solid #b5b5b5;"
                padding="sm"
                unelevated
                v-close-popup
              >
                <span class="text-weight-light">Non</span>
              </q-btn>

              <q-btn
                color="secondary"
                class=""
                no-caps
                style="border-radius: 5px; width: 190px;  border: 1px solid #26A69A;"
                padding="sm"
                unelevated
                type="submit"
                :loading="submitting"
              >
                <span class="text-weight-light">Oui, programmer</span>
                <template v-slot:loading>
                    <q-spinner-facebook />
                  </template>
              </q-btn>
            </div>
          </q-card-actions>
      </q-form>
    </q-card-section>

    <q-btn unelevated padding="none" color="negative" class="absolute-top-right" v-close-popup>
      <q-icon name="img:Close.svg" size="md" />
    </q-btn>
  </q-card>
</template>

<script>
import { api } from "boot/axios";
import { useQuasar } from 'quasar';
import { defineComponent, getCurrentInstance, ref, inject, watch } from "vue";

export default defineComponent({
  // name: 'ComponentName',
  components: {
  },

  props: {
    mission_id: {
      default() {
        return {};
      },
    },
  },

  setup (props, {emit}) {
    let instance = getCurrentInstance();
    const $q = useQuasar()
    let programmeOcc = inject("programmeOcc")
    let notifyCreateOcc = inject("notifyCreateOcc")
    const submitting = ref(false)
    const token = $q.cookies.get('jool_auth_token')
    let formData = ref({})
    let createForm = ref()

    let choix = ref('default')
    let labelMensuel = ref({})

    const options = ref({
      firstOption : false,
      secondOption : false,
    })

    let onSubmit = async () => {
      submitting.value = true
      // Convertir les chaînes de caractères en objets Date
      var dateObj = new Date(formData.value.date);
      var heureObj = new Date("1970-01-01T" + formData.value.heure + "Z");
      dateObj.setHours(heureObj.getUTCHours());
      dateObj.setMinutes(heureObj.getUTCMinutes());
      // Formater la date et l'heure dans le format spécifié
      var request_time = dateObj.toISOString().slice(0, 19) + ".000 +0000";

      formData.value.request_time = request_time
      formData.value.choix = choix.value
      formData.value.pattern_id = props.mission_id

      try {
        await api({
          method: 'post',
          url: '/occurrences/programmation',
          data: formData.value,
          headers: {
            'Authorization': `Basic ${token}`
          }
        })
        .then(function (res) {
          notifyCreateOcc.value = true
          submitting.value = false
          programmeOcc.value = false

          emit('refresh-occurrence', /* arguments de l'événement */);
          setTimeout(()=> {
            notifyCreateOcc.value = false
          },2000)
        })
      } catch (error) {
        console.log("error", error);
        $q.notify({
          type: 'negative',
          position: 'bottom',
          message: 'Opération echouée'
        })
        submitting.value = false
      }
    }

    watch(choix, async (newValue, oldValue)=>{
      switch (choix.value) {
        case "default":
          delete formData.value.semaine
          delete formData.value.dateDeFin
          break;

        case "hebdomadaire":
          formData.value.semaine = {
            lundi: false,
            mardi: false,
            mercredi: false,
            jeudi: false,
            vendredi: false,
            samedi: false,
            dimanche: false,
          }
          break;

        case "mensuel":
          // Suppression de jour de la semaine
          delete formData.value.semaine

          // Option seleccionnée par defaut
          options.value.firstOption = true
          options.value.secondOption = false

          formData.value.selectOption = "JourDuMois"

          function formaterDateOccurrence(date) {
            var joursSemaine = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
            var jour = date.getDay(); // Récupérer le jour de la semaine (0 pour dimanche, 1 pour lundi, ..., 6 pour samedi)
            labelMensuel.value.numeroJourDansMois = date.getDate();

            var occurrence = Math.floor((labelMensuel.value.numeroJourDansMois - 1) / 7) + 1;
            var jourSemaine = joursSemaine[jour];

            if (occurrence === 1)  return occurrence + 'er ' + jourSemaine;
            else return occurrence + 'e ' + jourSemaine;
          }

          if (formData.value.date) {
            labelMensuel.value.jourDeSamaine = formaterDateOccurrence(new Date(formData.value.date));
          } else {
            labelMensuel.value.jourDeSamaine = formaterDateOccurrence(new Date());
          }

          watch(() => formData.value.date, () => {
            labelMensuel.value.jourDeSamaine = formaterDateOccurrence(new Date(formData.value.date));
          });
          break;
      }
    })

    let selectBouton = (boutonNumber) => {
      switch (boutonNumber) {
        case 1:
          options.value.firstOption = true
          options.value.secondOption = false
          formData.value.selectOption = "JourDuMois"
          break;
        case 2:
          options.value.firstOption = false
          options.value.secondOption = true
          formData.value.selectOption = "DateDuMois"
          break;
      }
    }

    let optionsFn = (date) => {
      let dateNow = new Date();
      // si date < 10 on verifie si je mois est inferieur a 10 ou pas
      if (dateNow.getDate() < 10) {
        if ( dateNow.getMonth()+ 1 < 10) {
          let dateFormat = dateNow.getFullYear() + "/0" + (dateNow.getMonth() + 1) + "/0" + dateNow.getDate();
          return date >= dateFormat;
        } else {
          let dateFormat = dateNow.getFullYear() + "/" + (dateNow.getMonth() + 1) + "/0" + dateNow.getDate();
          return date >= dateFormat;
        }
      // si date > 10 on verifie si je mois est inferieur a 10 ou pas
      } else {
        if ( dateNow.getMonth()+ 1 < 10) {
          let dateFormat = dateNow.getFullYear() + "/0" + (dateNow.getMonth() + 1) + "/" + dateNow.getDate();
          return date >= dateFormat;
        } else {
          let dateFormat = dateNow.getFullYear() + "/" + (dateNow.getMonth() + 1) + "/" + dateNow.getDate();
          return date >= dateFormat;
        }
      }
    }

    return {
      onSubmit,
      submitting,
      formData,
      createForm,
      optionsFn,
      choix,
      selectBouton,
      labelMensuel,
      options
    }
  }
})
</script>

<style scoped>
  .notify {
    width: 400px;
    border-radius: 15px;
    bottom: -35%;
  }
</style>
