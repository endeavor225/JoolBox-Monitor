<template>
  <q-page class="q-pa-sm" style="background-color: #efefef">
    <div class="row q-gutter-y-md" style="margin-top: 5px;">
      <div class="col-xs-12 col-sm-12 col-md-8 col-lg-8 q-pl-md q-pr-sm">
        <q-card flat style="border-radius: 15px;  height: 610px;" class="q-pa-md">

          <q-card-section class="q-pt-none" >
            <div class="row items-center">
              <div class="text-subtitle1 q-pl-none q-mb-md">
                <q-item-section>
                  <q-item-label class="" style="border-left: 2px solid #55AAA0; height: 20px;">
                    <span v-if="itemMission.id">
                      <span class="q-pl-xs text-primary">Mission #{{ itemMission.id }} </span>
                      <span class="q-ml-xs">{{ itemMission.name }}</span>
                    </span>
                    <span v-else>
                      <q-skeleton class="q-ml-xs" width="200px" />
                    </span>
                  </q-item-label>
                </q-item-section>
              </div>
              <q-space />
              <div>
                <q-icon :name="iconWifiStatus" size="2.4em" >
                  <q-badge color="red" floating transparent>
                    {{ drone.sat_count ? drone.sat_count : 0}}
                  </q-badge>
                </q-icon>
              </div>
            </div>
          </q-card-section>

          <q-card-section class="" v-if="itemMission.id">
            <div class="row">
              <div class="col">
                <q-item-label>
                  <span class="text-weight-light" style="opacity: 0.5">Créer par</span> <span>{{ itemMission.user_first_name }} {{ itemMission.user_last_name }}</span>
                </q-item-label>
                <q-item-label>
                  <span class="text-weight-light" style="opacity: 0.5">Type : </span>
                  <span v-if="itemMission.type == 1">Surface</span>
                  <span v-if="itemMission.type == 3">Linéaire</span>
                </q-item-label>
                <q-item-label>
                  <span class="text-weight-light" style="opacity: 0.5">Départs de la ruche :</span> <span>{{itemMission.departure_hive}}</span>
                </q-item-label>
                <q-item-label>
                  <span class="text-weight-light" style="opacity: 0.5">Retour à la ruche :</span> <span>{{itemMission.return_hive}}</span>
                </q-item-label>
              </div>
              <div class="col">
                <q-item-label>
                  <span class="text-weight-light" style="opacity: 0.5">Altitude :</span> <span>{{ hive.altitude }}m</span>
                </q-item-label>
                <q-item-label>
                  <span class="text-weight-light" style="opacity: 0.5">Senseur :</span> <span>{{ itemMission.sensor }}</span>
                </q-item-label>
                <q-item-label>
                  <span class="text-weight-light" style="opacity: 0.5">Résolution au sol :</span> <span>{{ itemMission.resolution }}</span>
                </q-item-label>
                <q-item-label>
                  <span class="text-weight-light" style="opacity: 0.5">Temps estimé : </span>
                  <span>00:</span>

                  <span v-if="itemMission.duration">
                    <span v-if="itemMission.duration.minutes">
                      <span v-if="itemMission.duration.minutes > 9">{{ itemMission.duration.minutes }}:</span>
                      <span v-if="itemMission.duration.minutes < 9">0{{ itemMission.duration.minutes }}:</span>
                    </span>
                    <span v-else>00:</span>

                    <span v-if="itemMission.duration.seconds">
                      <span v-if="itemMission.duration.seconds > 9">{{ itemMission.duration.seconds }}</span>
                      <span v-if="itemMission.duration.seconds < 9">0{{ itemMission.duration.seconds }}</span>
                    </span>
                    <span v-else>00</span>
                  </span>
                </q-item-label>
              </div>

              <div class="col" style="text-align: right;">
                <div v-if="itemMission.state === 2">
                  <q-btn
                    color="secondary"
                    class="q-mb-xs"
                    no-caps
                    style="border-radius: 5px; padding: 8px; width: 200px;"
                    padding=""
                    size="ms"
                    unelevated
                    @click="onDecolle(itemMission)"
                    :disable="!permissions.create"
                  >
                    <q-icon name="img:drone_decolle.svg" class="q-pr-sm" style="font-size: 18px;"/>
                    <span class="text-weight-regular">Décoller</span>
                  </q-btn>
                  <q-btn
                    color="secondary"
                    outline
                    class="q-mt-xs"
                    no-caps
                    style="border-radius: 5px; padding: 8px; width: 200px;"
                    padding=""
                    size="ms"
                    unelevated
                    @click="onProgramme()"

                  >
                    <q-icon name="img:Add-color.svg" class="q-pr-sm" style="font-size: 8px;"/>
                    <span class="text-weight-regular">Programmer</span>
                  </q-btn>
                </div>
              </div>
            </div>
          </q-card-section>

          <!-- Skeleton -->
          <q-card-section class="" v-else>
            <div class="row">
              <div class="col">
                <q-item-label v-for="n in 4">
                  <q-skeleton width="200px" />
                </q-item-label>
              </div>
              <div class="col">
                <q-item-label v-for="n in 4">
                  <q-skeleton width="200px" />
                </q-item-label>
              </div>

              <div class="col">
                <span style="float: right;">
                  <q-item-label v-for="n in 2">
                  <q-skeleton width="200px" height="40px"/>
                </q-item-label>
                </span>
              </div>
            </div>
          </q-card-section>

          <OccurrenceVue/>

        </q-card>
      </div>

      <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 q-pl-md q-pr-md">
        <RestrictionVue />

        <q-card v-if="missions_occ.length && occurrenceSelect" flat style="border-radius: 15px; margin-top: 20px; height: 320px" class="q-pa-sm"> <!-- 370px -->
          <q-card-section class="text-subtitle1">
            <q-item-section>
              <q-item-label class="" style="border-left: 2px solid #55AAA0; height: 20px;">
                <span class="q-pl-xs text-primary">Médias des missions</span>
                <span v-if="occurrenceSelect">Vol n°{{occurrenceSelect.id}}</span>
              </q-item-label>
            </q-item-section>
          </q-card-section>
          <q-card-section class="" style="margin-top: -20px;" v-if="occurrenceSelect.medias.length && occurrenceSelect.medias[0].media_type === 'flux'">
            <img
              :src="occurrenceSelect.medias[0].wsImg"
              alt="Base64 Image"
              style="border-radius: 10px; border: 1px solid #c7c7c7; width: 100%; height: 250px"
            >
          </q-card-section>

          <q-card-section class="" style="margin-top: -20px;" v-if="occurrenceSelect.medias.length && occurrenceSelect.medias[0].media_type != 'flux'">
            <div class="q-mb-sm">
              {{ occurrenceSelect.medias.length }} média trouvé
            </div>

            <div class="row items-center q-col-gutter-xs">
              <div class="col-3 " v-for="media in occurrenceSelect.medias" :key="media">
                <div v-if="occurrenceSelect.medias.indexOf(media) < 7">
                  <q-img v-if="!media.media_type"
                    :src="media.media_url"
                    style="height: 80px; max-width: 130px"
                    class="cursor-pointer"
                    clickable v-ripple
                    @click="onDisplay(occurrenceSelect.medias, media)"
                  />

                  <div v-if="media.media_type === 'video'" class="container cursor-pointer" @click="onDisplay(occurrenceSelect.medias, media)">
                    <video v-if="media.media_type === 'video'"
                      class="card-video"
                      clickable v-ripple
                      :src="media.media_url"
                      style="width: 100%; height: auto;"
                    >
                    </video>
                      <div class="absolute-full text-h4 flex flex-center">
                        <img src="fleche_droite.svg"  width="30" alt="image" class="cursor-pointer">
                      </div>
                  </div>
                </div>

                <q-img v-if="occurrenceSelect.medias.indexOf(media) == 7"
                  :src="media.media_url"
                  style="height: 80px; max-width: 130px;"
                >
                  <div class="absolute-full text-h4 flex flex-center">
                    +{{ occurrenceSelect.medias.length - 8 }}
                  </div>
                </q-img>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="row" style="margin-top: 30px;">
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 q-pl-md q-pr-md">
        <q-card flat style="border-radius: 15px; min-height: 565px;" class="q-pa-md">
          <q-card-section class="text-subtitle1">
            <q-item-section>
              <q-item-label class="" style="border-left: 2px solid #55AAA0; height: 20px;">
                <span class="q-pl-xs text-primary">Mission </span>
                <span>Prévisualisation carte</span>
              </q-item-label>
            </q-item-section>
          </q-card-section>

          <q-card-section class="q-pt-none">
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
                    <span class="text-weight-light" style="font-size: 13px;" >Aérodrome</span> <q-icon name="img:Zone/aerodrome.svg" size="18px" class=""  style="top: -1px;"/>
                    </q-toggle>
                  </div>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="row" v-if="itemMission.state === 2" style="margin-top: 30px;">
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
        <GraphiqueVue :idMission="itemId"/>
      </div>
    </div>

    <q-dialog v-model="confirmOcc" transition-show="slide-down" transition-hide="slide-up">
      <ConfirmOccurrenceVue @refresh-occurrence="refresh" :mission_id="itemId"/>
    </q-dialog>

    <q-dialog v-model="notifyCreateOcc" transition-show="slide-up" transition-hide="slide-down">
      <NotifyOccurrence />
    </q-dialog>

    <q-dialog v-model="carouselModel" maximized persistent>
      <CarouselVideo :medias="videoInfo"/>
    </q-dialog>

    <q-dialog v-model="programmeOcc" transition-show="slide-down" transition-hide="slide-up">
      <ProgrammeOccurrenceVue @refresh-occurrence="refresh" :mission_id="itemId"/>
    </q-dialog>
  </q-page>
</template>

<script>
import moment from "moment"
import $ from 'jquery'
import lodash from "lodash";
import { api } from "boot/axios";
import { useRouter } from "vue-router";
import { SessionStorage, useQuasar } from 'quasar';
import { defineComponent, getCurrentInstance, ref, onMounted, onBeforeMount, watch, provide, inject } from "vue";
import OccurrenceVue from "src/components/mission/Occurrence.vue"
import RestrictionVue from "src/components/mission/Restriction.vue"
import MediaVue from "src/components/mission/Media.vue"
import MapVue from "components/mission/Map.vue"
import GraphiqueVue from "components/mission/Graphique.vue"
import VideoVue from "components/mission/Video.vue"
import NotifyOccurrence from "components/mission/OccurrenceNotify.vue"
import ConfirmOccurrenceVue from "src/components/mission/ConfirmOccurrence.vue";
import CarouselVideo from "src/components/mission/CarouselVideo.vue";
import ProgrammeOccurrenceVue from 'src/components/mission/ProgrammeOccurrence.vue';
export default defineComponent({
  name: "DetailMission",
  components: {
    OccurrenceVue,
    RestrictionVue,
    MediaVue,
    MapVue,
    GraphiqueVue,
    VideoVue,
    NotifyOccurrence,
    ConfirmOccurrenceVue,
    CarouselVideo,
    ProgrammeOccurrenceVue
  },

  setup() {
    const instance =  getCurrentInstance()
    const router = useRouter()
    const $q = useQuasar()
    let link = inject("link")
    link.value = "/dashboard"
    let mymap;
    var layerGroup = L.layerGroup()
    let titlePage = inject("titlePage")
    titlePage.value = "Mission"
    const restricts = [];
    let zones = ref({
      zoneP: false,
      zoneR: false,
      aerodrome: false,
      zoneD: false,
    })
    let itemMission = ref({})
    provide("itemMission", itemMission)
    let user = ref({})
    provide("user", user)
    let hive = ref({})
    provide("hive", hive)
    let missions_occ = ref([])
    provide("missions_occ", missions_occ)
    let occurrenceSelect = ref(null)
    provide("occurrenceSelect", occurrenceSelect)
    let occ_total = ref()
    provide("occ_total", occ_total)
    let offset_occ = ref(0)
    provide("offset_occ", offset_occ)
    let current = ref(1);
    provide("current", current)
    let mediasOcc = ref([])
    provide("mediasOcc", mediasOcc)
    let countMedias = ref({})
    provide("countMedias", countMedias)
    let mission_elements = ref([])
    let mission_polygon_elements = ref([])
    let deleteOccurrence = ref(false)
    provide("deleteOccurrence", deleteOccurrence)
    const paginate = 5
    provide("paginate", paginate)
    let item_occ = ref([])
    provide("item_occ", item_occ)
    let readMediaModal = ref(false)
    let notifyCreateOcc = ref(false)
    provide("notifyCreateOcc", notifyCreateOcc)
    let confirmOcc = ref(false)
    provide("confirmOcc", confirmOcc)
    let videoInfo = ref()
    let itineraire = ref({})
    let updateAutorisation = ref(false)
    provide("updateAutorisation", updateAutorisation)
    let polygoneMission = ref()
    let coords = ref({
      lat: "7.674076",
      lon: "-5.580024",
      zoom: 7
    })
    let itemId = ref()
    provide("itemId", itemId)
    itemId.value = JSON.parse(localStorage.getItem('mission'))
    let carouselModel = ref(false)
    let loadingOccuData = ref(true)
    provide("loadingOccuData", loadingOccuData)
    let programmeOcc = ref(false)
    provide("programmeOcc", programmeOcc)
    let drone = ref({})

    const token = $q.cookies.get('jool_auth_token')
    if(!token) router.push('/')

    const actions = ref(["read", "create", "update", "delete"]);
    const permissions = ref({});
    provide("permissions", permissions)

    const iconWifiStatus = ref('img:wifidanger.png')

    const occurrenceEnCours = ref(false);

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
          service: "Occurrence"
        },
        headers: {
          'Authorization': `Basic ${token}`
        }
      }).then((res)=> {
        permissions.value[action] = res.data
      })
    }

    onMounted( async () => {
      setInterval(async () => {
        await missions_occurrences()
        await wifiStatus()
      },3000)

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

      let arcgisonline = L.tileLayer('//server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',{
        attribution: '© Esri — Sources: Esri, DigitalGlobe, Earthstar Geographics, CNES/Airbus DS, GeoEye, USDA FSA, USGS, Getmapping, Aerogrid, IGN, IGP, swisstopo, and the GIS User Community',
        minZoom: 6,
        maxZoom: 19,
      });

      //Affichage de la map
      mymap = L.map('mapid', {
        layers: [Jawg_Streets],
      }).setView([coords.value.lat, coords.value.lon], coords.value.zoom);

      var baseLayers = {
        "Jawg Streets": Jawg_Streets,
        "Google Streets": googleStreets,
        "Google Hybrid": googleHybrid,
        "Map Arcgisonline": arcgisonline,
      };
      L.control.layers(baseLayers).addTo(mymap);

      async function onLocationFound(e) {
        //console.log("position", e.latlng);
      }
      mymap.locate({});
      mymap.on("locationfound", onLocationFound);

      mymap.addLayer(layerGroup);

      await findMission()
      await getRestriction()
    })

    let wifiStatus =  async () => {
      if (hive.value.last_contact) {
        const fix = moment(hive.value.last_contact);

        const difference = moment().diff(fix, 'seconds');
        const day = Math.floor(difference / 86400);
        const reste = difference % 86400;
        const hour = Math.floor(reste / 3600);
        const minute = Math.floor((reste % 3600) / 60);

        const danger = 'img:wifidanger.png';
        const warning = 'img:wifiwarning.png';
        const success = 'img:wifisuccess.png';

        if (day > 0 || hour > 0 || (minute >= 10)) {
          iconWifiStatus.value = danger; // LOST
        } else if (minute > 1 && minute < 10) {
          iconWifiStatus.value = warning; // PROBLEM
        } else {
          iconWifiStatus.value = success; // VALID
        }
      }
    }

    /* Fonction pour récupérer une mission*/
    let findMission = async () => {
      await api({
        method: 'get',
        url: '/missions/:id',
        params: {
          id: itemId.value
        },
        headers: {
          'Authorization': `Basic ${token}`
        }
      }).then( async (response) => {
        itemMission.value = response.data
        await findRuche(response.data)
        await missions_occurrences()
        await getMissionPolygonElement(response.data)
        await getMissionElements(response.data)
      }).catch( (err) => {
        console.log("err",err);
      })
    }

    /* Fonction pour récupéerer les infos de la ruche*/
    let findRuche = async (item) => {
      if (item.departure_hive) {
        try {
          await api({
            method: 'get',
            url: '/hives/:id',
            params: {
              id: item.departure_hive,
            },
            headers: {
              'Authorization': `Basic ${token}`
            }
          }).then(async (res) => {
            hive.value = res.data
            coords.value.lat = hive.value.lat
            coords.value.lon = hive.value.lon
            coords.value.zoom = 13

            await wifiStatus()

            const customIcon = L.divIcon({
              html: hive.value.id,
              className: 'my-custom-icons',
              iconSize: [24, 28],
              iconAnchor:[12, 14],
              popupAnchor:[0, -15]
            });

            let pos = L.marker([hive.value.lat, hive.value.lon],{icon: customIcon}).bindPopup(`${hive.value.name}`)
            let raduis = L.circle([hive.value.lat, hive.value.lon], hive.value.radius_meter, {color: "white", fillOpacity: 0})
            layerGroup.addLayer(pos)
            layerGroup.addLayer(raduis)
          })
        } catch (error) {
          console.log("error", error);
        }
      }
    }

    /* Fonction de récupération des occurrences de mission */
    let missions_occurrences = async () => {
      try {
        await api({
          method: 'get',
          url: '/occurrences',
          params: {
            id: itemMission.value.id,
          },
          headers: {
            'Authorization': `Basic ${token}`
          }
        }).then(async (res) => {
          // Fonction pour voir si une mission est en cours d'execution
          occurrenceEnCours.value = res.data.some(item => item.occstateid === 2)

          /* Filtrage des medias */
          for (const iterator of res.data) {
            if (iterator.occstateid === 2) {
              if (iterator.medias.length) {
                let flux = iterator.medias.filter(item => {
                  return item.media_type === "flux";
                })
                iterator.medias = flux
                const firstElement = iterator.medias.shift();
                iterator.medias.splice(0);
                iterator.medias.push(firstElement);
              }
            } else {
              let medias = iterator.medias.filter(item => {
                return item.media_type != "flux";
              })
              iterator.medias = medias
            }
          }
          missions_occ.value = res.data
          occ_total.value = res.data.length
          item_occ.value = missions_occ.value.slice(offset_occ.value, offset_occ.value+paginate)
          loadingOccuData.value = false
          let occu = localStorage.getItem('id_occ_miss')
          if (occu) {
            missions_occ.value.forEach(async element => {
            if (element.id == occu) {
              occurrenceSelect.value = element
              localStorage.removeItem('id_occ_miss')
            }
          });
          }
        })
      } catch (error) {
        console.log("error", error);
      }
    }

    let intervalId;
    let droneMarker;
    watch(occurrenceEnCours, async(newValue, oldValue) => {

      //Personnaliser le marker du drone
      var droneIcon = L.icon({
        iconUrl: 'drone.svg',
        iconSize:     [20, 20],
        iconAnchor:   [10, 9],
        popupAnchor:  [0, -5]
      });

      if (occurrenceEnCours.value) {
        intervalId = setInterval(async () => {
          await api({
            method: 'get',
            url: '/drones/:id',
            params: {
              hiveid: hive.value.alveolus_id,
            },
            headers: {
              'Authorization': `Basic ${token}`
            }
          }).then((res) => {
            drone.value = res.data
            if(droneMarker) mymap.removeLayer(droneMarker);
            droneMarker = L.marker([res.data.lat, res.data.lon],{icon: droneIcon})
            layerGroup.addLayer(droneMarker)
          }).catch((err) => console.log(err.message))
        }, 3000);
      } else {
        clearInterval(intervalId)
      }
    })

    /* Fonction permettant de récuperer les element d'une mission (Linaire ou surface) et leurs itinéraires */
    let getMissionElements = async (mission) => {
      try {
        await api({
          method: 'get',
          url: '/mission-element',
          params: {
            mission_id: mission.id
          },
          headers: {
            'Authorization': `Basic ${token}`
          }
        }).then(async (res) => {
          let elementTab = ref(res.data);
          elementTab.value = lodash.groupBy(
            elementTab.value,
            (params) => params.flight_plan_id
          )
          let itineraires = Object.entries(elementTab.value)

          let itineraireAller;
          let itineraireMission;
          let itineraireRetour;
          if (itineraires.length == 1) {
            itineraireMission = itineraires[0]
            for (const iterator of itineraireMission[1]) {
              mission_elements.value.push([iterator.p5x, iterator.p6y]);
            }
            if (itineraire.value.mission) {
              layerGroup.removeLayer(itineraire.value.mission)
            }
            itineraire.value.mission = L.polyline(mission_elements.value, {color: '#dc7019', opacity: 0.7,  dashArray: '3, 4'})
            layerGroup.addLayer(itineraire.value.mission)
            setTimeout(() => {
              const bounds = new L.LatLngBounds(mission_elements.value);
              mymap.fitBounds(bounds);
            })
          }

          if (itineraires.length == 3) {
            itineraireAller = itineraires[0]
            itineraireMission = itineraires[1]
            itineraireRetour = itineraires[2]
            mission_elements.value = []
            for (const iterator of itineraireMission[1]) {
              mission_elements.value.push([iterator.p5x, iterator.p6y]);
            }
            if (itineraire.value.mission) {
              layerGroup.removeLayer(itineraire.value.mission)
            }
            itineraire.value.mission = L.polyline(mission_elements.value, {color: '#dc7019', opacity: 0.7,  dashArray: '3, 4'})
            layerGroup.addLayer(itineraire.value.mission)
            setTimeout(() => {
              const bounds = new L.LatLngBounds(mission_elements.value);
              mymap.fitBounds(bounds);
            })

            let pointsAller = []
            for (const iterator of itineraireAller[1]) {
              pointsAller.push([iterator.p5x, iterator.p6y]);
            }
            if (itineraire.value.allerMission) {
              layerGroup.removeLayer(itineraire.value.allerMission)
            }
            itineraire.value.allerMission = L.polyline(pointsAller, {color: '#0d55b8', opacity: 0.7,  dashArray: '3, 4'})
            layerGroup.addLayer(itineraire.value.allerMission)

            let pointsRetour = []
            for (const iterator of itineraireRetour[1]) {
              pointsRetour.push([iterator.p5x, iterator.p6y]);
            }
            if (itineraire.value.retourMission) {
              layerGroup.removeLayer(itineraire.value.retourMission)
            }
            itineraire.value.retourMission = L.polyline(pointsRetour, {color: '#0d55b8', opacity: 0.7,  dashArray: '3, 4'})
            layerGroup.addLayer(itineraire.value.retourMission)
          }
        })
      } catch (error) {
        console.log("error", error);
      }
    }

    /* Fonction permettant de récuperer le polygon d'un mission */
    let getMissionPolygonElement = async (mission) =>{
      if (mission.type == 1) {
        try {
          await api({
            method: 'get',
            url: '/mission-polygon-element',
            params: {
              mission_id: mission.id
            },
            headers: {
              'Authorization': `Basic ${token}`
            }
          }).then(async (res) => {
            for (const iterator of res.data) {
              mission_polygon_elements.value.push([iterator.lat, iterator.lon]);
            }
            if (polygoneMission.value) {
              layerGroup.removeLayer(polygoneMission.value)
            }
            polygoneMission.value = L.polygon(mission_polygon_elements.value, {color: '#dc7019', fillColor: 'blue', fillOpacity: 0, opacity: 0.7}).bindPopup(`${itemMission.value.name}`)
            layerGroup.addLayer(polygoneMission.value)
          })
        } catch (error) {
          console.log("error", error);
        }
      }
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

            if (mission_polygon_elements.value.length) {
              setTimeout(() => {
                const bounds = new L.LatLngBounds(mission_polygon_elements.value);
                mymap.fitBounds(bounds);
              })
            }
          }
        })
      } catch (error) {
        console.log("error", error);
      }
    }

    watch(() => zones.value.zoneR, async(newValue, oldValue) => {
      if (zones.value.zoneR) {
        restricts.forEach((restrict) => {
          layerGroup.addLayer(restrict);
        });
      } else {
        restricts.forEach((restrict) => {
          layerGroup.removeLayer(restrict);
        });
      }
    });

    let refresh = async (/* arguments de l'événement */) => {
      await missions_occurrences()
    }

    // Pagination
    watch(current, async(newValue, oldValue) => {
      offset_occ.value = (newValue - 1) * paginate
      item_occ.value = missions_occ.value.slice(offset_occ.value, offset_occ.value + paginate)
    })

    watch(deleteOccurrence, async() => {
      if (deleteOccurrence.value) {
        await missions_occurrences()
        deleteOccurrence.value = false
      }
    })

    watch(updateAutorisation, async() => {
      if (updateAutorisation.value) {
        setTimeout(async () => {
          await getMissionElements(itemMission.value)
        }, 5000)

        setTimeout(async ()=> {
          await findMission()
          updateAutorisation.value = false
        }, 10000)
      }
    })

    let onDisplay = (medias, item) => {
      console.log("medias", medias);
      //console.log("item", item);
      //readMediaModal.value = true
      videoInfo.value = medias
      sessionStorage.setItem("selectCarousel",JSON.stringify(item))
      carouselModel.value = true
    }

    let onDecolle = async (itemMission) => {
      confirmOcc.value = true
    }

    let onProgramme = async (item) => {
      programmeOcc.value = true
    }

    /**
     * WebSocket Image Receiver
     *
     */
    var ws = null;
    watch(() => occurrenceSelect.value, async(newValue, oldValue) => {
      occurrenceSelect.value.medias[0].wsImg = null

      $(function() {
        if(ws !== null) ws.close();
        ws = new WebSocket(occurrenceSelect.value.medias[0].media_url);
        var timerStarted = false,
            timer,
            startTime,
            endTime

        ws.onopen = function() {
          console.log("WebSocket connection established.");
        };

        ws.onmessage = function(event) {
          var base64Data = event.data;
          if (base64Data && base64Data.trim() !== "") {
            // Check if the message contains the start signal
            if (base64Data.includes(".)start,@0,@")) {
                // Remove tag before show Image
                base64Data = base64Data.replace(".)start,@0,@","");
                if (!timerStarted) {
                  startTimer();
                  timerStarted = true;
                }
            }

            // Check if the message contains the end signal
            if (base64Data.includes(".)end,@replaceMe,@")) {
              // Remove tag before show Image
              base64Data = base64Data.replace(".)end,@replaceMe,@","");
              if (timerStarted) {
                stopTimer();
                if (startTime >= endTime){
                  console.log("Invalid time constraints.");
                }else {
                  // Calculate the elapsed time in seconds
                  var elapsedTime = (endTime - startTime) / 1000;
                  // Replace the placeholder in the message and send to server
                  var responseMessage = ".)end,@replaceMe,@".replace("replaceMe", elapsedTime);
                  ws.send(responseMessage);
                }
              }
            }
            ws.send("incrementCounter");
            occurrenceSelect.value.medias[0].wsImg = "data:image/jpeg;base64," + base64Data;
            //imgElement.style.width = "640px";
            //imgElement.style.height = "480px";
          } else {
            console.log("Received empty or null image data.");
          }
        };

        ws.onclose = function() {
          console.log("WebSocket connection closed.");
        }

        function startTimer() {
          console.log("Timer started.");
          startTime = new Date().getTime();
          // Implement your timer logic here
          timer = setInterval(function() {
            // Timer logic
          }, 1000); // Update the interval as needed
        }

        function stopTimer() {
          console.log("Timer stopped.");
          clearInterval(timer);
          endTime = new Date().getTime();
          timerStarted = false;
        }
      })
    });

    return {
      zones,
      itemMission,
      missions_occ,
      occurrenceSelect,
      itemId,
      mediasOcc,
      countMedias,
      onDisplay,
      readMediaModal,
      videoInfo,
      onDecolle,
      onProgramme,
      notifyCreateOcc,
      hive,
      confirmOcc,
      refresh,
      carouselModel,
      permissions,
      programmeOcc,
      iconWifiStatus,
      drone
    }
   },


   methods: {
    async onUpdates(/* arguments de l'événement */) {
      await missions_occurrences()
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

.container {
  position: relative;
  top: 4px;
  width: 100%;
  height: 100%;
  transition: transform 0.3s ease-in-out;
}

.container:hover {
  transform: scale(1, 1.1);
}

.card-video {
  background-color: rgba(0, 0, 0, 0.5);
}

</style>
