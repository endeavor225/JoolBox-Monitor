<template>
  <q-card style="width: 700px; border-radius: 8px;">
    <q-card-section class="row items-center q-pb-none">
      <div class="text-h6 q-mt-md q-ml-md text-negative">Confirmation !</div>
    </q-card-section>

    <q-card-section class="q-ma-md" style="">
      <div class="row">
        <div class="col-4">
          <q-img
            src="Infos-2.svg"
            spinner-color="white"
            style="height: 140px;"
          />
        </div>

        <div class="col-8">
          <q-card-section>
            Vous êtes sur le point de vous déconnecter. <br>
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
                <span class="text-weight-light">Oui, se connecter</span>
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
import { useRouter } from "vue-router";
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

  setup () {
    let instance = getCurrentInstance();
    const $q = useQuasar()
    const router = useRouter()
    const submitting = ref(false)

    let onSubmit = async () => {
      submitting.value = true
      $q.cookies.remove('jool_auth_token')
      $q.cookies.remove('date_auth')
      submitting.value = false
      router.push("/")
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
