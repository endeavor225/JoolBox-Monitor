<template>
  <q-card style="width: 700px; max-width: 80vw; border-radius: 8px; bottom: 13%;">
    <q-card-section class="row items-center q-pb-none">
      <div class="text-h6 ">Vol n°{{ itemMedia.occ_id }}</div>
    </q-card-section>

    <q-card-section class="q-ma-xs" style="">
      <q-video v-if="itemMedia.media_type ==='video'" style="border-radius: 10px;"
        :ratio="16/9"
        :src="itemMedia.media_url"
      />

      <q-img v-if="!itemMedia.media_type" style="border-radius: 10px;"
        :ratio="16/9"
        :src="itemMedia.media_url"
      />
    </q-card-section>

    <q-btn unelevated padding="none" color="negative" class="absolute-top-right" v-close-popup>
      <q-icon name="img:Close.svg" size="md" />
    </q-btn>
  </q-card>
</template>

<script>
import { api } from "boot/axios";
import { useQuasar } from 'quasar';
import { defineComponent, getCurrentInstance, ref, onMounted, provide, inject } from "vue";

export default defineComponent({
  // name: 'ComponentName',
  components: {
  },

  props: {
    itemMedia: {
      default() {
        return {};
      },
    },
  },

  setup (props) {
    let instance = getCurrentInstance();
    const $q = useQuasar()
    return {

    }
  }
})
</script>

<style scoped>
  .notify {
    width: 400px;
    border-radius: 15px;
    bottom: -35%;
  }
</style>
