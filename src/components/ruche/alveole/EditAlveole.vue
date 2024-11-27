<template>
  <q-card style="width: 700px; border-radius: 8px;">
    <q-card-section class="row items-center q-pb-none q-pt-none">
      <div class="text-h6 q-mt-md q-ml-md">Modification d'alvéole</div>
    </q-card-section>

    <q-card-section class="q-ma-sm" style="">
      <div class="row">
        <div class="col-4 flex flex-center">
          <q-img
            src="Infos.svg"
            spinner-color="white"
            style="height: 140px; max-width: 150px"
          />
        </div>
        <div class="col-8">
          <q-form
              ref="createForm"
              @submit="onSubmit"
            >
              <q-card-section class="text-subtitle1">
                <q-select
                  filled
                  dense
                  :options="droneType"
                  option-label="name"
                  option-value="id"
                  label="Type de drone"
                  v-model="formData.drone_type"
                  :rules="[ (val) => !!val || 'Champ obligatoire']"
                >
                  <template v-slot:prepend>
                    <q-avatar square size="15px">
                      <img :src="formData.drone_type ? 'date_iconActif.svg' : 'date_icon.svg' "/>
                    </q-avatar>
                  </template>
                </q-select>

                <q-select
                  filled
                  dense
                  :options="alveoleState"
                  option-label="name"
                  option-value="id"
                  label="Statut"
                  v-model="formData.state"
                  :rules="[ (val) => !!val || 'Champ obligatoire']"
                >
                  <template v-slot:prepend>
                    <q-avatar square size="15px">
                      <img :src="formData.state ? 'date_iconActif.svg' : 'date_icon.svg' "/>
                    </q-avatar>
                  </template>
                </q-select>
              </q-card-section>

              <q-card-actions align="right" class="q-pl-md justify-between">
                <div class="q-gutter-md">
                  <q-btn
                    color="black"
                    outline
                    no-caps
                    style="border-radius: 5px; width: 100px;"
                    padding="sm"
                    unelevated
                    type="reset"
                    v-close-popup
                  >
                    <span class="text-weight-light">Annuler</span>
                  </q-btn>

                  <q-btn
                    color="secondary"
                    class=""
                    no-caps
                    style="border-radius: 5px; width: 190px"
                    padding="sm"
                    unelevated
                    type="submit"
                    :loading="submitting"
                  >
                    <span class="text-weight-light">Valider</span>
                    <template v-slot:loading>
                      <q-spinner-facebook />
                    </template>
                  </q-btn>
                </div>
              </q-card-actions>
            </q-form>
        </div>

      </div>
    </q-card-section>

    <q-btn unelevated padding="none" color="negative" class="absolute-top-right" v-close-popup>
      <q-icon name="img:Close.svg" size="md" />
    </q-btn>
  </q-card>
</template>

<script>
import { api } from "boot/axios";
import { useQuasar } from 'quasar';
import { defineComponent, getCurrentInstance, ref, onMounted, inject } from "vue";
export default defineComponent({
  // name: 'ComponentName',

  props: {
    editeAlveolus: {
      type: Object,
      default() {
        return {};
      },
    },
  },

  setup (props) {
    const instance = getCurrentInstance()
    const $q = useQuasar()
    let formData = ref({})
    let editAlveole = inject("editAlveole")
    let alveoleUpdate = inject("alveoleUpdate")
    const submitting = ref(false)
    const droneType = ref([])
    const alveoleState = ref([])
    const token = $q.cookies.get('jool_auth_token')

    onMounted(async () => {
      await api({
        method: 'get',
        url: '/drone-types',
        headers: {
          'Authorization': `Basic ${token}`
        }
      }).then((res) => {
        droneType.value = res.data
        for (const iterator of res.data) {
          if (iterator.id === props.editeAlveolus.drone_type_id) {
            formData.value.drone_type = iterator
          }
        }
      })

      await api({
        method: 'get',
        url: '/alveole-state',
        headers: {
          'Authorization': `Basic ${token}`
        }
      }).then((res) => {
        alveoleState.value = res.data
        for (const iterator of res.data) {
          if (iterator.id === props.editeAlveolus.alveolus_state_id) {
            formData.value.state = iterator
          }
        }
      })
    })

    let onSubmit = async () => {
      try {
        formData.value.id = props.editeAlveolus.id
        submitting.value = true
        await api({
        method: 'put',
        url: '/alveoles/:id',
        data: formData.value,
        headers: {
          'Authorization': `Basic ${token}`
        }
      }).then((res) =>{
        submitting.value = false
        alveoleUpdate.value = true
        editAlveole.value = false
      })
      } catch (error) {
        submitting.value = false
        console.log(error);
      }
    }
    return {
      onSubmit,
      formData,
      droneType,
      alveoleState,
      submitting
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
