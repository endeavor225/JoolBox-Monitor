<template>
  <q-page class="q-pa-sm" style="background-color: #efefef">

    <div class="q-pl-sm q-pr-sm q-pb-md">
      <div class="row no-wrap items-center q-mt-md q-pa-sm ">
        <div style="border-left: 2px solid #55AAA0">
          <span class="q-pl-sm text-primary text-subtitle2" style="font-size: 18px; position: relative; top: 2px;">
            Nouvelle box
          </span>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-8 col-lg-8 q-pl-md q-pr-lg">
        <q-card flat style="border-radius: 15px;  height: 670px;" class="q-pa-md">

          <div id="mapid" style="height: 595px; border-radius: 15px;" class="q-pa-md"> </div>

          <q-card-section class="q-pl-none" >
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

      <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4  q-pl-md q-pr-md">
        <q-card flat style="border-radius: 15px; height: 360px" class="q-pa-sm">

          <q-card-section class="text-subtitle1">
            Informations de la ruche
          </q-card-section>

          <div class="q-mt-none">
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
                    (val) => val.length <= 25 || 'Veuillez utiliser 25 caractères maximum',
                  ]"
                >
                  <template v-slot:prepend>
                    <q-avatar square size="20px">
                      <img :src="formData.name ? 'drone_form_active.svg' : 'drone_form.svg' "/>
                    </q-avatar>
                  </template>
                </q-input>

                <q-input
                  filled
                  dense
                  type="number"
                  placeholder="Rayon d'activité"
                  v-model="formData.radius_meter"
                  :rules="[
                    (val) => !!val || 'Ce champ est obligatoire',
                    (val) => val > 99  || 'Valeur superieur à 100',
                    (val) => val.length <= 5 || 'Veuillez utiliser 5 caractères maximum',
                  ]"
                >
                  <template v-slot:prepend>
                    <q-avatar square size="20px">
                      <img :src="formData.radius_meter ? 'Rayon-Action-active.svg' : 'Rayon-Action.svg' "/>
                    </q-avatar>
                  </template>
                </q-input>

                <q-item-label class="text-secondary q-mb-md" caption style="font-size: 10px; text-align: right; margin-top: -18px;">
                  Valeur minimale autorisée 100m
                </q-item-label>

                <q-input
                  filled
                  dense
                  type="number"
                  label="Altitude"
                  v-model="formData.altitude"
                  :rules="[
                    (val) => !!val || 'Ce champ est obligatoire',
                    (val) => val.length <= 3 || 'Veuillez utiliser 3 caractères maximum',
                  ]"
                >
                  <template v-slot:prepend>
                    <q-avatar square size="20px">
                      <img :src="formData.altitude ? 'Altitude.svg' : 'Altitude-dark.svg'" :style="{ opacity: formData.altitude ? 0.6 : 1}"/>
                    </q-avatar>
                  </template>
                </q-input>
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
                    type="reset"
                  >
                    <span class="text-weight-regular">Annuler</span>
                  </q-btn>

                  <q-btn
                    color="secondary"
                    class="q-mr-sm"
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
import { Notify } from 'quasar'
import { useRouter } from "vue-router"
import { useQuasar } from 'quasar';
import { defineComponent, getCurrentInstance, ref, onMounted, onBeforeMount, provide, inject, watch } from "vue";
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import NotifyModal from "components/ruche/Notify.vue";

export default defineComponent({
  name: "CreateRuche",
  components: {
    NotifyModal
  },

  setup() {
    const instance = getCurrentInstance()
    const router = useRouter()
    const $q = useQuasar()
    let link = inject("link")
    link.value = "/ruche"
    let mymap;
    var layerGroup = ref(L.layerGroup())
    let formData = ref({
      altitude: "0"
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

    onMounted (() => {
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
        drawPolyline: false,
        drawPolygon: false,
        editControls: false
      });

      var markerLayer
      mymap.on('pm:create', (e) => {

        if (e.layer instanceof L.Marker) {
          // Supprimer la couche de marqueur existante avant d'ajouter la nouvelle
          if (markerLayer) {
            mymap.removeLayer(markerLayer);
          }
          // Ajouter la nouvelle couche de marqueur à la carte et stocker sa référence
          markerLayer = e.layer;
          mymap.addLayer(markerLayer);
        }

        formData.value.lat = e.marker._latlng.lat
        formData.value.lon = e.marker._latlng.lng
      });

      getRestriction()
    })

    let onSubmit = async () => {

      if (createForm.value.validate()) {
        try {
          submitting.value = true
          if (!formData.value.lat || !formData.value.lon) {
            Notify.create({
              message: 'Veuillez selectionner un emplacement',
              type: 'negative',
            })
            submitting.value = false
          } else {

            api({
              method: 'post',
              url: '/hives',
              data: formData.value,
              headers: {
                'Authorization': `Basic ${token}`
              }
            }).then( async (response) => {
              notify.value = true

              /* Recuperer la ruche ajoutée */
              api({
                method: 'get',
                url: '/hives/:id',
                params: {
                  id: response.data[0].id
                },
                headers: {
                  'Authorization': `Basic ${token}`
                }
              }).then(async (res) => {
                localStorage.setItem('itemRuche', JSON.stringify(res.data))
                submitting.value = false
                setTimeout(() =>{
                  notify.value = false
                  router.push({ name: 'detail-ruche' })
                }, 1000)
              })
            }).catch( (err) => {
              submitting.value = false
              if (err.response.status === 403) {
                  $q.notify({
                    type: 'negative',
                    position: 'bottom',
                    message: "Vous n'êtes pas autorisé à créer une box"
                  })
                }
            })
          }
        } catch (error) {
          console.log(error);
        }
      }
    }

    let onReset = async () => {
      formData.value.name = "",
      formData.value.radius_meter = "",
      formData.value.altitude = 0
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
      createForm,
      onSubmit,
      onReset,
      zones,
      notify,
      submitting,
    }
   }
});

</script>
<style scoped>

</style>
