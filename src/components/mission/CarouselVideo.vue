<template>
  <q-card class="flex flex-center card" style="">

    <div class="" style="width: 900px;">
      <q-carousel
        swipeable
        animated
        v-model="slide"
        infinite
        navigation
        height="506px"
        arrows
        control-color="primary"
      >

      <q-carousel-slide
        v-for="item in medias"
        :name="item.media_url"
      >
        <q-video
          v-if="item.media_type === 'video'"
          class="absolute-full"
          :src="item.media_url"
        />
        <q-img
          v-if="item.media_type === null"
          class="absolute-full"
          :src="item.media_url"
        />
      </q-carousel-slide>
        <template v-slot:control>
          <q-carousel-control position="top-right" :offset="[0, 0]">
            <q-btn
              color="negative"
              icon="close"
              padding="sm"
              dense
              v-close-popup
              unelevated
              square
            />
          </q-carousel-control>
        </template>
      </q-carousel>

      <!-- <div class="row justify-center" style="position:relative; top: 20px">
        <q-btn-toggle
          glossy
          v-model="slide"
          :options="[
            { label: 1, value: 'style' },
            { label: 2, value: 'tv' },
          ]"
        />
      </div> -->

      <!-- <div class="q-mt-lg row no-wrap flex-center">
          <q-list  v-for="index in 13" :key="index" >
          <div class="q-pa-md q-ma-sm parcelle row">
            <div class="col">
              <q-item-label class="q-mb-sm" lines="1" style="font-size:18px">{{ index }}</q-item-label>
              <q-item-label caption style="font-size:15px">12h</q-item-label>
            </div>
          </div>
        </q-list>
      </div> -->


      <div class="q-mt-lg">
        <q-scroll-area style="height: 55px;"
          :thumb-style="thumbStyle"
        >
          <div class="row no-wrap flex-center q-gutter-sm">
            <div v-for="item in medias" :key="item" style="width: 80px" >
              <div class="col">
                <div v-if="item.media_type === 'video'"
                  style="position: relative; "
                  @click="onSelect(item.media_url)"
                  class="cursor-pointer thumbnail"
                >
                  <video
                    clickable v-ripple
                    :src="item.media_url"
                    style="width: 100%;"
                  >
                  </video>
                  <div class="absolute-full flex flex-center">
                    <img src="fleche_droite.svg" width="15" alt="image" class="cursor-pointer">
                  </div>
                </div>

                <q-img v-if="item.media_type === null"

                  :src="item.media_url"
                  class="cursor-pointer thumbnail"
                  clickable v-ripple
                  @click="onSelect(item.media_url)"
                />
              </div>
            </div>
          </div>
        </q-scroll-area>
      </div>

    </div>
  </q-card>
</template>

<script>
import { defineComponent, getCurrentInstance, ref, } from "vue";

export default defineComponent({
  // name: 'ComponentName',

  props: {
    medias: Object,
    return : {}
  },
  setup (props) {
    const instance = getCurrentInstance();

    let slide = ref()
    let selectCarousel = JSON.parse(sessionStorage.getItem('selectCarousel'))

    if (selectCarousel) {
      slide.value = selectCarousel.media_url
    }else{
      console.log("non");
    }

    let onSelect = (item) => {
      console.log('item', item);
      slide.value = item
    }

    return {
      //slide: ref(props.medias[0].media_url),
      slide,
      thumbStyle: {
        width: '1px',
        opacity: 0
      },
      onSelect
    }
  }
})
</script>

<style scoped>
  .card{
    background: rgba(30, 29, 29, 0.6);
    backdrop-filter: blur(3px)
  }

  .parcelle {
    color: black;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(5px)
  }

  .thumbnail{
    height: 46px;
    border-radius: 5px;
    border: 1px solid #ffffff;
    opacity: 0.4;
  }
  .thumbnail:hover {
    opacity: 1;
  }
</style>
