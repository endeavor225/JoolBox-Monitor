<template>
  <q-page class="q-pa-sm" style="background-color: #efefef">
    <div class="q-pl-sm q-pr-sm q-pb-md">
      <div class="row no-wrap items-center q-mt-md q-pa-sm ">
        <div style="border-left: 2px solid #55AAA0">
          <span class="q-pl-sm text-primary text-subtitle2" style="font-size: 18px; position: relative; top: 2px;">
            Nouvelle mission
          </span>
        </div>
      </div>
    </div>

    <div class="row q-gutter-y-md">
      <div class="col-xs-12 col-sm-12 col-md-8 col-lg-8 q-pl-md q-pr-lg">
        <q-card flat style="border-radius: 15px; min-height: 670px;" class="q-pa-md">

          <div id="mapid" style="height: 595px; border-radius: 15px;" class="q-pa-md"> </div>

          <q-card-section class="q-pa-none q-mt-lg">
            <div class="row">
              <div class="q-col-gutter-x-lg">
                <q-toggle
                  size="sm"
                  v-model="zones.zoneR"
                  checked-icon="check"
                  color="green"
                >
                  <span class="text-weight-light" style="font-size: 13px;" >Zone R</span> <q-icon name="img:Zone/zoneR.svg" size="18px"  style="top: -1px;"/>
                </q-toggle>

                <q-toggle
                  size="sm"
                  v-model="zones.zoneP"
                  checked-icon="check"
                  color="green"
                >
                <span class="text-weight-light" style="font-size: 13px;" >Zonz P</span> <q-icon name="img:Zone/zoneP.svg" size="18px"  style="top: -1px;"/>
                </q-toggle>

                <q-toggle
                  size="sm"
                  v-model="zones.zoneD"
                  checked-icon="check"
                  color="green"
                >
                  <span class="text-weight-light" style="font-size: 13px;" >Zone D</span> <q-icon name="img:Zone/zoneD.svg" size="18px"  style="top: -1px;"/>
                </q-toggle>

                <q-toggle
                  size="sm"
                  v-model="zones.aerodrome"
                  checked-icon="check"
                  color="green"
                >
                  <span class="text-weight-light" style="font-size: 13px;" >Aérodrome</span>  <q-icon name="img:Zone/aerodrome.svg" size="18px"  style="top: -1px;"/>
                </q-toggle>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4  q-pl-md q-pr-md">
        <q-card flat style="border-radius: 15px; height: 370px" class="q-pa-sm">

          <q-card-section class="text-subtitle1">
            Création de mission
          </q-card-section>

          <div class="q-mt-sm">
            <q-form
              ref="createForm"
              @submit="onSubmit"
              @reset="onReset"
            >
              <q-card-section class="text-subtitle1">
                <q-input
                  filled
                  dense
                  class="q-mb-xs"
                  type="test"
                  placeholder="Nom"
                  v-model="formData.name"
                  :rules="[
                    (val) => !!val || 'Ce champ est obligatoire',
                    (val) => val.length > 2 ||  '3 caractères minimun',
                    (val) => val.length < 25 || 'Champ trop long',
                  ]"
                >
                  <template v-slot:prepend>
                    <q-avatar square size="20px">
                      <img :src="formData.name ? 'drone_form_active.svg' : 'drone_form.svg' "/>
                    </q-avatar>
                  </template>
                </q-input>

                <q-select
                  filled
                  dense
                  class="q-mb-xs"
                  label="Senseur"
                  :options="optionCamera"
                  option-label="name"
                  option-value="id"
                  v-model="formData.sensor"
                  :rules="[ (val) => !!val || 'Ce champ est obligatoire']"
                >
                  <template v-slot:prepend>
                    <q-avatar square size="20px">
                      <img :src="formData.resolution ? 'drone_form_active.svg' : 'drone_form.svg' "/>
                    </q-avatar>
                  </template>
                </q-select>

                <q-input
                  filled
                  dense
                  type="number"
                  label="Résolution au sol"
                  v-model="formData.resolution"
                  :rules="[
                    (val) => !!val || 'Ce champ est obligatoire',
                    (val) => val > 0 && val <= 5000 || 'Valeur non autorisée',
                  ]"
                >
                  <template v-slot:prepend>
                    <q-avatar square size="20px">
                      <img :src="formData.senser ? 'superficies_totale_active.svg' : 'superficies_totale.svg' "/>
                    </q-avatar>
                  </template>
                </q-input>

                <q-item-label class="text-secondary" caption style="font-size: 10px; text-align: right; margin-top: -15px;">Cm par pixel (valeur minimale autorisée supérieur à 0)</q-item-label>
              </q-card-section>

              <q-card-actions class="q-mr-sm" align="right">
                <div class="q-gutter-md">
                  <q-btn
                    color="black"
                    outline
                    no-caps
                    style="border-radius: 5px; width: 100px;"
                    padding="sm"
                    unelevated
                    type="reset"
                  >
                    <span class="text-weight-regular">Annuler</span>
                  </q-btn>

                  <q-btn
                    color="secondary"
                    class=""
                    no-caps
                    style="border-radius: 5px; width: 160px"
                    padding="sm"
                    unelevated
                    type="submit"
                    :loading="submitting"
                  >
                    <span class="text-weight-regular">Valider</span>
                    <template v-slot:loading>
                      <q-spinner-facebook />
                    </template>
                  </q-btn>
                </div>
              </q-card-actions>
            </q-form>
          </div>
        </q-card>
      </div>
    </div>
  </q-page>

  <q-dialog
    v-model="notify"
    seamless
    transition-show="slide-up" transition-hide="slide-down"
  >
    <NotifyModal/>
  </q-dialog>
</template>

<script>
import { api } from "boot/axios";
import $ from "jquery";
import lodash from "lodash";
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import { useRouter } from "vue-router"
import { useQuasar } from 'quasar';
import { defineComponent, getCurrentInstance, ref, onMounted, provide, inject, watch } from "vue";
import NotifyModal from "components/mission/Notify.vue";

export default defineComponent({
  name: "CreateMission",
  components: {
    NotifyModal
  },

  setup() {
    const router = useRouter()
    const $q = useQuasar()
    let mymap;
    var layerGroup = ref(L.layerGroup())
    let formData = ref({})
    let createForm = ref();
    const restricts = [];
    let zones = ref({
      zoneP : false,
      zoneR : false,
      aerodrome : false,
      zoneD : false,
    })
    let ruches = ref([])
    let notify = ref(false)
    provide("notify", notify)
    const optionCamera = ref([])
    const submitting = ref(false)
    let link = inject("link")
    link.value = "/dashboard"
    let boxSelect = ref({})
    let coodsValid = ref(false)

    const token = $q.cookies.get('jool_auth_token')
    if(!token) router.push('/')

    onMounted( async () => {
      let Jawg_Streets = L.tileLayer('https://{s}.tile.jawg.io/jawg-streets/{z}/{x}/{y}{r}.png?access-token={accessToken}', {
        attribution: '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        minZoom: 6,
        maxZoom: 22,
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
        attribution: '',
        minZoom: 6,
        maxZoom: 19,
      });

      //Affichage de la map
      mymap = L.map('mapid', {
        layers: [Jawg_Streets,]
      }).setView([7.674076, -5.580024], 7);

      mymap.addLayer(layerGroup.value);

      async function onLocationFound(e) {
        //console.log("position", e.latlng);
      }

      var baseLayers = {
        "Jawg Streets": Jawg_Streets,
        "Google Streets": googleStreets,
        "Google Hybrid": googleHybrid,
        "Map Arcgisonline": arcgisonline,
      };
      L.control.layers(baseLayers).addTo(mymap);

      mymap.locate({});
      mymap.on("locationfound", onLocationFound);

      /* Initialisation de Geoman */
      mymap.pm.setLang('fr');

      var markerLayer
      mymap.on('pm:create', (e) => {
        if (e.layer instanceof L.Polygon) {
          if (markerLayer) {
            mymap.removeLayer(markerLayer);
          }
          markerLayer = e.layer;
          mymap.addLayer(markerLayer);
        }

        if (e.layer instanceof L.Polyline) {
          if (markerLayer) {
            mymap.removeLayer(markerLayer);
          }
          markerLayer = e.layer;
          mymap.addLayer(markerLayer);
        }

        if (e.shape === "Line") {
          formData.value.type = 3
          formData.value.polyline = e.marker._latlngs

          let horsRayon = e.marker._latlngs.filter((item, index) => {
            let point = L.latLng(item.lat, item.lng);
            let circle = L.circle([boxSelect.value[0].lat, boxSelect.value[0].lon], boxSelect.value[0].radius_meter)
            let distance = circle.getLatLng().distanceTo(point);
            let isInsideCircle = distance <= boxSelect.value[0].radius_meter

            return isInsideCircle == false
          })

          if(horsRayon.length){
            $q.notify({
              type: 'negative',
              position: 'bottom',
              message: "Certains points sont à l'extérieur du rayon !"
            })
          } else {
            coodsValid.value = true
          }
        }

        if (e.shape === 'Polygon') {
          formData.value.type = 1
          formData.value.polygone = e.marker._latlngs[0]
          formData.value.polygone.push(e.marker._latlngs[0][0])

          let horsRayon = e.marker._latlngs[0].filter((item, index) => {
            let point = L.latLng(item.lat, item.lng);
            let circle = L.circle([boxSelect.value[0].lat, boxSelect.value[0].lon], boxSelect.value[0].radius_meter)
            let distance = circle.getLatLng().distanceTo(point);
            let isInsideCircle = distance <= boxSelect.value[0].radius_meter

            return isInsideCircle == false
          })

          if(horsRayon.length){
            $q.notify({
              type: 'negative',
              position: 'bottom',
              message: "Certains points sont à l'extérieur du rayon !"
            })
          } else {
            coodsValid.value = true
          }
        }
      });

      await findSenseur()
      await getRuches()
      await getRestriction()
    })

    watch(() => boxSelect.value, async(newValue, oldValue) => {
      if (boxSelect.value.length) {
        mymap.pm.addControls({
          position: 'topleft',
          drawCircle: false,
          drawText: false,
          drawCircleMarker: false,
          drawRectangle: false,
          cutPolygon: false,
          rotateMode: false,
          drawMarker: false,
          editControls: false
        });
      }
    });

    /* Fonction pour recuperer les box */
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
        //console.log("box =>",response.data);
        ruches.value = response.data
        for (const iterator of response.data) {
          const customIcon = L.divIcon({
            html: iterator.id,
            className: 'my-custom-icons',
            iconSize: [24, 28],
            iconAnchor:[12, 14],
            popupAnchor:[0, -15]
          });

          let marker = L.marker([iterator.lat, iterator.lon],{icon: customIcon}, ).bindPopup(`${iterator.name}
            <div style="text-align: center; margin-top:10px">
              <button
                type="button"
                ruche_id="`+iterator.id+`"
                class="selected cursor-pointer";
                style="background-color: #26A69A;
                border: none;
                color: white;
                border-radius: 8px;
                padding: 5px 10px;
                display: inline-block;"
                id="close-button"
              >
                Sélectionner
              </button>
            </div>
          `)
          let raduis = L.circle([iterator.lat, iterator.lon], iterator.radius_meter, {color: "white", fillOpacity: 0})
          layerGroup.value.addLayer(marker)
          layerGroup.value.addLayer(raduis)

          marker.on('popupopen', () => {
            const closeButton = document.getElementById('close-button');
            closeButton.addEventListener('click', () => {
              mymap.closePopup();
            });
          });
        }
      }).catch( (err) => {
        console.log("err",err);
      })
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

          let restrictionArea = Object.entries(restrictionsTab.value)
          for (const iterator of restrictionArea) {
            let area = []
            for (const item of iterator[1]) {
              area.push([item.lat, item.lon])
            }
            let restrict = L.polygon(area, {color: 'red'}).bindPopup(`<b>${iterator[1][0].name}</b> avec altitude minimun: ${iterator[1][0].altitude_inf}m et altitude maximun: ${iterator[1][0].altitude_sup}m`)
            //layerGroup.value.addLayer(restrict)
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

    /* Fonction pour récupérer les senseur */
    let findSenseur = async () => {
      await api({
        method: 'get',
        url: '/cameras',
        headers: {
          'Authorization': `Basic ${token}`
        }
      }).then( async (response) => {
        optionCamera.value = response.data
      }).catch( (err) => {
        console.log("err",err);
      })
    }

    let onSubmit = async () => {
      submitting.value = true
      if (createForm.value.validate()) {
        if (!formData.value.polygone && !formData.value.polyline) {
          submitting.value = false
          $q.notify({
            message: 'Veuillez déssiner une zone',
            type: 'negative',
          })
        } else {
          if (!coodsValid.value) {
            submitting.value = false
            $q.notify({
              type: 'negative',
              position: 'bottom',
              message: "Certains points sont à l'extérieur du rayon !"
            })
          } else {
            try {
              api({
                method: 'post',
                url: '/missions',
                data: formData.value,
                headers: {
                  'Authorization': `Basic ${token}`
                }
              }).then((res)=>{
                try {
                  api({
                    method: 'get',
                    url: '/missions/:id',
                    params: {
                      id: res.data
                    },
                    headers: {
                      'Authorization': `Basic ${token}`
                    }
                  }).then( async (response) => {
                    localStorage.setItem('mission', response.data.id)
                    submitting.value = false
                    notify.value = true

                    setTimeout(() =>{
                      notify.value = false
                      router.push("detail-mission")
                    }, 2000)
                  })
                } catch (error) {
                  console.log(error);
                }
              }).catch((err)=>{
                submitting.value = false
                if (err.response.status === 403) {
                  $q.notify({
                    type: 'negative',
                    position: 'bottom',
                    message: "Vous n'êtes pas autorisé de créer une mission"
                  })
                }
                else {
                  $q.notify({
                    type: 'negative',
                    position: 'bottom',
                    message: "Erreur de création de mission"
                  })
                }
              });
            } catch (error) {
              submitting.value = false
              console.log(error);
            }
          }
        }
      }
    }


    var circle = null
    $(function() {
      $('body').on('click', ".selected", async function() {
        let id = $(this).attr("ruche_id")

        boxSelect.value = ruches.value.filter(item => {
          return item.id == id;
        })

        if (circle) {
          mymap.removeLayer(circle);
        }
        circle = L.circle(L.latLng(boxSelect.value[0].lat, boxSelect.value[0].lon), {
          opacity: 0,
          fillOpacity: 0,
          radius: boxSelect.value[0].radius_meter
        }).addTo(mymap);
        let bounds = circle.getBounds()
        mymap.fitBounds(bounds);
      })
    })

    let onReset = async () => {
      formData.value.name = null,
      formData.value.sensor = null,
      formData.value.resolution = null
    }
    return {
      formData,
      value: ref(true),
      createForm,
      onSubmit,
      onReset,
      zones,
      notify,
      optionCamera,
      submitting
    }
   }
});
</script>
<style scoped>
.vertical-line {
    border-left: 2px solid #55AAA0;
    margin-right: 5px;
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
