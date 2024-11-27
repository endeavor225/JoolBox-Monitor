<template>
  <q-card flat style="border-radius: 15px; height: 130px;" class="q-pa-sm" v-if="!autorisationVol.length">
    <q-card-section class="text-subtitle1">
        <q-item-section>
          <q-item-label style="border-left: 2px solid #55AAA0; height: 20px;">
            <span class="q-pl-xs ">Autorisations de</span>
            <span class="text-primary"> Restriction de vol</span>
          </q-item-label>
        </q-item-section>
    </q-card-section>

    <div v-if="clear">
      <div class="q-pa-md">
        Recherchez toutes les restrictions de vol
        <q-spinner-dots
          color="primary"
          size="3em"
          class="q-pl-sm"
          style="position: relative; top: 2px;"
        />
      </div>
    </div>

    <div v-if="!clear">
      <div class="q-pa-md">
        Aucune approbation n'est nécessaire
      </div>
    </div>
  </q-card>

  <q-card flat style="border-radius: 15px; height: 270px;" class="q-pa-xs" v-if="autorisationVol.length"> <!-- 220px -->
    <q-card-section class="text-subtitle1 q-pb-sm">
        <q-item-section>
          <q-item-label style="border-left: 2px solid #55AAA0; height: 20px;">
            <span class="q-pl-xs ">Autorisations de</span>
            <span class="text-primary"> Restriction de vol</span>
          </q-item-label>
        </q-item-section>
    </q-card-section>

    <item-restriction :autorisations="autorisationVol"/>

  </q-card>
</template>

<script>
import moment from "moment"
import { api } from "boot/axios";
import { useQuasar } from 'quasar';
import { defineComponent, getCurrentInstance, ref, onMounted, watch, inject, provide } from "vue";
import ItemRestriction from "components/mission/Restriction/ItemRestriction.vue"

export default defineComponent({
  // name: 'ComponentName',

  components : {
    ItemRestriction
  },

  setup () {
    const instance = getCurrentInstance()
    const $q = useQuasar()
    const token = $q.cookies.get('jool_auth_token')
    let itemId = inject("itemId")
    let formData = ref({})
    let editRestriction = ref(false)
    let autorisationVol = ref([])
    let clear = ref(null)
    let updateAutorisation = inject("updateAutorisation")
    let stateUpdate = ref(false)
    provide("stateUpdate", stateUpdate)
    let itemMission = inject("itemMission")
    moment.locale('fr');

    onMounted(async() => {
      await getVerifyClearance()
      await getClearances()
      if(clear.value) clearance()
    })

    let checkClearance = ref(false)
    let clearance = async () => {
      if (autorisationVol.value.length === 0) {
        let i = 10; // Nombre de secondes à attendre
        const interval = setInterval(() => {
          getClearances();
          i--;
          if (i === 0 || autorisationVol.value.length > 0) {
            checkClearance.value = true
            clearInterval(interval); // Arrêter l'intervalle après 10 secondes
          }
        }, 1000);
      }
    }

    let getVerifyClearance = async () => {
      try {
        await api({
          method: 'get',
          url: '/autorisations',
          params: {
            mission_id: itemId.value,
          },
          headers: {
            'Authorization': `Basic ${token}`
          }
        }).then(async (res) => {
          clear.value = res.data
        })
      } catch (error) {
        console.log("error", error);
      }
    }

    let getClearances = async () => {
      try {
        await api({
          method: 'delete',
          url: '/autorisations/:id',
          params: {
            mission_id: itemId.value,
          },
          headers: {
            'Authorization': `Basic ${token}`
          }
        }).then(async (res) => {
          autorisationVol.value = res.data

          autorisationVol.value.forEach(element => {

            if ((element.validation_start && element.validation_end)) {

              element.validation_start = moment(element.validation_start).format("YYYY-MM-DDTHH:mm")
              element.validation_end = moment(element.validation_end).format("YYYY-MM-DDTHH:mm")

              const validationStart = new Date(element.validation_start);
              const validationEnd = new Date(element.validation_end);
              const now = new Date();

              // Format the expiration date as desired
              const expiredDate = moment(validationEnd);

              const expired = expiredDate.format('ddd DD MMM YY [à] HH:mm');
              // validité expirée
              if (validationEnd < now){
                const valid = `Expiré depuis le ${expired}`
                element.valid = valid
              }

              // la validité ne commence pas
              if (now < validationStart && now < validationEnd) {
                const round = Math.round((validationStart - now) / (1000 * 60 * 60 * 24));

                if (round === 0) {
                  const beginTime = validationStart.toISOString().split('T')[1].substring(0, 5);
                  const valid = `Commence aujourd'hui à ${beginTime}`;
                  element.valid = valid
                } else {
                  const valid = `Commence dans ${round} jours`;
                  element.valid = valid
                }
              }

              // En période de validité
              if (validationStart < now && now < validationEnd) {
                const round = Math.round((validationEnd - now) / (1000 * 60 * 60 * 24));

                if (round >= 1) {
                  const valid = `Il reste ${round} jours`;
                  element.valid = valid
                } else {
                  const endTime = validationEnd.toISOString().split('T')[1].substring(0, 5);
                  const valid = `Expiré aujourd'hui à ${endTime}`;
                  element.valid = valid
                }
              }
            }
          });
        })
      } catch (error) {
        console.log("error", error);
      }
    }

    watch(checkClearance, async(oldValue, newValue)=>{
      if(checkClearance.value && !autorisationVol.value.length){
        let findMission = () => {
          api({
            method: 'get',
            url: '/missions/:id',
            params: {
              id: itemId.value
            },
            headers: {
              'Authorization': `Basic ${token}`
            }
          }).then((response) => {
            if (response.data.state === 2) {
              stateUpdate.value = true
              clear.value = false
              $q.notify({
                type: 'positive',
                position: 'bottom',
                message: "Veuillez patienter un instant le temps de régénérer la mission."
              })
            }else {
              clearance()
            }
          }).catch( (err) => {
            console.log("err",err);
          })
        }
        findMission()
      }
      checkClearance.value = false
    })

    let changeCount = ref(0);
    watch(itemMission, (newValue, oldValue)=>{
      if (changeCount.value > 0) {
        if (itemMission.value.state === 2) {
          $q.notify({
            type: 'positive',
            position: 'bottom',
            message: "Mission régénérer avec succès."
          })
        }
      }
      changeCount.value++
    })

    watch(stateUpdate, async()=>{
      if (stateUpdate.value) {
        updateAutorisation.value = true
        await getClearances()
        stateUpdate.value = false
      }

      setTimeout(()=> {
        updateAutorisation.value = false
      }, 10000)
    })

    return {
      editRestriction,
      formData,
      autorisationVol,
      clear
    }
  }
})
</script>
