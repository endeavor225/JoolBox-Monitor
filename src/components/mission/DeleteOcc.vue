<template>
  <q-card style="width: 700px; border-radius: 8px;">
    <q-card-section class="row items-center q-pb-none">
      <div class="text-h6 q-mt-md q-ml-md">Suppression d’un vol</div>
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
            Vous êtes sur le point de supprimer  <br> le vol <b>« n°{{ idOccu }} »</b>.
            Voulez-vous <br> continuer ?
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
                <span class="text-weight-light">Annuler</span>
              </q-btn>

              <q-btn
                color="secondary"
                class=""
                no-caps
                style="border-radius: 5px; width: 190px;  border: 1px solid #26A69A;"
                padding="sm"
                unelevated
                @click="onSubmit()"
              >
                <span class="text-weight-light">Oui, Supprimer</span>
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
import { defineComponent, getCurrentInstance, ref, onMounted, provide, inject } from "vue";

export default defineComponent({
  // name: 'ComponentName',
  components: {
  },

  props: {
    idOccu: {
      default() {
        return {};
      },
    },
  },

  setup (props, {emit}) {
    let instance = getCurrentInstance();
    const $q = useQuasar()
    let deleteModal = inject("deleteModal")
    let idOccu = ref(props.idOccu)
    let deleteOccurrence = inject("deleteOccurrence")
    const token = $q.cookies.get('jool_auth_token')

    let onSubmit = () => {
      try {
        api({
          method: 'delete',
          url: '/occurrences/:id',
          params: {
            id: idOccu.value
          },
          headers: {
            'Authorization': `Basic ${token}`
          }
        }).then(async (response) => {
          deleteOccurrence.value = true
          deleteModal.value = false
        }).catch( (err) => {
          console.log("err",err);
        })
      } catch (error) {
        console.log("err",err);
      }
    }
    return {
      onSubmit,
      idOccu
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
