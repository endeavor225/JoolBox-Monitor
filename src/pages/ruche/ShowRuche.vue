<template>
  <q-page class="q-pa-sm" style="background-color: #efefef">

    <div class="row q-gutter-y-sm" style="margin-top: 10px;">
      <div class="col-xs-12 col-sm-12 col-md-8 col-lg-8 q-pl-md q-pr-sm">
        <q-card flat style="border-radius: 15px; height: 340px;" class="q-pa-md">
          <q-card-section class="q-pt-none">
            <div class="row items-center">
              <div style="border-left: 2px solid #55AAA0; height: 20px;">
                <span class="q-pl-sm text-primary text-subtitle2">Box N°{{ itemRuche.id }} </span>
                <span class="q-ml-sm">- {{ itemRuche.name }}</span>
                <q-btn class="q-ml-md"
                  flat
                  size="xs"
                  color="secondary"
                  @click="onEditRuche(itemRuche)"
                  style="position: relative; top: -3px; padding-left: 5px; padding-right: 5px;"
                >
                  <q-icon name="img:Modifier.svg" size="xs" class="" />
                </q-btn>
                <!-- <span class="q-ml-sm">Toutes les alvéoles</span> -->
              </div>
              <q-space />
              <div>
                <q-icon :name="iconWifiStatus" size="2.4em" />
              </div>
            </div>
          </q-card-section>

          <q-card-section class="">
            <div class="row">
              <div class="col">
                <q-item-label>
                  <span style="opacity: 0.5">Rayon d'activité :</span> <span>{{ itemRuche.radius_meter }}m</span>
                </q-item-label>
                <q-item-label class="q-pt-sm">
                  <span style="opacity: 0.5">Statut :</span> <span>{{ itemRuche.activated ? "Active" : "Desactive" }}</span>
                </q-item-label>
              </div>
              <div class="col">
                <q-item-label>
                  <span style="opacity: 0.5">Altitude :</span> <span>{{ itemRuche.altitude }}m</span>
                </q-item-label>
              </div>
              <q-space />

              <q-btn
                v-if="permissions.create"
                color="secondary"
                class=""
                no-caps
                style="border-radius: 5px; padding: 8px; width: 200px;"
                padding=""
                size="ms"
                unelevated
                @click="onAddAlveole()"
                :disable="alveoles.length >= 1"
              >
                <q-icon name="img:Add.svg" class="q-pr-sm" style="font-size: 8px;"/>
                <span class="text-weight-regular">Ajouter alvéole</span>
              </q-btn>
            </div>
          </q-card-section>

          <q-card-section>
            <div class="q-pa-none" >
              <q-list class="rounded-borders text-primary" style="background-color: #f7f7f7;">
                <q-item style="background-color: #2F8577;" class="text-white">
                  <q-item-section>Identifiant</q-item-section>
                  <q-item-section>Type de drone</q-item-section>
                  <q-item-section>État</q-item-section>
                  <q-item-section>Actions</q-item-section>
                </q-item>

                <q-separator size="5px" color="white"/>

                <div class="scroll" style="height: 125px;">
                  <div v-if="alveoles.length" v-for="item in alveoles" :key="item.id">
                    <q-item dense class="text-black text-weight-light"
                      clickable
                      :active="alveolesInfos === item"
                      @click="alveolesInfos = item"
                      active-class="my-menu-link"
                      disable-class="bg-red"
                    >
                      <q-item-section>{{ item.id }}</q-item-section>
                      <q-item-section>{{ item.drone_type_name }}</q-item-section>
                      <q-item-section>{{ item.alveolus_state_name }}</q-item-section>
                      <q-item-section>
                        <div class="q-gutter-x-md" style="text-align: right;">
                          <q-btn
                            :disable="!permissions.update"
                            unelevated
                            flat
                            padding="sm"
                            color="primary"
                            class="q-ma-nome"
                            @click="onEditalveole(item)">
                              <q-icon name="img:Modifier.svg" size="xs" />
                          </q-btn>
                        </div>
                      </q-item-section>
                    </q-item>
                    <q-separator size="5px" color="white"/>
                  </div>

                  <div v-if="!alveoles.length && loadingData" v-for="item in 3" :key="item">
                    <q-item dense class="text-black text-weight-light">
                      <q-item-section>
                        <q-item-label>
                          <q-skeleton type="text" />
                        </q-item-label>
                        <q-item-label caption>
                          <q-skeleton type="text" width="80%" />
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-separator size="5px" color="white"/>
                  </div>

                  <div v-if="!alveoles.length && !loadingData">
                    <div class="text-body1 text-black" style="margin-top: 45px; opacity: 0.4; text-align: center;">
                      Aucun alveole !
                    </div>
                  </div>
                </div>
              </q-list>
            </div>
          </q-card-section>

        </q-card>
      </div>

      <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 q-pl-md q-pr-md">
        <q-card flat style="border-radius: 15px;" class="q-pa-sm">
          <q-card-section class="text-subtitle1">
              <q-item-section>
                <q-item-label class="text-primary" style="border-left: 2px solid #55AAA0; height: 20px;">
                  <span class="q-pl-xs">Drone n°{{ drone.id }} </span>
                </q-item-label>
                <q-item-label caption>
                  <span v-if="drone.mission_id && drone.mission_id != 0" class="q-pl-sm">Affecté à la mission {{ drone.mission_id }} </span>
                  <span v-else class="q-pl-sm">Affecté à aucune mission</span>
                </q-item-label>
              </q-item-section>
          </q-card-section>

          <q-card-section style="min-height: 110px;" v-if="alveoles.length">
            <div class="row q-pa-sm q-col-gutter-lg">
              <div class="col">
                <span style="opacity: 0.5; margin-right: 10px;">Type :</span> <span v-if="alveolesInfos">{{ alveolesInfos.drone_type_name }}</span>
              </div>
              <div class="col">
                <span style="opacity: 0.5; margin-right: 10px;">Batterie :</span> <span>{{ drone.battery_percentagecharge }} %</span>
              </div>
            </div>

            <div class="row q-pa-sm q-col-gutter-lg">
              <div class="col">
                <span style="opacity: 0.5; margin-right: 10px;">Senseur x :</span> <span v-if="alveolesInfos">{{ alveolesInfos.camera_sensorx }}</span>
              </div>
              <div class="col">
                <span style="opacity: 0.5; margin-right: 10px;">Senseur y :</span> <span v-if="alveolesInfos">{{ alveolesInfos.camera_sensory }}</span>
              </div>
            </div>
          </q-card-section>

          <q-card-section style="min-height: 110px;" v-if="!alveoles.length && loadingData">
            <div class="row q-pa-sm q-col-gutter-lg">
              <div class="col">
                <q-skeleton width="150px" />
              </div>
              <div class="col">
                <q-skeleton width="150px" />
              </div>
            </div>

            <div class="row q-pa-sm q-col-gutter-lg">
              <div class="col">
                <q-skeleton width="150px" />
              </div>
              <div class="col">
                <q-skeleton width="150px" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="row" style="margin-top: 30px;">
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 q-pl-md q-pr-lg">
        <q-card flat style="border-radius: 15px; min-height: 510px;" class="q-pa-md">
          <div class="row">
            <div class="col-xs-12 col-sm-12 col-md-10 col-lg-10 q-pr-lg">
              <div id="mapid" class="q-pa-md"> </div>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 q-pr-lg">
                <div class="column">
                  <div class="col">
                    <q-toggle
                      size="sm"
                      v-model="zones.zoneR"
                      checked-icon="check"
                      color="green"
                    >
                    <span class="text-weight-light" style="font-size: 13px;" >Zone R</span> <q-icon name="img:Zone/zoneR.svg" size="18px" class="q-pl-sm"  style="top: -1px;"/>
                    </q-toggle>
                  </div>

                  <div class="col">
                    <q-toggle
                      size="sm"
                      v-model="zones.zoneP"
                      checked-icon="check"
                      color="green"
                    >
                    <span class="text-weight-light" style="font-size: 13px;" >Zone P</span> <q-icon name="img:Zone/zoneP.svg" size="18px" class="q-pl-sm"  style="top: -1px;"/>
                    </q-toggle>
                  </div>

                  <div class="col">
                    <q-toggle
                      size="sm"
                      v-model="zones.zoneD"
                      checked-icon="check"
                      color="green"
                    >
                    <span class="text-weight-light" style="font-size: 13px;" >Zone D</span> <q-icon name="img:Zone/zoneD.svg" size="18px" class="q-pl-sm"  style="top: -1px;"/>
                    </q-toggle>
                  </div>

                  <div class="col">
                    <q-toggle
                      size="sm"
                      v-model="zones.aerodrome"
                      checked-icon="check"
                      color="green"
                    >
                    <span class="text-weight-light" style="font-size: 13px;" >Aérodrome</span> <q-icon name="img:Zone/aerodrome.svg" size="18px" class="q-pl-sm"  style="top: -1px;"/>
                    </q-toggle>
                  </div>
                </div>
              </div>
          </div>
        </q-card>
      </div>
    </div>
  </q-page>

  <q-dialog
    v-model="editAlveole"
    transition-show="slide-down" transition-hide="slide-up"
  >
    <EditAlveole :editeAlveolus="alveolesInfos"/>
  </q-dialog>

  <q-dialog
    v-model="addAlveoleMode"
    transition-show="slide-down" transition-hide="slide-up"
  >
    <AddAlveole :infoRuche="itemRuche"/>
  </q-dialog>

  <q-dialog
    v-model="modalEditRuche"
    transition-show="slide-down" transition-hide="slide-up"
  >
    <EditRuche @refresh-hive="onRefreshHive" :infoRuche="itemRuche"/>
  </q-dialog>
</template>

<script>
import moment from "moment"
import lodash from "lodash";
import { api } from "boot/axios";
import { useRouter } from "vue-router";
import { useQuasar } from 'quasar';
import { defineComponent, getCurrentInstance, ref, onMounted, onBeforeMount, watch, provide, inject } from "vue";
import EditAlveole from "src/components/ruche/alveole/EditAlveole.vue";
import AddAlveole from "src/components/ruche/alveole/AddAlveole.vue"
import EditRuche from "src/components/ruche/EditRuche.vue"

export default defineComponent({
  name: "detail-ruche",
  components: {
    EditAlveole,
    AddAlveole,
    EditRuche
  },

  setup() {
    const instance =  getCurrentInstance()
    const router = useRouter()
    const $q = useQuasar()
    let link = inject("link")
    link.value = "/ruche"
    let itemRuche = ref({})
    let mymap;
    var layerGroup = ref(L.layerGroup())
    let editAlveole = ref(false)
    provide("editAlveole", editAlveole)
    let alveoleUpdate = ref(false)
    provide("alveoleUpdate", alveoleUpdate)
    let alveoleAdding = ref(false)
    provide("alveoleAdding", alveoleAdding)
    let addAlveoleMode = ref(false)
    provide("addAlveoleMode", addAlveoleMode)
    let modalEditRuche = ref(false)
    provide("modalEditRuche", modalEditRuche)

    // Tableau pour stocker les instances de restrict
    const restricts = [];
    const zones = ref({
      zoneR : false,
      zoneP : false,
      zoneD : false,
      aerodrome : false,
    })

    let alveoles = ref([])
    let alveolesInfos = ref({})
    let drone = ref({})

    itemRuche.value = JSON.parse(localStorage.getItem('itemRuche'))
    const token = $q.cookies.get('jool_auth_token')
    if(!token) router.push('/')

    const loadingData = ref(true)

    const actions = ref(["read", "create", "update", "delete"]);
    const permissions = ref({});

    const iconWifiStatus = ref('img:wifidanger.png')

    onBeforeMount(async()=>{
      for (const action of actions.value) {
        await checkPermission(action);
      }
      await wifiStatus()
    })

    setInterval(async()=> {
      await wifiStatus()
    }, 5000)

    let checkPermission = async (action) => {
      api({
        method: 'get',
        url: '/permissions',
        params: {
          action,
          service: "Alveole"
        },
        headers: {
          'Authorization': `Basic ${token}`
        }
      }).then((res)=> {
        permissions.value[action] = res.data
      })
    }

    onMounted ( async () => {
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
      }).setView([itemRuche.value.lat, itemRuche.value.lon], 13);

      var baseLayers = {
        "Jawg Streets": Jawg_Streets,
        "Google Streets": googleStreets,
        "Google Hybrid": googleHybrid,
      };

      await infoMap()

      async function onLocationFound(e) {
        //console.log("position", e.latlng);
      }

      L.control.layers(baseLayers).addTo(mymap);

      mymap.locate({});
      mymap.on("locationfound", onLocationFound);

      await getAlveole()
      await getRestriction()
      await getRuches()
    })

    let infoMap = async () => {
      var circle = null
      circle = L.circle(L.latLng(itemRuche.value.lat, itemRuche.value.lon), {
        opacity: 0,
        fillOpacity: 0,
        radius: itemRuche.value.radius_meter
      }).addTo(mymap);
      let bounds = circle.getBounds().pad(0,1);
      mymap.fitBounds(bounds);

      const customIcon = L.divIcon({
        html: itemRuche.value.id,
        className: 'my-custom-icons',
        iconSize: [24, 28],
        iconAnchor:[12, 14],
        popupAnchor:[0, -15]
      });

      layerGroup.value.clearLayers();
      let pos = L.marker([itemRuche.value.lat, itemRuche.value.lon],{icon: customIcon}).bindPopup(`<b>${itemRuche.value.name}</b> localisation ${itemRuche.value.lat}, ${itemRuche.value.lon}`)
      let raduis = L.circle([itemRuche.value.lat, itemRuche.value.lon], itemRuche.value.radius_meter, {color: "white", fillOpacity: 0})
      layerGroup.value.addLayer(pos)
      layerGroup.value.addLayer(raduis)

      mymap.addLayer(layerGroup.value);
      pos.openPopup();
    }

    let getRuches = async () => {
      api({
        method: 'get',
        url: '/hives/:id',
        params: { id: itemRuche.value.id},
        headers: { 'Authorization': `Basic ${token}`}
      })
      .then(async (response) => itemRuche.value = {...response.data})
      .catch( (err) => console.log("err",err))
    }

    let getAlveole = async () => {
      try {
        await api({
          method: 'get',
          url: '/alveoles/:id',
          params: {
            hiveid: itemRuche.value.id,
          },
          headers: {
            'Authorization': `Basic ${token}`
          }
        }).then(async (res) => {
          alveoles.value = [...res.data]
          alveolesInfos.value = alveoles.value[0]
          loadingData.value = false
        }).catch(async(err) => console.log("err", err))
      } catch (error) {
        console.log("error", error);
      }
    }

    let wifiStatus =  async () => {
      if (itemRuche.value.last_contact) {
        const fix = moment(itemRuche.value.last_contact);

        const difference = moment().diff(fix, 'seconds');
        const day = Math.floor(difference / 86400);
        const reste = difference % 86400;
        const hour = Math.floor(reste / 3600);
        const minute = Math.floor((reste % 3600) / 60);

        const danger = 'img:wifidanger.png';
        const warning = 'img:wifiwarning.png';
        const success = 'img:wifisuccess.png';

        if (day > 0 || hour > 0 || (minute >= 10)) iconWifiStatus.value = danger; // LOST
        else if (minute > 1 && minute < 10) iconWifiStatus.value = warning; // PROBLEM
        else iconWifiStatus.value = success; // VALID
      }
    }

    watch(alveolesInfos, async()=>{
      if (alveolesInfos.value) {
        try {
          await api({
            method: 'get',
            url: '/drones/:id',
            params: {hiveid: alveolesInfos.value.id},
            headers: {'Authorization': `Basic ${token}`}
          }).then((res) => drone.value = res.data)
        } catch (error) {
          console.log("error", error);
        }
      }
    })

    // Verifier si une mise à jour d'alveole a été effectuer puis actualiser
    watch(alveoleUpdate, async() => {
      if (alveoleUpdate) {
        await getAlveole()
        alveoleUpdate.value = false
      }
    })

    // Verifier si l'ajout d'alveole a été effectuer puis actualiser
    watch(alveoleAdding, async() => {
      if (alveoleAdding) {
        await getAlveole()
        alveoleAdding.value = false
      }
    })

    let onEditalveole = (item) => {
      editAlveole.value = true
    }

    let onAddAlveole = (item) => {
      addAlveoleMode.value = true
    }

    let onEditRuche = (itemRuche) => {
      modalEditRuche.value = true
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
            (params) => params.name
          )
          let restrictions = Object.entries(restrictionsTab.value)

          for (const iterator of restrictions) {
            let altitude = iterator[1]
            let area = []
            for (const item of iterator[1]) {
              area.push([item.lat, item.lon])
            }
            const restrict = L.polygon(area, {color: 'red'}).bindPopup(`<b>${iterator[0]}</b>, altitude minimun: ${altitude[0].altitude_inf}m et altitude maximun: ${altitude[0].altitude_sup}m`)
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

    watch(() => zones.value.zoneP, (newValue, oldValue) => {});
    watch(() => zones.value.zoneD, (newValue, oldValue) => {});
    watch(() => zones.value.aerodrome, (newValue, oldValue) => {});

    let onRefreshHive = async (id) => {
      try {
        await api({
          method: 'get',
          url: '/hives/:id',
          params: {id: id},
          headers: {'Authorization': `Basic ${token}`}
        }).then(async (res) => {
          localStorage.setItem('itemRuche', JSON.stringify(res.data))
          itemRuche.value = JSON.parse(localStorage.getItem('itemRuche'))
          await infoMap()
        })
      } catch (error) {
        console.log(error);
      }
    }

    return {
      itemRuche,
      zones,
      alveoles,
      editAlveole,
      onEditalveole,
      alveolesInfos,
      drone,
      onAddAlveole,
      addAlveoleMode,
      loadingData,
      permissions,
      iconWifiStatus,
      onEditRuche,
      modalEditRuche,
      onRefreshHive
    }
   }
});
</script>
<style scoped>
#mapid {
  height: 480px;
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

.my-menu-link{
  color: white;
  background: #AFDED6
}
</style>
