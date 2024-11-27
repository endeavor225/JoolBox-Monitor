<template>
  <q-page class="q-pa-sm" style="background-color: #efefef">
    <div class="q-pl-sm q-pr-sm q-pb-md">
      <div class="row no-wrap items-center q-mt-md q-pa-sm ">
        <div style="border-left: 2px solid #55AAA0">
          <span class="q-pl-sm text-primary text-subtitle2" style="font-size: 18px; position: relative; top: 2px;">
            Box
          </span>
        </div>

        <q-space />

        <q-btn
          v-if="permissions.create"
          color="secondary"
          class=""
          no-caps
          style="border-radius: 5px; padding: 9px; width: 250px;"
          size="ms"
          unelevated
          @click="$router.push('create-ruche')"
        >
          <q-icon name="img:Add.svg" class="q-pr-sm" style="font-size: 10px;"/>
          <span class="text-weight-regular" style="font-size: 15px;"> Nouvelle box</span>
        </q-btn>
      </div>
    </div>

    <div class="row q-gutter-y-md q-pl-md q-pr-md" style="margin-top: 5px;">
      <div class="col-xs-12 col-sm-12 col-md-8 col-lg-8">
        <q-card flat style="border-radius: 15px;  min-height: 670px;" class="q-pa-md">

          <div id="mapid" style="" class="q-pa-md"> </div>

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

      <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 q-pl-md">
        <q-card flat style="border-radius: 15px; height: 230px;" class="q-pa-sm">

          <q-card-section class="q-pb-none text-subtitle1">
            Ruches actives
          </q-card-section>

          <q-card-section v-if="ruches.length" style="height: 140px;" class="scroll">
            <div class="row q-pa-none q-col-gutter-lg">
              <div class="col-6" v-for="item in ruches" :key="`xl-${item.id}`">
                <q-btn v-if="!btnSelected" class="full-width" no-caps padding="sm" color="secondary" unelevated @click="onSelect(item)" >
                  <q-item-section class="q-ma-xs">
                    <q-item-label lines="1">{{ item.name }} {{ item.id }}</q-item-label>
                  </q-item-section>
                </q-btn>

                <div v-if="btnSelected">
                  <q-btn-group class="full-width" unelevated v-if="btnItem === item.id">
                    <q-btn class="full-width" text-color="primary" no-caps padding="sm" color="grey-2"  @click="onDeselect(item)" >
                      <q-item-section class="q-ma-xs">
                        <transition
                          appear
                          enter-active-class="animated fadeInRight"
                          leave-active-class="animated fadeOutRight"
                        >
                          <q-item-label lines="1">{{ item.name }} {{ item.id }}</q-item-label>
                        </transition>
                      </q-item-section>
                    </q-btn>

                    <transition
                      appear
                      enter-active-class="animated fadeIn"
                      leave-active-class="animated fadeOut"
                    >
                      <q-btn unelevated color="primary" class="q-ma-nome" @click="onShow(item)" >
                        <q-icon name="img:Details.svg" size="xs" />
                      </q-btn>
                    </transition>
                  </q-btn-group>

                  <q-btn v-if="btnItem != item.id" class="full-width" no-caps unelevated padding="sm" color="secondary" disable @click="onDeselect(item)" >
                    <q-item-section class="q-ma-xs">
                      <q-item-label lines="1">{{ item.name }} {{ item.id }}</q-item-label>
                    </q-item-section>
                  </q-btn>
                </div>
              </div>
            </div>
          </q-card-section>

          <q-card-section v-if="!ruches.length && loadingData" style="height: 130px;" class="scroll">
            <div class="row q-pa-none q-col-gutter-lg">
              <div class="col-6" v-for="item in paginate" :key="`xl-${item}`">
                <q-item-section >
                 <q-skeleton height="40px" />
                </q-item-section>
              </div>
            </div>
          </q-card-section>

          <q-card-section v-if="!ruches.length && !loadingData" style="height: 130px;" class="scroll">
            <div class="text-body1" style="margin-top: 50px; opacity: 0.4; text-align: center;">
              Aucune ruche !
            </div>
          </q-card-section>

          <q-card-actions class=" absolute-bottom q-mr-md q-mb-sm" align="right">
            <q-pagination
              v-model="current"
              direction-links
              flat
              color="secondary"
              active-color="primary"
              :max="rest_total%paginate != 0 ? (rest_total/paginate)+1 : (rest_total/paginate)"
              :max-pages="5"
              :boundary-numbers="false"
            >
            </q-pagination>
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import lodash from "lodash";
import { api } from "boot/axios";
import { useQuasar } from 'quasar'
import { useRouter } from "vue-router"
import { defineComponent, getCurrentInstance, ref, onMounted, onBeforeMount, provide, watch } from "vue";

export default defineComponent({
  name: "Ruche",
  components: {

  },

  setup() {
    const instance = getCurrentInstance();
    const router = useRouter()
    const $q = useQuasar()
    let mymap;
    var layerGroup = ref(L.layerGroup())
    let formData = ref({})
    let createForm = ref();
    let ruches = ref([])
    let ruchesArea = ref([])
    let btnSelected = ref(false)
    let btnItem = ref("")
    let zones = ref({
      zoneP : false,
      zoneR : false,
      aerodrome : false,
      zoneD : false,
    })
    const restricts = [];
    const loadingData = ref(true)
    let current = ref(1)
    let rest_total = ref()
    let offset_occ = ref(0)
    const paginate = ref(4)

    const token = $q.cookies.get('jool_auth_token')
    if(!token) router.push('/')

    const actions = ref(["read", "create", "update", "delete"]);
    const permissions = ref({});

    onBeforeMount(async ()=> {
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
          service: "Ruche"
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
      }).setView([7.674076, -5.580024], 7);

      await getRuches()
      await getRestriction()

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
    })

    let getRuches = async () => {
      api({
        method: 'get',
        url: '/hives',
        params: {
          limit: 100,
        },
        headers: {
          'Authorization': `Basic ${token}`
        }
      }).then( async (response) => {
        ruchesArea.value = [...response.data]
        rest_total.value = ruchesArea.value.length
        ruches.value = ruchesArea.value.slice(0, paginate.value)
        loadingData.value = false
      }).catch( (err) => {
        console.log("err",err);
      })
    }

    let onSelect = (item) => {
      let circle = L.circle(L.latLng(item.lat,item.lon), {
        opacity: 0,
        fillOpacity: 0,
        radius: item.radius_meter
      }).addTo(mymap);
      let bounds = circle.getBounds().pad(0,1);
      //mymap.fitBounds(bounds, {duration: 1});

      mymap.flyToBounds(bounds, {
        duration: 1,
        easeLinearity: 0.2,
        zoom: 18
      });

      btnSelected.value = true
      btnItem.value = item.id
    }

    let onDeselect = (item) => {
      btnSelected.value = false
      mymap.flyTo(new L.LatLng(item.lat,item.lon), 10);
    }

    let onShow = (item) => {
      localStorage.setItem('itemRuche', JSON.stringify(item))
      router.push({ name: 'detail-ruche' })
    }

    watch(ruches, async()=>{
      // Suppression des Layers de la map
      layerGroup.value.clearLayers()

      for (const iterator of ruches.value) {
        const customIcon = L.divIcon({
          html: iterator.id,
          className: 'my-custom-icons',
          iconSize: [24, 28],
          iconAnchor:[12, 14],
          popupAnchor:[0, -15]
        });
        let pos = L.marker([iterator.lat, iterator.lon],{icon: customIcon}, ).bindPopup(`${iterator.name}`)
        let raduis = L.circle([iterator.lat, iterator.lon], iterator.radius_meter, {color: "white", fillOpacity: 0})
        layerGroup.value.addLayer(pos)
        layerGroup.value.addLayer(raduis)
      }
    })

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

          let restrictionArea = Object.entries(restrictionsTab.value)
          for (const iterator of restrictionArea) {
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
      offset_occ.value = (newValue - 1) * paginate.value
      ruches.value = ruchesArea.value.slice(offset_occ.value, offset_occ.value+paginate.value)
    })

    return {
      formData,
      createForm,
      zones,
      onSelect,
      onDeselect,
      onShow,
      btnSelected,
      btnItem,
      ruches,
      loadingData,
      current,
      rest_total,
      paginate,
      permissions
    }
   }
});
</script>
<style scoped>

#mapid {
  height: 595px;
  border-radius: 15px;
}

#mapid >>> .my-custom-icons {
  background-image: url("../../../public/Polygone.svg");
  background-repeat: no-repeat;
  background-size: cover;
  text-align:center;
  line-height:30px;
  color:black;
}

</style>
