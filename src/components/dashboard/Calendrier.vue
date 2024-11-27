<template>
  <q-card flat style="border-radius: 10px; height: 520px" class="q-pa-xs">
    <q-card-section class="q-pa-md flex justify-center" style="margin-bottom: -20px;">
      <q-item>
        <q-item-section avatar class="q-pa-xs">
          <span class="text-h6" style="font-size: 100px"> {{ $jour(dateDuJour) }} </span>
        </q-item-section>
        <q-item-section>
          <q-item-label
            class="text-body2" style="font-size: 42px; position: relative; bottom: -7px"> {{ $mois(dateDuJour) }}.</q-item-label>
          <q-item-label class="text-body2"  style="font-size: 42px; position: relative; bottom: 6px">{{ $annee(dateDuJour) }}</q-item-label >
        </q-item-section>
      </q-item>
    </q-card-section>

    <q-card-section v-if="occDuJour.length" class="">
      <q-scroll-area
        :thumb-style="thumbStyle"
        :bar-style="barStyle"
        style="height: 340px"
      >
        <q-list dense class="q-pa-none" v-for="item in occDuJour" :key="item">
          <q-item
            v-if="item.state === 1"
            clickable
            @click="onShowOcc(item)"
            class="q-mb-xs"
            style="background-color: #f7f7f7; border-left: 3px solid #F9EB6C"
          >
            <q-item-section class="" style="position: relative; left: -11px;">
              <q-item-label class="text-weight-light">
                <span style="opacity: 0.5">{{ $tempsFormat(item.request) }} <em>Mission</em></span> {{ item.name_mission }}
                <em style="opacity: 0.5">(occ n° {{ item.id }})</em>
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item
            v-if="item.state === 2 || item.state === 3 || item.state === 4 || item.state === 5"
            clickable
            @click="onShowOcc(item)"
            class="q-mb-xs"
            style="background-color: #f7f7f7; border-left: 3px solid #F2A83B"
          >
            <q-item-section class="" style="position: relative; left: -11px;">
              <q-item-label class="text-weight-light">
                <span style="opacity: 0.5">{{ $tempsFormat(item.request) }} <em>Mission</em></span> {{ item.name_mission }}
                <em style="opacity: 0.5">(occ n° {{ item.id }})</em>
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item
            v-if="item.state === 6"
            clickable
            @click="onShowOcc(item)"
            class="q-mb-xs"
            style="background-color: #f7f7f7; border-left: 3px solid #55aaa0"
          >
            <q-item-section class="" style="position: relative; left: -11px;">
              <q-item-label class="text-weight-light">
                <span style="opacity: 0.5">{{ $tempsFormat(item.request) }} <em>Mission</em></span> {{ item.name_mission }}
                <em style="opacity: 0.5">(occ n° {{ item.id }})</em>
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item
            v-if="item.state === 7"
            clickable
            @click="onShowOcc(item)"
            class="q-mb-xs"
            style="background-color: #f7f7f7; border-left: 3px solid #EA3223"
          >
            <q-item-section class="" style="position: relative; left: -11px;">
              <q-item-label class="text-weight-light">
                <span style="opacity: 0.5">{{ $tempsFormat(item.request) }} <em>Mission</em></span> {{ item.name_mission }}
                <em style="opacity: 0.5">(occ n° {{ item.id }})</em>
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-card-section>

    <q-card-section v-else-if="!occDuJour.length && loadingData" class="">
      <q-list  v-for="item in 5" :key="item">
        <q-item>
          <q-item-section>
            <q-item-label>
              <q-skeleton type="text" />
            </q-item-label>
            <q-item-label caption>
              <q-skeleton type="text" width="80%" />
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>

    <q-card-section v-else class="">
      <div class="flex flex-center text-body1" style="margin-top: 90px; opacity: 0.4;">
        Aucun évènement en ce jour !
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { api } from "boot/axios";
import { useRouter } from "vue-router";
import { useQuasar } from 'quasar';
import { defineComponent, getCurrentInstance, ref, onMounted, onBeforeMount } from "vue";
export default defineComponent({
  // name: 'Calendrier',
  setup() {
    const instance =  getCurrentInstance()
    const router = useRouter()
    const $q = useQuasar()
    let dateDuJour = ref(new Date())
    const token = $q.cookies.get('jool_auth_token')
    let occDuJour = ref([])
    const loadingData = ref(true)

    onBeforeMount(async () => {
      try {
        await api({
          method: 'get',
          url: '/occurrences/count/occ_today',
          headers: {
            'Authorization': `Basic ${token}`
          }
        }).then(async (res) => {
          occDuJour.value = [...res.data]
          loadingData.value = false
        })
      } catch (error) {
        console.log("error", error);
      }
    })

    let onShowOcc = (item) => {
      localStorage.setItem('id_occ_miss', item.id)
      localStorage.setItem('mission', item.mission_id)
      router.push('detail-mission')
    }

    return {
      dateDuJour,
      occDuJour,
      onShowOcc,
      loadingData,

      thumbStyle: {
        right: '3px',
        borderRadius: '4px',
        backgroundColor: '#027be3',
        width: '4px',
        opacity: 0.75
      },

      barStyle: {
        right: '2px',
        borderRadius: '9px',
        backgroundColor: '#027be3',
        width: '5px',
        opacity: 0.2
      }
    };
  },
});
</script>
