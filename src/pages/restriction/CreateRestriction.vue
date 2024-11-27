<template>
  <q-page class="q-pa-sm" style="background-color: #efefef">
    <div class="q-pl-sm q-pr-sm q-pb-md">
      <div class="row no-wrap items-center q-mt-md q-pa-sm ">
        <div style="border-left: 2px solid #55AAA0">
          <span class="q-pl-sm text-primary text-subtitle2" style="font-size: 18px; position: relative; top: 2px;">
            Nouvelle restriction
          </span>
        </div>
      </div>
    </div>

    <div class="row q-gutter-y-md">
      <div class="col-xs-12 col-sm-12 col-md-8 col-lg-8 q-pl-md q-pr-lg">
        <q-card flat style="border-radius: 15px; min-height: 670px;" class="q-pa-md">

          <div id="mapid" style="height: 595px; border-radius: 15px;" class="q-pa-md"> </div>

          <q-card-section class="q-pl-none">
            <div class="row">
              <div class="q-col-gutter-x-lg">
                <q-toggle
                  size="sm"
                  v-model="zones.zoneR"
                  checked-icon="check"
                  color="green"
                >
                  <span class="text-weight-light" style="font-size: 13px;">Zone R</span> <q-icon name="img:Zone/zoneR.svg" size="18px" style="top: -1px;"/>
                </q-toggle>

                <q-toggle
                  size="sm"
                  v-model="zones.zoneP"
                  checked-icon="check"
                  color="green"
                >
                <span class="text-weight-light" style="font-size: 13px;">Zonz P</span> <q-icon name="img:Zone/zoneP.svg" size="18px" style="top: -1px;"/>
                </q-toggle>

                <q-toggle
                  size="sm"
                  v-model="zones.zoneD"
                  checked-icon="check"
                  color="green"
                >
                  <span class="text-weight-light" style="font-size: 13px;">Zone D</span> <q-icon name="img:Zone/zoneD.svg" size="18px" style="top: -1px;"/>
                </q-toggle>

                <q-toggle
                  size="sm"
                  v-model="zones.aerodrome"
                  checked-icon="check"
                  color="green"
                >
                  <span class="text-weight-light" style="font-size: 13px;">Aérodrome</span>  <q-icon name="img:Zone/aerodrome.svg" size="18px" style="top: -1px;"/>
                </q-toggle>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4  q-pl-md q-pr-md">
        <q-card flat style="border-radius: 15px; height: 280px; max-height: 300px" class="q-pa-sm">

          <q-card-section class="text-subtitle1 q-pb-none">
            Ajouter restriction
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
                  v-model="formData.nom"
                  :rules="[
                    (val) => !!val || 'Ce champ est obligatoire',
                    (val) => val.length > 2 ||  '3 caractères minimun',
                    (val) => val.length < 25 || 'Champ trop long',
                  ]"
                >
                  <template v-slot:prepend>
                    <q-avatar square size="16px">
                      <img :src="formData.nom ? 'echec-active.svg' : 'echec.svg' "/>
                    </q-avatar>
                  </template>
                </q-input>

                <div class="row q-gutter-x-lg">
                  <div class="col">
                    <q-input
                      filled
                      dense
                      class=""
                      type="number"
                      label="Altitude min"
                      v-model="formData.altitude_inf"
                      :rules="[
                        (val) => !!val || 'Ce champ est obligatoire',
                        (val) => val >= 0 && val <= 79 || 'Valeur non autorisée',
                      ]"
                    >
                      <template v-slot:prepend>
                        <q-avatar square size="16px">
                          <img :src="formData.altitude_inf ? 'Altitude.svg' : 'Altitude-dark.svg'" :style="{ opacity: formData.altitude_inf ? 0.8 : 1}"/>
                        </q-avatar>
                      </template>
                    </q-input>
                  </div>

                  <div class="col">
                    <q-input
                      filled
                      dense
                      class=""
                      type="number"
                      label="Altitude max"
                      v-model="formData.altitude_sup"
                      :rules="[
                        (val) => !!val || 'Ce champ est obligatoire',
                        (val) => val >= 80 && val <= 1000 || 'Valeur non autorisée',
                      ]"
                    >
                      <template v-slot:prepend>
                        <q-avatar square size="16px">
                          <img :src="formData.altitude_sup ? 'Altitude.svg' : 'Altitude-dark.svg'" :style="{ opacity: formData.altitude_sup ? 0.8 : 1}"/>
                        </q-avatar>
                      </template>
                    </q-input>
                  </div>

                </div>
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
import lodash from "lodash";
import { api } from "boot/axios";
import { useRouter } from "vue-router"
import { useQuasar } from 'quasar'
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import { defineComponent, getCurrentInstance, ref, onMounted, provide, inject, watch } from "vue";
import NotifyModal from "components/restriction/Notify.vue";

export default defineComponent({
  name: "CreateRestriction",
  components: {
    NotifyModal
  },

  setup() {
    const router = useRouter()
    const $q = useQuasar()
    let link = inject("link")
    link.value = "/restriction"
    let mymap
    var layerGroup = ref(L.layerGroup())
    let formData = ref({
      altitude_inf: "0",
      altitude_sup: 1000
    })
    let createForm = ref();
    const restricts = [];
    let zones = ref({
      zoneP : false,
      zoneR : false,
      aerodrome : false,
      zoneD : false,
    })
    let notify = ref(false)
    provide("notify", notify)
    const submitting = ref(false)

    const token = $q.cookies.get('jool_auth_token')
    if(!token) router.push('/')

    onMounted ( async () => {
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

      //Affichage de la map
      mymap = L.map('mapid', {
        layers: [Jawg_Streets,],

      }).setView([7.674076, -5.580024], 7);

      mymap.addLayer(layerGroup.value);

      async function onLocationFound(e) {
        //console.log("position", e.latlng);
      }

      var baseLayers = {
        "Jawg Streets": Jawg_Streets,
        "Google Streets": googleStreets,
        "Google Hybrid": googleHybrid,
      };

      L.control.layers(baseLayers).addTo(mymap);

      mymap.locate({});
      mymap.on("locationfound", onLocationFound);

      /* Initialisation de Geoman */
      mymap.pm.setLang('fr');

      mymap.pm.addControls({
        position: 'topleft',
        drawCircle: false,
        drawText: false,
        drawCircleMarker: false,
        drawRectangle: false,
        cutPolygon: false,
        rotateMode: false,
        drawMarker: false,
        drawPolyline: false,
        editMode: false,
        editControls: false
      });

      mymap.on('pm:drawstart', (e) => {
        mymap.eachLayer(function (layer) {
          if (layer instanceof L.Polygon) {
            mymap.removeLayer(layer);
          }
        });
      });

      mymap.on('pm:create', (e) => {
        if (e.shape === 'Polygon') {
          formData.value.polygone = e.marker._latlngs[0]
        }
      });

      await getRestriction()
    })

    let onSubmit = async () => {
      submitting.value = true
      if (createForm.value.validate()) {
        if (!formData.value.polygone) {
          submitting.value = false
          $q.notify({
            message: 'Veuillez déssiner un polygone',
            type: 'negative',
          })
        } else {
          try {
            await api({
              method: 'post',
              url: '/restrictions',
              data: formData.value,
              headers: {
                'Authorization': `Basic ${token}`
              }
            }).then( async (response) => {
              notify.value = true
              localStorage.setItem('restriction', response.data[0].id)
              submitting.value = false
              setTimeout(() =>{
                notify.value = false
                router.push("restriction")
            }, 1000)
            }).catch( (err) => {
              console.log("err",err);
              submitting.value = false

              if (err.response.status) {
                  $q.notify({
                    type: 'negative',
                    position: 'bottom',
                    message: "Vous n'êtes pas autorisé a créer une restriction"
                  })
                }
            })
          } catch (error) {
            console.log(error);
          }
        }
      }
    }

    let onReset = async () => {
      formData.value.nom = "",
      formData.value.senser = "",
      formData.value.resolution = ""
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

    return {
      formData,
      value: ref(true),
      createForm,
      onSubmit,
      onReset,
      zones,
      notify,
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
</style>
