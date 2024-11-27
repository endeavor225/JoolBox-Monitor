<template>
  <q-card style="width: 700px; border-radius: 8px;">
    <q-card-section class="row items-center q-pb-none">
      <div class="text-h6 q-mt-md q-ml-md">Confirmation de vol</div>
    </q-card-section>

    <q-card-section class="q-ma-md" style="">
      <div class="row">
        <div class="col-4">
          <q-img
            src="Infos-delete.svg"
            spinner-color="white"
            style="height: 135px;"
          />
        </div>

        <div class="col-8">
          <q-card-section>
            Vous êtes sur le point de demarrer un vol. <br>
            Voulez-vous continuer ?
          </q-card-section>

          <q-card-actions align="right">
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
                @click="onSubmit()"
                :loading="submitting"
              >
                <span class="text-weight-light">Oui, continuer</span>
                <template v-slot:loading>
                    <q-spinner-facebook />
                  </template>
              </q-btn>
            </div>
          </q-card-actions>
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
import { defineComponent, getCurrentInstance, ref, inject } from "vue";

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
    let confirmOcc = inject("confirmOcc")
    let notifyCreateOcc = inject("notifyCreateOcc")
    const submitting = ref(false)
    const token = $q.cookies.get('jool_auth_token')

    let onSubmit = async () => {
      submitting.value = true
      try {
        await api({
          method: 'post',
          url: '/occurrences',
          data: {
            pattern_id : props.mission_id
          },
          headers: {
            'Authorization': `Basic ${token}`
          }
        })
        .then(function (res) {
          notifyCreateOcc.value = true
          submitting.value = false
          confirmOcc.value = false

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
    return {
      onSubmit,
      submitting,
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
