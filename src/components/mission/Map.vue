<template>
  <q-card flat style="border-radius: 15px;  height: 510px;" class="q-pa-md">
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-9 col-lg-9 q-pr-lg">
        <div id="mapid" class="q-pa-md"> </div>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 q-pr-lg">
        <div class="row">
          <div class="col">
            <q-toggle
              size="sm"
              v-model="zones.ctr"
              checked-icon="check"
              color="green"
            >
              <span class="text-weight-light" style="font-size: 13px;" >CTR</span>  <q-icon name="img:Zone/ctr.svg" size="18px" class="q-pl-sm"  style="top: -1px;"/>
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
        </div>

        <div class="row">
          <div class="col">
            <q-toggle
              size="sm"
              v-model="zones.zit"
              checked-icon="check"
              color="green"
            >
            <span class="text-weight-light" style="font-size: 13px;" >ZIT</span> <q-icon name="img:Zone/zit.svg" size="18px" class="q-pl-sm"  style="top: -1px;"/>
            </q-toggle>
          </div>

          <div class="col">
            <q-toggle
              size="sm"
              v-model="zones.zoneInactive"
              checked-icon="check"
              color="green"
            >
            <span class="text-weight-light" style="font-size: 13px;" >Zone Inactive</span> <q-icon name="radio_button_unchecked" class="text-blue" size="sm" />
            </q-toggle>
          </div>
        </div>

        <div class="row">
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
        </div>

        <div class="row">
          <div class="col">
            <q-toggle
              size="sm"
              v-model="zones.obstacle"
              checked-icon="check"
              color="green"
            >
            <span class="text-weight-light" style="font-size: 13px;" >Obstacle</span> <q-icon name="img:Zone/obstacle.svg" size="18px" class="q"  style="top: -1px;"/>
            </q-toggle>
          </div>

          <div class="col">
            <q-toggle
              size="sm"
              v-model="zones.ancd"
              checked-icon="check"
              color="green"
            >
            <span class="text-weight-light" style="font-size: 13px;" >A.N.C.D</span> <q-icon name="radio_button_unchecked" class="text-grey" size="sm" />
            </q-toggle>
          </div>
        </div>

        <div class="row">
          <div class="col">
            <q-toggle
              size="sm"
              v-model="zones.heliport"
              checked-icon="check"
              color="green"
            >
            <span class="text-weight-light" style="font-size: 13px;" >Heliport</span>  <q-icon name="img:Zone/heliport.svg" size="18px" class="q-pl-sm"  style="top: -1px;"/>
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
        </div>

        <div class="row">
          <div class="col">
            <q-toggle
              size="sm"
              v-model="zones.autreZone"
              checked-icon="check"
              color="green"
            >
            <span class="text-weight-light" style="font-size: 13px;" >Autre zone</span> <q-icon name="img:Zone/autreZone.svg" size="18px" class=""  style="top: -1px;"/>
            </q-toggle>
          </div>

          <div class="col">
            <q-toggle
              size="sm"
              v-model="zones.image"
              checked-icon="check"
              color="green"
            >
            <span class="text-weight-light" style="font-size: 13px;" >Image</span> <q-icon name="radio_button_unchecked" class="text-peal" size="sm" />
            </q-toggle>
          </div>
        </div>
      </div>
    </div>
  </q-card>
</template>

<script>
import { useRouter } from "vue-router";
import { useQuasar } from 'quasar';
import { defineComponent, getCurrentInstance, ref, onMounted, onBeforeMount, inject, provide, watch } from "vue";
export default defineComponent({
  //name: "Resumes",

  components: {

  },

  setup() {
    let instance = getCurrentInstance()
    const $q = useQuasar()
    const token = $q.cookies.get('jool_auth_token')

    let mymap = ref()
    var layerGroup = ref(L.layerGroup())
    let coords = inject("coords")
    let hive = inject("hive")
    let itemMission = inject("item_mission")
    let zones = ref({
      ctr : false,
      zoneP : false,
      zit : false,
      zoneInactive : false,
      zoneR : false,
      aerodrome : false,
      obstacle : false,
      ancd : false,
      heliport : false,
      zoneD : false,
      autreZone : false,
      image : false,
    })


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

      //Affichage de la map
      mymap.value = L.map('mapid', {
        layers: [Jawg_Streets],
      }).setView([coords.value.lat, coords.value.lon], coords.value.zoom);

      var baseLayers = {
        "Jawg Streets": Jawg_Streets,
        "Google Streets": googleStreets,
      };

      const customIcon = L.divIcon({
        html: hive.value.id,
        className: 'my-custom-icons',
        iconSize: [24, 28],
        iconAnchor:[12, 14],
        popupAnchor:[0, -15]
      });

        let pos = L.marker([hive.value.lat, hive.value.lon],{icon: customIcon}, ).bindPopup(`${hive.value.name}`)
        let raduis = L.circle([hive.value.lat, hive.value.lon], hive.value.radius_meter, {color: "white", fillOpacity: 0})
        layerGroup.value.addLayer(pos)
        layerGroup.value.addLayer(raduis)

      mymap.value.addLayer(layerGroup.value);

      async function onLocationFound(e) {
        //console.log("position", e.latlng);
      }

      L.control.layers(baseLayers).addTo(mymap.value);

      mymap.value.locate({});
      mymap.value.on("locationfound", onLocationFound);
    })




    return {
      zones
    };
  },
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

.my-content{
  padding: 10px 15px;
  background: rgba(86,61,124,.15);
  border: 1px solid rgba(86,61,124,.2);
}
</style>
