<template>
  <q-card flat style="border-radius: 15px; margin-top: 20px; height: 260px;" class="q-pa-sm">
    <q-card-section class="text-subtitle1">
        <q-item-section>
          <q-item-label class="" style="border-left: 2px solid #55AAA0; height: 20px;">
            <span class="q-pl-xs text-primary">Médias des missions </span>
            <span>Vol n°6069</span>
          </q-item-label>
        </q-item-section>
    </q-card-section>

    <q-card-section style="margin-top: -20px;">
      <div class="q-mb-sm">
        10 photos 18 vidéos
      </div>
      <div class="row q-col-gutter-xs">
        <div class="col-3" v-for="n in 20" :key="`xs-${n}`">
          <q-img v-if="n < 8"
            src="media/IMG_4267.png"
            style="height: 80px; max-width: 130px"
          />
          <q-img v-if="n == 8"
            src="media/IMG_4267.png"
            style="height: 80px; max-width: 130px;"
          >
          <div class="absolute-full text-h4 flex flex-center">
            +{{ 20-8 }}
          </div>
          </q-img>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { defineComponent, getCurrentInstance, ref, onMounted, onBeforeMount, inject, provide, watch } from "vue";

export default defineComponent({
  // name: 'ComponentName',
  props: {
    occuSelect: {
      type: Object,
      default() {
        return {};
      },
    },
  },

  setup (props) {
    console.log("111111",props.occuSelect);
    let occurrenceInfos = inject("occurrenceInfos")
    console.log("222",occurrenceInfos.value);
    return {}
  }
})
</script>
