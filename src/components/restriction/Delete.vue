<template>
  <q-card class="card" :style="visibility">
    <q-card-section class="row items-center q-pb-none">
      <div class="text-h6 q-mt-md q-ml-md">Suppression d’une restriction</div>
    </q-card-section>

    <q-card-section class="q-ma-md" style="">
      <div class="row">
        <div class="col-4">
          <q-img
            src="Infos-2.svg"
            spinner-color="white"
            style="height: 140px; max-width: 150px"
          />
        </div>

        <div class="col-8">
          <q-card-section>
            Vous êtes sur le point de supprimer la restriction « <b>{{ itemDelete.name }}</b> ».
            <br>Voulez-vous continuer ?
          </q-card-section>

          <q-card-actions align="right">
            <div class="q-gutter-md">
              <q-btn
                color="black"
                outline
                no-caps
                style="border-radius: 5px; width: 100px;"
                padding="sm"
                unelevated
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
                @click="onSubmit()"
                :loading="submitting"
              >
                <span class="text-weight-light">Oui, Supprimer</span>
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

  <q-dialog
    v-model="notify"
    seamless
    transition-show="slide-up" transition-hide="slide-down"
  >
  <q-card style="width: 400px; border-radius: 15px; bottom: -35%;" >

    <q-card-section class="q-ma-sm" style="text-align: center; padding-top: 30px; padding-left: 50px; padding-right: 50px;">
      Vous avez supprimé la restriction « <b>Poteau électrique</b> » avec succès.
    </q-card-section>

    <q-card-actions align="center" class="text-teal q-pt-none q-pb-md">
      <q-btn label="OK" v-close-popup color="secondary" style="border-radius: 15px; width: 100px"/>
    </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { api } from "boot/axios";
import { useQuasar } from 'quasar';
import { defineComponent, getCurrentInstance, ref, onMounted, provide, inject } from "vue";

export default defineComponent({
  // name: 'ComponentName',
  components: {

  },

  props: {
    itemDelete: {
      default() {
        return {};
      },
    },
  },

  setup (props) {
    const $q = useQuasar()
    const token = $q.cookies.get('jool_auth_token')
    let notify = ref(false)
    provide("notify", notify)
    let deleteModal = inject("deleteModal")
    let deleteState = inject("deleteState")

    let visibility = ref()
    const submitting = ref(false)

    let onSubmit = async () => {
      submitting.value = true
      try {
        api({
          method: 'delete',
          url: '/restrictions/:id',
          params: {
            id : props.itemDelete.id
          },
          headers: {
            'Authorization': `Basic ${token}`
          }
        }).then(async (res) => {
          submitting.value = false
          visibility.value = "visibility:hidden"
          notify.value = true
          setTimeout(() =>{
            notify.value = false
            deleteModal.value = false
            deleteState.value = true
          }, 1000)
        })
      } catch (error) {
        console.log("error", error);
        submitting.value = false
      }
    }
    return {
      notify,
      onSubmit,
      visibility,
      submitting
    }
  }
})
</script>

<style scoped>
.card{
  width: 700px;
  border-radius: 8px;
}
  .notify {
    width: 400px;
    border-radius: 15px;
    bottom: -35%;
  }
</style>
