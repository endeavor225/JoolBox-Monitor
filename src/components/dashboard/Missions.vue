<template>
  <q-card flat style="border-radius: 10px; min-height: 520px;" class="q-pa-sm">
    <q-card-section class="row">

      <div class="col-md-4 q-pt-sm q-pa-sm">
        <div style="border-left: 2px solid #55AAA0">
          <span class="text-primary text-subtitle2 q-pl-sm" style="font-size: 18px; position: relative; top: 2px;">
            Missions
          </span>
        </div>
      </div>
      <q-space />
      <div class="row justify-end col-md-8" style="text-align: right;">
        <div class="col-md-5" style="position: relative; top: 1px;">
          <q-input
            placeholder="Chercher une mission"
            dense
            standout
            class="q-pa-sm"
            input-style="color: #616161"
            bg-color="white"
            v-model="search"
          >
            <template v-slot:append>
              <q-icon name="search" color="grey-7" />
            </template>
          </q-input>
        </div>

        <div v-if="permissions.create" class="col-md-4 q-mt-sm q-pr-sm q-ml-lg">
          <q-btn
            color="secondary"
            class="full-width"
            no-caps
            style="border-radius: 5px; padding: 9px;"
            padding="sm"
            size="md"
            unelevated
            @click="$router.push('create-mission')"
          >
            <q-icon name="img:Add.svg" class="q-pr-sm" style="font-size: 8px;"/>
            <span class="text-weight-regular">Nouvelle mission</span>
          </q-btn>
        </div>
      </div>
    </q-card-section>

    <q-card-section class="row scroll" style="height: 360px" v-if="items.length">
      <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3 q-pa-sm" v-for="item in items" :key="item.id" >
        <q-card flat class="bg-grey-body" style="background-color: #F7F7F7; border-radius: 10px; height: 145px;">
          <q-card-section class="q-pa-xs">
            <q-item>
              <q-item-section>
                <q-item-label lines="1" class="text-subtitle1">{{ item.name }} ({{ item.id }})</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label caption style="font-size: 10px;">Type</q-item-label>
                <q-item-label v-if="item.type == 1">Surface</q-item-label>
                <q-item-label v-if="item.type == 3">Lineaire</q-item-label>

                <q-item-label caption style="font-size: 10px;">Ruche</q-item-label>
                <q-item-label v-if="item.return_hive">{{ item.return_hive }}</q-item-label>
                <q-item-label v-else>Aucune</q-item-label>
              </q-item-section>

              <q-item-section>
                <q-item-label caption style="font-size: 10px;">Etat</q-item-label>
                <q-item-label v-if="item.state == 1">En attente</q-item-label>
                <q-item-label v-if="item.state == 2">Valider</q-item-label>
                <q-item-label v-if="item.state == 3">Rejeter</q-item-label>

                <q-item-label caption style="font-size: 10px;">Durée</q-item-label>
                <q-item-label v-if="item.duration.minutes || item.duration.seconds">
                  <span v-if="item.duration.minutes">{{ item.duration.minutes }}min </span>
                  <span v-if="item.duration.seconds">{{ item.duration.seconds }}s</span>
                </q-item-label>
                <q-item-label v-else>Non défini</q-item-label>
              </q-item-section>
            </q-item>
          </q-card-section>

          <q-card-section class="q-pa-none absolute-right">
            <q-btn unelevated padding="sm" color="primary" class="q-ma-nome" @click="onShowMission(item)" style="border-radius: 0 10px 0 0;">
              <q-icon name="img:Details.svg" size="xs" />
            </q-btn>
          </q-card-section>
        </q-card>
      </div>
    </q-card-section>

    <q-card-section class="row scroll" style="height: 360px" v-if="!items.length && loadingData">
      <div class="col-xs-12 col-md-3 col-sm-6 col-lg-3 q-pa-sm" v-for="item in 8" :key="item" >
        <q-card flat class="bg-grey-body" style="background-color: #F7F7F7; border-radius: 10px; height: 145px;">
          <q-card-section class="q-pa-xs">
            <q-item>
              <q-item-section avatar>
                <q-skeleton type="QAvatar" animation="fade" />
              </q-item-section>
              <q-item-section>
                <q-item-label>
                  <q-skeleton type="text" animation="fade" />
                </q-item-label>
                <q-item-label caption>
                  <q-skeleton type="text" animation="fade" />
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-skeleton height="65px" square animation="fade" />
          </q-card-section>
        </q-card>
      </div>
    </q-card-section>

    <q-card-section style="height: 360px" v-if="!items.length && !loadingData">
      <div class="text-body1" style="margin-top: 150px; opacity: 0.4; text-align: center;">
        Aucune mission !
      </div>
    </q-card-section>

    <q-card-actions class="q-mr-md" align="right">
      <q-pagination
        v-model="current"
        direction-links
        flat
        color="secondary"
        active-color="primary"
        :max="mission_total%paginate != 0 ? (mission_total/paginate)+1 : (mission_total/paginate)"
        :max-pages="7"
        :boundary-numbers="false"
      >
      </q-pagination>
    </q-card-actions>
  </q-card>
</template>

<script>
import { api } from "boot/axios";
import { useQuasar } from 'quasar'
import { useRouter } from "vue-router"
import { defineComponent, getCurrentInstance, ref, onMounted, onBeforeMount, watch } from "vue";
export default defineComponent({
  // name: 'ComponentName',
  setup () {
    const instance = getCurrentInstance()
    const $q = useQuasar()
    const router = useRouter()
    const token = $q.cookies.get('jool_auth_token')
    let missions = ref([])
    let items = ref([])
    let missionSearch = ref([])
    let offset = ref(0)
    const paginate = 8
    let search = ref('')
    let current = ref(1)
    let mission_total = ref()
    const loadingData = ref(true)

    const actions = ref(["read", "create", "update", "delete"]);
    const permissions = ref({});

    onBeforeMount(async() => {
      for (const action of actions.value) {
        await checkPermission(action);
      }
      await getMission()
    })

    let checkPermission = async (action) => {
       api({
        method: 'get',
        url: '/permissions',
        params: {
          action,
          service: "Mission"
        },
        headers: {
          'Authorization': `Basic ${token}`
        }
      }).then((res)=> {
        permissions.value[action] = res.data
      })
    }

    let getMission = async () => {
      await api({
        method: 'get',
        url: '/missions',
        headers: {
          'Authorization': `Basic ${token}`
        }
      }).then( async (response) => {
        missions.value = [...response.data]
        mission_total.value = missions.value.length
        items.value = missions.value.slice(offset.value, offset.value + paginate)
        loadingData.value = false
      }).catch( (err) => {
        console.log("err",err);
      })
    }

    watch(current, async(newValue, oldValue) => {
      if (search.value) {
        offset.value = (newValue - 1) * paginate
        items.value = missionSearch.value.slice(offset.value, offset.value + paginate)
      } else {
        offset.value = (newValue - 1) * paginate
        items.value = missions.value.slice(offset.value, offset.value + paginate)
      }
    })

    watch(search, async () => {
      const needle = search.value.toLowerCase()
      missionSearch.value = missions.value.filter((v) => v.name.toLowerCase().indexOf(needle) > -1)
      mission_total.value = missionSearch.value.length
      items.value = missionSearch.value.slice(offset.value, offset.value + paginate)
    });

    let onShowMission = async (item) => {
      localStorage.setItem('mission', item.id)
      router.push('detail-mission')
    }

    return {
      missions,
      offset,
      paginate,
      search,
      onShowMission,
      items,
      mission_total,
      current,
      loadingData,
      permissions
    }
  }
})
</script>
<style scoped>

</style>
