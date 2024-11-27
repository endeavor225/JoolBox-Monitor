<template>
  <div class="scroll" style="height: 165px;">
    <div v-for="item in autorisations" :key="item">
      <q-card-section v-if="item.altitude_allowed !== -1" class="q-ml-md q-mr-md q-mt-sm q-mb-md" style="background-color: rgba(85,170,160, 0.2); border-radius: 10px;">
        <div class="row q-col-gutter-ms">
          <div class="col-6">
            <span style="margin-right: 10px;" v-if="item.clearance_name === 'heli'">Héliport</span>
            <span style="margin-right: 10px;" v-else-if="item.clearance_name === 'building'">Immeuble</span>
            <span style="margin-right: 10px;" v-else>{{ item.clearance_name }}</span>
          </div>
          <div class="col-5">
            <span class="text-secondary" style="margin-right: 10px;">
              <q-icon name="img:Altitude.svg" size="14px" style="position: relative; top: -1px;"/>
              <b>{{ item.altitude_allowed }} m</b>
            </span>
          </div>
          <div class="col-1" style="position: relative; top: -4px;">
            <q-btn :disable="!permissions.update" unelevated flat padding="sm" color="primary" class="q-ma-nome" @click="onEditRestriction()">
              <q-icon name="img:Modifier.svg" size="14px" />
            </q-btn>
          </div>
        </div>

        <div class="row q-mt-sm q-pb-sm q-col-gutter-ms">
          <div class="col-6">
            <span style=" margin-right: 10px;">
              <span style="font-size: 11px;" class="text-weight-light">configuré par </span>
              <span>{{ item.firstname }} {{ item.lastname }}</span>
            </span>
          </div>
          <div class="col-5">
            <span v-if="item.validation_end && item.validation_start" style="margin-right: 10px;">
              {{ item.valid }}
            </span>
          </div>
          <div class="col-1">
            <q-btn unelevated flat padding="sm" color="primary" class="q-ma-nome" disable>
              <q-icon name="img:delete-red.svg" size="14px" />
            </q-btn>
          </div>
        </div>
      </q-card-section>

      <q-card-section v-else class="q-mr-md q-ml-md q-pb-sm q-mb-sm" style="background-color: rgba(85,170,160, 0.2); border-radius: 10px;">
        <div class="">
          <span v-if="item.clearance_name === 'heli'">Héliport</span>
          <span v-else-if="item.clearance_name === 'building'">Immeuble</span>
          <span v-else>{{ item.clearance_name }}</span>

          <span v-if="item.firstname !== null && item.lastname !== null">
            <span style="font-size: 11px;" class="text-weight-light q-ml-md">
              Configuré par
            </span>
            <span>{{ item.firstname }} {{ item.lastname }}</span>
          </span>
        </div>

        <q-form
          ref="formRefs"
          @submit.prevent="onSubmit"
        >
          <div class="row q-gutter-x-sm">
            <div class="col">
              <q-input
                filled
                dense
                class="q-mb-sm"
                type="number"
                placeholder="Altitude"
                v-model="item.altitude"
                bg-color="white"
                :rules="[
                  (val) => !!val || 'Ce champ est obligatoire',
                  (val) => val > 29 && val <= 120 || 'Valeur non autorisée',
                ]"
              >
                <template v-slot:prepend>
                  <q-avatar square size="15px">
                    <img :src="item.altitude ? 'Altitude.svg' : 'Altitude-dark.svg' "/>
                  </q-avatar>
                </template>

                <template v-slot:append>
                  <span style="font-size: 14px;">123</span>
                </template>
              </q-input>
            </div>
          </div>
          <div class="row q-gutter-x-sm" style="margin-top: -20px;">
            <div class="col">
              <q-input
                filled
                dense
                class="q-mb-sm"
                type="datetime-local"
                label="Début de validité"
                v-model="item.validation_start"
                bg-color="white"
              >
                <template v-slot:prepend>
                  <q-avatar square size="15px">
                    <img :src="item.validation_start ? 'date_iconActif.svg' : 'date_icon.svg' "/>
                  </q-avatar>
                </template>
              </q-input>
              <q-item-label caption style="font-size: 10px; margin-top: -5px;">Champ facultatif</q-item-label>
            </div>
            <div class="col">
              <q-input
                filled
                dense
                class="q-mb-sm"
                type="datetime-local"
                label="Fin de validité"
                v-model="item.validation_end"
                bg-color="white"
              >
                <template v-slot:prepend>
                  <q-avatar square size="15px">
                    <img :src="item.validation_end ? 'date_iconActif.svg' : 'date_icon.svg'"/>
                  </q-avatar>
                </template>
              </q-input>
              <q-item-label caption style="font-size: 10px; margin-top: -5px;">Champ facultatif</q-item-label>
            </div>
          </div>
        </q-form>
      </q-card-section>
    </div>
  </div>

  <q-card-actions class="q-ml-sm q-mr-sm">
    <q-btn
      type="submit"
      class="full-width"
      label="Valider et régénérer"
      color="primary"
      padding="sm"
      unelevated
      no-caps
      @click="onSubmit"
      :loading="submitting"
      :disable="!updateTrue || !permissions.update"
    >
      <template v-slot:loading>
        <q-spinner-facebook />
      </template>
    </q-btn>
  </q-card-actions>
</template>

<script>
import { api } from "boot/axios";
import { useQuasar } from 'quasar';
import { defineComponent, getCurrentInstance, ref, onMounted, onBeforeMount, watch, inject } from "vue";

export default defineComponent({
  // name: 'ComponentName',

  props: {
    autorisations: {
      type: Array,
      required: true
    },
  },

  setup (props, {emit}) {
    const instance = getCurrentInstance()
    const $q = useQuasar()
    const token = $q.cookies.get('jool_auth_token')
    let formData = ref({})
    const formRefs = ref([]);
    let stateUpdate = inject("stateUpdate")
    const submitting = ref(false)
    let itemMission = inject("itemMission")

    props.autorisations.forEach((element) => {
      element.altitude = null;
    });

    const actions = ref(["read", "create", "update", "delete"]);
    const permissions = ref({});

    onBeforeMount(async ()=> {
      for (const action of actions.value) {
        await checkPermission(action);
      }
    })

    onMounted(async ()=> {})

    let checkPermission = async (action) => {
      api({
        method: 'get',
        url: '/permissions',
        params: {
          action,
          service: "Autorisation"
        },
        headers: {
          'Authorization': `Basic ${token}`
        }
      }).then((res)=> {
        permissions.value[action] = res.data
      })
    }

    // Verification pour voir si les autorisation doivent être valider
    let updateTrue = ref(false);
    updateTrue.value = props.autorisations.every((element) => element.altitude_allowed === -1);

    let onEditRestriction = async () => {
      props.autorisations.forEach((element) => {
        if(element.altitude_allowed !== -1) {
          let old = element.altitude_allowed
          element.altitude_allowed = -1
          element.altitude = old
        }
      });
      updateTrue.value = true
    }

    let onSubmit = () => {

      submitting.value = true
      try {
        const refsValide = formRefs.value.map((ref) => {
          return ref.validate();
        });

        Promise.all(refsValide)
        .then(async (refs) => {
          const allTrue = refs.every((element) => {
            return element === true
          })
          if (!allTrue) {
            $q.notify({
              type: 'negative',
              position: 'bottom',
              message: "Veuillez remplir tous les champs obligatoires"
            })
            submitting.value = false
            return;
          }

          try {
            await api({
              method: 'PUT',
              url: '/autorisations/:id',
              data: props.autorisations,
              headers: {
                'Authorization': `Basic ${token}`
              }
            }).then(async (res) => {
              emit('state-update', /* arguments de l'événement */);
              $q.notify({
                type: 'positive',
                position: 'bottom',
                message: "Veuillez patienter un instant le temps de régénérer la mission."
              })
            })

            stateUpdate.value = true
            submitting.value = false
            updateTrue.value = false
            //updateMissionElement()
          } catch (error) {
            submitting.value = false
            if (error.response.status === 403) {
              $q.notify({
                type: 'negative',
                position: 'bottom',
                message: "Vous n'êtes pas autorisé a régénérer cette mission"
              })
            }
          }
        })
      } catch (error) {
        submitting.value = false
        console.log(error);
      }
    }

    let updateMission = async (id) => {
      try {
        await api({
          method: 'PUT',
          url: '/missions/:id',
          data: {
            id: id
          },
          headers: {
            'Authorization': `Basic ${token}`
          }
        })
      } catch (error) {
        console.log("error", error);
      }
    }

    let updateMissionElement = async () => {
      try {
        await api({
          method: 'DELETE',
          url: '/mission-element/:id',
          headers: {
            'Authorization': `Basic ${token}`
          }
        })
      } catch (error) {
        console.log("error", error);
      }
    }

    watch(itemMission, (newValue, oldValue)=>{
      console.log("🚀 ~ watch ~  newValue, oldValue:",  newValue, oldValue)
      if (itemMission.value.state === 2) {
        $q.notify({
          type: 'positive',
          position: 'bottom',
          message: "Mission régénérer avec succès."
        })
      }

      if (itemMission.value.state === 3) {
        $q.notify({
          type: 'negative',
          position: 'bottom',
          message: "Une erreur s'est produite durant la régénération de la mission."
        })
      }
    })

    return {
      onEditRestriction,
      formData,
      formRefs,
      onSubmit,
      updateTrue,
      submitting,
      permissions,
    }
  }
})
</script>
