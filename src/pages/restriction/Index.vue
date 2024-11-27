<template>
  <q-page class="q-pa-sm" style="background-color: #efefef">
    <div class="q-pa-sm">
      <div class="row no-wrap items-center q-pa-sm">
        <div style="border-left: 2px solid #55AAA0">
          <span class="q-pl-sm text-primary text-subtitle2" style="font-size: 18px; position: relative; top: 2px;">
            Restrictions
          </span>
        </div>

        <q-space />

        <q-input
          v-model="search"
          placeholder="Chercher une restriction"
          dense
          standout
          class="q-pa-sm"
          input-style="color: #616161"
          bg-color="white"
          style="width: 400px;"
        >
          <template v-slot:append>
            <q-icon name="search" color="grey-7" />
          </template>
        </q-input>

        <q-btn
          v-if="permissions.create"
          color="secondary"
          class=""
          no-caps
          style="border-radius: 5px; padding: 8px; width: 250px;"
          padding=""
          size="ms"
          unelevated
          @click="$router.push('create-restriction')"
        >
          <q-icon name="img:Add.svg" class="q-pr-sm" style="font-size: 8px;"/>
          <span class="text-weight-regular">Ajouter restriction</span>
        </q-btn>
      </div>
    </div>

    <div class="row q-gutter-y-md q-pl-md q-pr-md" style="margin-top: 5px;">
      <div class="col-xs-12 col-sm-12 col-md-5 col-lg-5 ">
        <q-card flat style="border-radius: 15px; height: 670px;" >

          <q-card-section class="text-subtitle1 q-ml-sm q-pb-sm">
            Restrictions
          </q-card-section>

          <q-card-section style="height: 570px;" class="scroll q-pt-none" v-if="items.length">
            <div class="row">
              <div class="col-md-6 col-sm-6 col-lg-6 q-pa-sm" v-for="item in items" :key="item">
                <q-card flat class="bg-grey-body" style="height: 122px; background-color: #F7F7F7; border-radius: 10px">
                  <q-card-section class="q-pa-xs">
                    <q-item>
                      <q-item-section>
                        <q-item-label>
                          <span class="text-weight-light" style="font-size: 10px;">id</span>
                          <span class="q-pl-xs text-secondary"> {{ item[1][0].id }}</span>
                        </q-item-label>
                      </q-item-section>
                    </q-item>

                    <q-item style="padding-bottom: 40px;">
                      <q-item-section>
                        <q-item-label class="text-weight-light"> {{ item[1][0].name }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-card-section>

                  <q-card-section class="q-pa-none absolute-bottom-right">
                    <q-btn-group unelevated style="border-radius: 0 0px 10px 0;">
                      <q-btn v-if="permissions.delete" padding="sm" color="primary" class="q-ma-nome" @click="onDelete(item)">
                        <q-icon name="img:Delete.svg" size="xs" />
                      </q-btn>
                      <q-btn padding="sm" color="primary" class="q-ma-nome" @click="onSelect(item)">
                        <q-icon name="img:Details.svg" size="xs" />
                      </q-btn>
                    </q-btn-group>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </q-card-section>

          <q-card-section style="height: 570px;" class="scroll q-pt-none" v-if="!items.length && loadingData">
            <div class="row">
              <div class="col-md-6 col-sm-6 col-lg-6 q-pa-sm" v-for="item in 8" :key="item">
                <q-card flat class="bg-grey-body" style="height: 122px; background-color: #F7F7F7; border-radius: 10px">
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

                    <q-skeleton height="40px" square animation="fade" />
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </q-card-section>

          <q-card-section style="height: 570px;" v-if="!items.length && !loadingData">
            <div class="text-body1" style="margin-top: 270px; opacity: 0.4; text-align: center;">
              Aucune restriction !
            </div>
          </q-card-section>

          <q-card-actions class=" absolute-bottom q-mr-md q-mb-sm" align="right">
            <q-pagination
              v-model="current"
              direction-links
              flat
              color="secondary"
              active-color="primary"
              :max="restriction_total%paginate != 0 ? (restriction_total/paginate)+1 : (restriction_total/paginate)"
              :max-pages="5"
              :boundary-numbers="false"
            >
            </q-pagination>
          </q-card-actions>
        </q-card>
      </div>

      <div class="col-xs-12 col-sm-12 col-md-7 col-lg-7 q-pl-md">
        <q-card flat style="border-radius: 15px; min-height: 670px;" class="q-pa-md">

          <div id="mapid" class="q-pa-md"> </div>

          <q-card-section class="q-pa-none q-mt-lg">
            <div class="row">
              <div class="q-col-gutter-x-lg">
                <q-toggle
                  size="sm"
                  v-model="zones.zoneR"
                  checked-icon="check"
                  color="green"
                >
                  <span class="text-weight-light" style="font-size: 13px;" >Zone R</span> <q-icon name="img:Zone/zoneR.svg" size="18px" style="top: -1px;"/>
                </q-toggle>

                <q-toggle
                  size="sm"
                  v-model="zones.zoneP"
                  checked-icon="check"
                  color="green"
                >
                  <span class="text-weight-light" style="font-size: 13px;" >Zonz P</span> <q-icon name="img:Zone/zoneP.svg" size="18px" style="top: -1px;"/>
                </q-toggle>

                <q-toggle
                  size="sm"
                  v-model="zones.zoneD"
                  checked-icon="check"
                  color="green"
                >
                  <span class="text-weight-light" style="font-size: 13px;" >Zone D</span> <q-icon name="img:Zone/zoneD.svg" size="18px" style="top: -1px;"/>
                </q-toggle>

                <q-toggle
                  size="sm"
                  v-model="zones.aerodrome"
                  checked-icon="check"
                  color="green"
                >
                  <span class="text-weight-light" style="font-size: 13px;" >Aérodrome</span>  <q-icon name="img:Zone/aerodrome.svg" size="18px" style="top: -1px;"/>
                </q-toggle>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>

  <q-dialog
    v-model="deleteModal"
    transition-show="slide-down" transition-hide="slide-up"
  >
    <DeleteRestriction :itemDelete="deleteItem"/>
  </q-dialog>
</template>

<script>
import { api } from "boot/axios";
import lodash from "lodash";
import { useQuasar } from 'quasar';
import { useRouter } from "vue-router"
import { defineComponent, getCurrentInstance, ref, onMounted, onBeforeMount, provide, watch } from "vue";
import DeleteRestriction from "components/restriction/Delete.vue"
export default defineComponent({
  name: "Restriction",
  components: {
    DeleteRestriction
  },

  setup() {
    const instance = getCurrentInstance()
    const router = useRouter()
    const $q = useQuasar()
    let mymap;
    var layerGroup = ref(L.layerGroup())
    let formData = ref({})
    const restricts = [];
    let zones = ref({
      zoneP : false,
      zoneR : false,
      aerodrome : false,
      zoneD : false,
    })
    let current = ref(1)
    let offset = ref(0)
    const paginate = 8
    let search = ref()
    let deleteModal = ref(false)
    provide("deleteModal", deleteModal)
    let deleteState = ref(false)
    provide("deleteState", deleteState)
    let deleteItem = ref()

    let restrictions = ref([])
    let items = ref([])
    let restrictionSearch = ref([])
    let restriction_total = ref()
    let newRestrictionID = localStorage.getItem('restriction')

    let initialCoords = ref({
      lat : 7.674076,
      lng: -5.580024,
      zoom: 7
    })
    const loadingData = ref(true)

    const actions = ref(["read", "create", "update", "delete"]);
    const permissions = ref({});

    const token = $q.cookies.get('jool_auth_token')
    if(!token) router.push('/')

    onBeforeMount(async()=> {
      for (const action of actions.value) {
        await checkPermission(action);
      }
    })

    let checkPermission = async (action) => {
       api({
        method: 'get',
        url: '/permissions',
        params: {
          action,
          service: "Restriction"
        },
        headers: {
          'Authorization': `Basic ${token}`
        }
      }).then((res)=> {
        permissions.value[action] = res.data
      })
    }

    onMounted (async () => {
      let Jawg_Streets = L.tileLayer('https://{s}.tile.jawg.io/jawg-streets/{z}/{x}/{y}{r}.png?access-token={accessToken}', {
        attribution: '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        minZoom: 6,
        maxZoom: 20,
        subdomains: 'abcd',
        accessToken: 'AGp14tTUsm2DI0ue1gVxtLtiLIYD3AgyKCFmntlM5d0PYbaC4q1s3QP25vnQl0Vz'
      })

      let googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
        minZoom: 6,
        maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3']
      });

      let googleHybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',{
        minZoom: 6,
        maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3']
      });

      //Affichage de la map
      mymap = L.map('mapid', {
        layers: [Jawg_Streets],
      }).setView([initialCoords.value.lat, initialCoords.value.lng], initialCoords.value.zoom);

      mymap.addLayer(layerGroup.value);
      async function onLocationFound(e) {}

      var baseLayers = {
        "Jawg Streets": Jawg_Streets,
        "Google Streets": googleStreets,
        "Google Hybrid": googleHybrid,
      };
      L.control.layers(baseLayers).addTo(mymap);

      mymap.locate({});
      mymap.on("locationfound", onLocationFound);

      // Après création d'une nouvelle restriction
      if (newRestrictionID && newRestrictionID != null) {
        await api({
          method: 'get',
          url: '/restrictions/:id',
          params: {
            id: newRestrictionID
          },
          headers: {
            'Authorization': `Basic ${token}`
          }
        }).then((res)=>{
          layerGroup.value.clearLayers()
          let area = []
          for (const item of res.data) {
            area.push([item.lat, item.lon])
          }
          let restrict = L.polygon(area, {color: 'red'}).bindPopup(`<b>${res.data[0].name}</b> avec altitude minimun: ${res.data[0].altitude_inf}m et altitude maximun: ${res.data[0].altitude_sup}m`)
          layerGroup.value.addLayer(restrict)
          mymap.fitBounds(restrict.getBounds(),{animate: true});
          localStorage.removeItem('restriction');
        })
      }
      await getRestriction()
    })

    let onSelect = (item) => {
      let area = []
      for (const interator of item[1]) {
        area.push([interator.lat, interator.lon])
      }

      let restrict = L.polygon(area, { opacity: 0, fillOpacity: 0 })
      .bindPopup(`<b>${item[1][0].name}</b>, altitude minimun: ${item[1][0].altitude_inf}m et altitude maximun: ${item[1][0].altitude_sup}m`)
      mymap.addLayer(restrict);
      restrict.openPopup();

      mymap.fitBounds(L.polygon(area, {opacity: 0, fillOpacity: 0 }).getBounds(),{animate: true,});
    }

    let onDelete = (item) => {
      deleteItem.value = item[1][0]
      deleteModal.value = true
    }

    /* Fonction permettant de récuperer les restrictions */
    let getRestriction = async () => {
      try {
        await api({
          method: 'get',
          url: '/restrictions',
          headers: {
            'Authorization': `Basic ${token}`
          }
        }).then(async (res) => {
          let restrictionsTab = ref(res.data);
          restrictionsTab.value = lodash.groupBy(
            restrictionsTab.value,
            (params) => params.id
          )
          restrictions.value = Object.entries(restrictionsTab.value)
          restrictions.value = restrictions.value.reverse()
          items.value = restrictions.value.slice(0, paginate)
          loadingData.value = false
          restriction_total.value = restrictions.value.length

          for (const iterator of restrictions.value) {
            let area = []
            for (const item of iterator[1]) {
              area.push([item.lat, item.lon])
            }
            const restrict = L.polygon(area, {color: 'red'}).bindPopup(`<b>${iterator[1][0].name}</b> avec altitude minimun: ${iterator[1][0].altitude_inf}m et altitude maximun: ${iterator[1][0].altitude_sup}m`)
            restricts.push(restrict);
            zones.value.zoneR = true
          }

        })
      } catch (error) {
        console.log("error", error);
      }
    }

    watch(() => zones.value.zoneR, async(newValue, oldValue) => {
      if (zones.value.zoneR) {
        restricts.forEach((restrict) => {
          layerGroup.value.addLayer(restrict);
        });
      } else {
        restricts.forEach((restrict) => {
          layerGroup.value.removeLayer(restrict);
        });
      }
    });

    watch(current, async(newValue, oldValue) => {
      if (search.value) {
        offset.value = (newValue - 1) * paginate
        items.value = restrictionSearch.value.slice(offset.value, offset.value + paginate)
      } else {
        offset.value = (newValue - 1) * paginate
        items.value = restrictions.value.slice(offset.value, offset.value + paginate)
      }
    })

    watch(search, async () => {
      const needle = search.value.toLowerCase()
      restrictionSearch.value = restrictions.value.filter((v) => v[1][0].name.toLowerCase().indexOf(needle) > -1)
      items.value = restrictionSearch.value.slice(offset.value, offset.value + paginate)
      restriction_total.value = restrictionSearch.value.length
    })

    /* Pour actualiser la liste après supression */
    watch(deleteState, async() => {
      if (deleteState.value) {
        layerGroup.value.clearLayers()
        await getRestriction()
        mymap.setView([7.674076, -5.580024], 7)
        deleteState.value = false
      }
    })

    return {
      formData,
      zones,
      onSelect,
      onDelete,
      deleteModal,
      restriction_total,
      restrictions,
      items,
      current,
      search,
      deleteItem,
      loadingData,
      paginate,
      permissions
    }
   }
});
</script>
<style scoped>

#mapid {
  height: 580px;
  border-radius: 15px;
}
</style>
