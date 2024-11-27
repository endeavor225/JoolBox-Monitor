<template>
  <q-card style="width: 700px; border-radius: 8px;">
    <q-card-section class="row items-center q-pb-none q-pt-none">
      <div class="text-h6 q-mt-md q-ml-md">Mise à jour de Box</div>
    </q-card-section>

    <q-card-section class="q-ma-sm" style="">
      <div class="row">
        <div class="col-4 flex flex-center">
          <q-img
            class=""
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
              <q-card-section class="text-subtitle1 q-pb-none">
                <q-input
                  filled
                  dense
                  class="q-mb-xs"
                  type="test"
                  label="Nom"
                  v-model="formData.name"
                  :rules="[
                    (val) => !!val || 'Ce champ est obligatoire',
                    (val) => val.length <= 25 || 'Veuillez utiliser 25 caractères maximum',
                  ]"
                >
                  <template v-slot:prepend>
                    <q-avatar square size="20px">
                      <img :src="formData.name ? 'drone_form_active.svg' : 'drone_form.svg' "/>
                    </q-avatar>
                  </template>
                </q-input>

                <q-input
                  filled
                  dense
                  type="number"
                  label="Rayon d'activité"
                  v-model="formData.radius_meter"
                  :rules="[
                    (val) => !!val || 'Ce champ est obligatoire',
                    (val) => val > 99 &&  val <= 1500 || 'Valeur doit être comprise entre 100 et 1500.',
                  ]"
                >
                  <template v-slot:prepend>
                    <q-avatar square size="20px">
                      <img :src="formData.radius_meter ? 'Rayon-Action-active.svg' : 'Rayon-Action.svg' "/>
                    </q-avatar>
                  </template>
                </q-input>

                <q-item-label class="text-secondary q-mb-md" caption style="font-size: 10px; text-align: right; margin-top: -18px;">
                  Valeur minimale autorisée 100m
                </q-item-label>

                <q-checkbox
                  dense
                  v-model="formData.activated"
                  color="teal"
                  size="sm"
                  style="font-size: 13px; position: relative; top: -10px"
                >
                  <span v-if="formData.activated">Box activée</span>
                  <span v-if="!formData.activated">Box désactivée</span>
                </q-checkbox>
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
                    <span class="text-weight-light">Oui, mettre à jour</span>
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
    infoRuche: {
      type: Object,
      default() {
        return {};
      },
    },
  },

  setup (props, {emit}) {
    const instance = getCurrentInstance()
    const $q = useQuasar()
    let formData = ref({})
    let modalEditRuche = inject("modalEditRuche")
    let alveoleAdding = inject("alveoleAdding")
    const submitting = ref(false)

    const token = $q.cookies.get('jool_auth_token')

    onMounted(async () => {
      formData.value = {...props.infoRuche}
    })

    let onSubmit = async () => {
      try {
        submitting.value = true
        await api({
          method: 'put',
          url: '/hives/:id',
          data: formData.value,
          headers: {
            'Authorization': `Basic ${token}`
          }
        }).then((res) =>{
          submitting.value = false
          modalEditRuche.value = false
          emit('refresh-hive', res.data[0].id);
        })
      } catch (error) {
        submitting.value = false
        console.log(error);
      }
    }
    return {
      onSubmit,
      formData,
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
