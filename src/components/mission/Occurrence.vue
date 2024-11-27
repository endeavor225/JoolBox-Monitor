<template>
  <q-card-section class="q-mt-none ">
    <div class="q-pa-none" >
      <q-list class="rounded-borders text-primary">
        <q-item style="background-color: #2F8577; font-size: 12px;" class="text-white ">
          <q-item-section>Identifiant</q-item-section>
          <q-item-section>État</q-item-section>
          <q-item-section>Programmé le</q-item-section>
          <q-item-section>Programmé par</q-item-section>
          <q-item-section>Décoller</q-item-section>
          <q-item-section>Temps de vol</q-item-section>
          <q-item-section>Média</q-item-section>
          <q-item-section style="text-align: right;">Supprimer</q-item-section>
        </q-item>
        <q-separator size="5px" color="white"/>

        <div class="scroll" style="height: 290px;background-color: #f7f7f7;">
          <div v-if="item_occ.length" v-for="item in item_occ" :key="item.id" style="font-size: 12px;">
            <q-item class="text-black text-weight-light"
              :active="occurrenceSelect === item"
              active-class="my-menu-link"
            >
              <q-item-section>{{ item.id }}</q-item-section>
              <q-item-section>{{ item.mission_occurrence_state_name }}</q-item-section>
              <q-item-section>
                {{ $formatDate(item.request_time) }} <br>
                à {{ $tempsFormat(item.request_time) }}
              </q-item-section>
              <q-item-section>{{ item.first_name }} {{ item.last_name }}</q-item-section>
              <q-item-section>
                <span v-if="item.takeoff_time">
                  {{ $formatDate(item.takeoff_time) }} <br>
                  à {{ $tempsFormat(item.takeoff_time) }}
                </span>
              </q-item-section>
              <q-item-section>
                <span v-if="item.flighttime">
                  <span v-if="item.flighttime.minutes">
                    {{ item.flighttime.minutes }}m
                  </span>
                  <span v-if="item.flighttime.seconds">
                    {{ item.flighttime.seconds }}s
                  </span>
                </span>
              </q-item-section>
              <q-item-section v-if="!item.medias.length">
                <div >
                  Aucun
                </div>
              </q-item-section>
              <q-item-section v-else @click="occurrenceSelect = item" clickable class="cursor-pointer" style="">
                <div class="row" >
                  <div v-if="item.medias.length === 1">
                    <div v-if="item.medias[0].media_type === 'video'">
                      <q-icon name="img:fleche_droite.svg" size="20px" style="position: relative; top: -1px;"/>
                      <span class="q-pl-xs text-primary">Vidéo</span>
                    </div>
                    <div v-if="item.medias[0].media_type === 'flux'" class="btn-visionner" :url="item.medias[0].media_url">
                      <q-icon name="img:live_border.svg" size="20px" style="position: relative; top: -1px;"/>
                      <span class="q-pl-xs text-primary">Visionner</span>
                    </div>
                  </div>
                  <div v-else>
                    <q-icon name="img:fleche_droite.svg" size="20px" style="position: relative; top: -1px;"/>
                    <span class="q-pl-xs text-primary">Vidéo</span>
                  </div>
                </div>
              </q-item-section>
              <q-item-section >
                <div style="text-align: right;" v-if="item.mission_occurrence_state_name == 'scheduled'">
                  <q-btn :disable="!permissions.delete" unelevated flat padding="sm" color="primary" class="q-ma-nome" @click="ondeleteOcc(item)">
                    <q-icon name="img:delete-red.svg" size="14px" />
                  </q-btn>
                </div>
              </q-item-section>
            </q-item>
            <q-separator size="6px" color="white"/>
          </div>

          <div v-if="!item_occ.length && loadingOccuData" v-for="item in 5" :key="item">
            <q-item>
              <q-item-section class="">
                <q-item-label>
                  <q-skeleton type="text"/>
                </q-item-label>
                <q-item-label caption>
                  <q-skeleton type="text" width="80%" />
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-separator size="7px" color="white"/>
          </div>

          <div v-if="!item_occ.length && !loadingOccuData">
            <div class="text-body1 text-black" style="margin-top: 120px; opacity: 0.4; text-align: center;">
              Aucune occurrence de la mission!
            </div>
        </div>
        </div>
      </q-list>
    </div>
  </q-card-section>

  <q-card-section class="q-mr-md q-ml-md flex justify-end absolute-bottom">
    <q-pagination
      v-model="current"
      direction-links
      flat
      color="secondary"
      active-color="primary"
      :max="occ_total%paginate != 0 ? (occ_total/paginate)+1 : (occ_total/paginate)"
      :max-pages="paginate"
      :boundary-numbers="false"
    >
    </q-pagination>
  </q-card-section>

  <q-dialog
    v-model="deleteModal"
    transition-show="slide-down" transition-hide="slide-up"
  >
    <DeleteOccurrence :idOccu="delete_occu"/>
  </q-dialog>
</template>

<script>
import { useQuasar } from 'quasar';
import { defineComponent, getCurrentInstance, ref, inject, provide, } from "vue";
import DeleteOccurrence from "components/mission/DeleteOcc.vue"
export default defineComponent({
  //name: "Resumes",

  components: {
    DeleteOccurrence,
  },

  setup() {
    const instance = getCurrentInstance()
    const $q = useQuasar()
    const token = $q.cookies.get('jool_auth_token')
    let occurrenceSelect = inject("occurrenceSelect")
    let itemMission = inject("itemMission")
    let user = inject("user")
    let hive = inject("hive")
    let deleteModal = ref(false)
    provide("deleteModal", deleteModal)
    let programModal = ref(false)
    provide("programModal", programModal)
    let occ_total = inject("occ_total")
    let current = inject("current")
    let delete_occu = ref()
    let item_occ = inject("item_occ")
    const paginate = inject("paginate")
    let loadingOccuData = inject("loadingOccuData")
    let permissions = inject("permissions")

    let ondeleteOcc = async (item) => {
      deleteModal.value = true
      delete_occu.value = item.id
    }

    return {
      occurrenceSelect,
      itemMission,
      user,
      hive,
      ondeleteOcc,
      deleteModal,
      delete_occu,
      programModal,
      occ_total,
      current,
      item_occ,
      paginate,
      loadingOccuData,
      permissions
    };
  },
});
</script>
<style scoped>
.my-menu-link{
  color: white;
  /* background: #AFDED6 */
}
</style>
