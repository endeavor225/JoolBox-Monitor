<template>
  <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 q-pl-md q-pr-md">
    <q-card flat style="border-radius: 15px; " class="q-pa-md">
      <q-card-section class="text-subtitle1">
        <q-item-section>
          <q-item-label class="" style="border-left: 2px solid #55AAA0; height: 20px;">
            <span class="q-pl-xs text-primary">Analyses graphiques </span>
            <span>Zones de vol</span>
          </q-item-label>
        </q-item-section>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="row">
          <div>
            <img
              :src="verticalSlice"
              style="height: auto; max-width: 100%;"
          />
          </div>
        </div>

        <div class="row">
          <div>
            <img
              :src="caption"
              style="height: auto; max-width: 100%;"
          />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { defineComponent, getCurrentInstance, ref, onMounted, onBeforeMount, watch, provide, inject } from "vue";
export default defineComponent({
  // name: 'ComponentName',
  props: {
    idMission: {
      default() {
        return {};
      },
    },
  },

  setup (props) {
    let missionId = ref(props.idMission)
    let verticalSlice = ref(`vertical-slices/VerticalSlice_${missionId.value}.png`)
    let caption = ref(`vertical-slices/Captions_${missionId.value}.png`)

    return {
      verticalSlice,
      caption
    }
  }
})
</script>
