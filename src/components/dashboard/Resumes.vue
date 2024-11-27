<template>
  <div class="row">
    <div class="col-xs-12 col-sm-12 col-md-7 col-lg-7">
      <div class="q-ml-md q-mt-md text-h4">Activités</div>

      <div class="q-pa-xs row">
        <div class="col-xs-12 col-md-4 col-sm-6 col-lg-4 q-pa-sm">
          <q-card flat style="border-radius: 10px; height: 85px;">
            <q-card-section class="q-pa-sm">
              <q-item class="q-pa-none q-pt-xs">
                <q-item-section v-if="!occurrences.scheduled" avatar class="q-pr-sm">
                  <span class="text-h6 q-pa-xs">
                    <q-skeleton type="circle" size="55px" />
                  </span>
                </q-item-section>

                <q-item-section v-else avatar class="q-pt-md q-pb-md q-pa-xs">
                  <span class="text-h6 count" data-from="0" :data-to="occurrences.scheduled" style="font-size: 70px"></span>
                </q-item-section>

                <q-item-section>
                  <q-item-label class="text-h6">
                    <q-icon name="img:date-Programmee.svg" size="29px" />
                  </q-item-label>
                  <q-item-label lines="1" class="text-subtitle1">Programmées </q-item-label>
                </q-item-section>
              </q-item>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-xs-12 col-md-4 col-sm-6 col-lg-4 q-pa-sm">
          <q-card flat style="border-radius: 10px; height: 85px;">
            <q-card-section class="q-pa-sm">
              <q-item class="q-pa-none q-pt-xs">
                <q-item-section v-if="!occurrences.progress" avatar class="q-pr-sm">
                  <span class="text-h6 q-pa-xs">
                    <q-skeleton type="circle" size="55px" />
                  </span>
                </q-item-section>

                <q-item-section v-else avatar class="q-pt-md q-pb-md q-pa-xs">
                  <span class="text-h6 count" data-from="0" :data-to="occurrences.progress" style="font-size: 70px"></span>
                </q-item-section>

                <q-item-section>
                  <q-item-label class="text-h6">
                    <q-icon name="img:date-en-cours.svg" size="29px" />
                  </q-item-label>
                  <q-item-label lines="1" class="text-subtitle1">En cours</q-item-label>
                </q-item-section>
              </q-item>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-xs-12 col-md-4 col-sm-6 col-lg-4 q-pa-sm">
          <q-card flat style="border-radius: 10px; height: 85px;">
            <q-card-section class="q-pa-sm">
              <q-item class="q-pa-none q-pt-xs">
                <q-item-section v-if="!occurrences.abort" avatar class="q-pr-sm">
                  <span class="text-h6 q-pa-xs">
                    <q-skeleton type="circle" size="55px" />
                  </span>
                </q-item-section>

                <q-item-section v-else avatar class="q-pt-md q-pb-md q-pa-xs">
                  <span class="text-h6 count" data-from="0" :data-to="occurrences.abort" style="font-size: 70px"></span>
                </q-item-section>

                <q-item-section>
                  <q-item-label class="text-h6">
                    <q-icon name="img:date-annulee.svg" size="29px" />
                  </q-item-label>
                  <q-item-label lines="1" class="text-subtitle1">Annulés</q-item-label>
                </q-item-section>
              </q-item>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-xs-12 col-md-4 col-sm-6 col-lg-4 q-pa-sm">
          <q-card flat style="border-radius: 10px; height: 85px;">
            <q-card-section class="q-pa-sm">
              <q-item class="q-pa-none q-pt-xs">
                <q-item-section v-if="!occurrences.done" avatar class="q-pr-sm">
                  <span class="text-h6 q-pa-xs">
                    <q-skeleton type="circle" size="55px" />
                  </span>
                </q-item-section>

                <q-item-section v-else avatar class="q-pt-md q-pb-md q-pa-xs">
                  <span class="text-h6 count" data-from="0" :data-to="occurrences.done" style="font-size: 70px"></span>
                </q-item-section>

                <q-item-section>
                  <q-item-label class="text-h6">
                    <q-icon name="img:date-terminee.svg" size="29px" />
                  </q-item-label>
                  <q-item-label lines="1" class="text-subtitle1">Terminés</q-item-label>
                </q-item-section>
              </q-item>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-xs-12 col-md-4 col-sm-6 col-lg-4 q-pa-sm">
          <q-card flat style="border-radius: 10px; height: 85px;">
            <q-card-section class="q-pa-sm">
              <q-item class="q-pa-none q-pt-xs">
                <q-item-section v-if="!missions.pending" avatar class="q-pr-sm">
                  <span class="text-h6 q-pa-xs">
                    <q-skeleton type="circle" size="55px" />
                  </span>
                </q-item-section>

                <q-item-section v-else avatar class="q-pt-md q-pb-md q-pa-xs">
                  <span class="text-h6 count" data-from="0" :data-to="missions.pending" style="font-size: 70px"></span>
                </q-item-section>

                <q-item-section>
                  <q-item-label class="text-h6">
                    <q-icon
                      name="img:date-attente-validation.svg"
                      size="29px"
                    />
                  </q-item-label>
                  <q-item-label lines="1" class="text-subtitle1">Attente validation</q-item-label>
                </q-item-section>
              </q-item>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-xs-12 col-md-4 col-sm-6 col-lg-4 q-pa-sm">
          <q-card flat style="border-radius: 10px; height: 85px;">
            <q-card-section class="q-pa-sm">
              <q-item class="q-pa-none q-pt-xs">
                <q-item-section v-if="!missions.refused" avatar class="q-pr-sm">
                  <span class="text-h6 q-pa-xs">
                    <q-skeleton type="circle" size="55px" />
                  </span>
                </q-item-section>

                <q-item-section v-else avatar class="q-pt-md q-pb-md q-pa-xs">
                  <span class="text-h6 count" data-from="0" :data-to="missions.refused" style="font-size: 70px"></span>
                </q-item-section>

                <q-item-section>
                  <q-item-label class="text-h6">
                    <q-icon name="img:date-refusee.svg" size="29px" />
                  </q-item-label>
                  <q-item-label lines="1" class="text-subtitle1">Refusées</q-item-label>
                </q-item-section>
              </q-item>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <div class="col-xs-12 col-sm-12 col-md-5 col-lg-5 q-pr-md">
      <q-card class="text-white card-bg">
        <div class="row justify-between q-ma-sm" style="position: relative; bottom: -70%">
          <div class="col-7 q-pt-sm text-subtitle2">
            <span class="text-subtitle2 q-pl-md" style="font-size: 26px"> {{ auth.company_name }}</span>
          </div>
          <div class="col-5 q-pt-sm q-pr-md" style="text-align: right">
            <span class="text-subtitle2" style="font-size: 24px"> {{ $date(dateDuJour) }}</span>
            <q-icon class="q-ml-sm" name="img:email.svg" size="30px" style="bottom: 5px">
              <q-badge rounded color="red" floating style="font-size: 10px; margin-right: -5px;">+9</q-badge>
            </q-icon>
          </div>
        </div>
      </q-card>
    </div>
  </div>
</template>

<script>
import { api } from "boot/axios";
import $ from 'jquery'
import { useQuasar } from 'quasar'
import {countTo} from 'jquery-countto'
import { defineComponent, getCurrentInstance, ref, onMounted, onBeforeMount } from "vue";
export default defineComponent({
  name: "Resumes",

  setup() {
    const instance = getCurrentInstance()
    const $q = useQuasar()
    const token = $q.cookies.get('jool_auth_token')

    let dateDuJour = ref(new Date())
    const missions = ref({})
    const occurrences = ref({})
    let limit = ref(8)
    let offset = ref(0)
    let auth = ref(JSON.parse(localStorage.getItem('auth')))

    onBeforeMount(async () => {
      await api({
        method: 'get',
        url: '/occurrences/count/occ_state',
        headers: {
          'Authorization': `Basic ${token}`
        }
      }).then(async (response) => {

        occurrences.value = {
          progress: '0',
          abort: '0',
          done: '0',
          scheduled: '0',
        };

        for (const iterator in response.data) {
          response.data[iterator].forEach((element) => {
            if (element.state === 1) occurrences.value.scheduled++
            if (element.state === 2 || element.state === 3 || element.state === 4 || element.state === 5) occurrences.value.progress++
            if (element.state === 6) occurrences.value.done++
            if (element.state === 7) occurrences.value.abort++
          });
        }
        await runCount()
      }).catch( (err) => {
        console.log("err",err);
      })

      await api({
        method: 'get',
        url: '/missions/total/count',
        headers: {
          'Authorization': `Basic ${token}`
        }
      }).then(async (response) => {
        missions.value = {
          pending: '0',
          refused: '0',
        };

        for (const iterator in response.data) {
          switch (parseInt(iterator)) {
            case 1:
              missions.value.pending = response.data[iterator].length;
              break;

            case 3:
              missions.value.refused = response.data[iterator].length;
              break;
          }
        }

        await runCount()
      }).catch( (err) => {
        console.log("err",err);
      })
    })

    let runCount = async () => {
      $(function() {
        $('.count').countTo();
      })
    }

    return {
      dateDuJour,
      missions,
      occurrences,
      auth,
    };
  },
});
</script>
<style scoped>
.card-bg {
  background: url("../../../public/Bg-profile.png");
  background-repeat: no-repeat;
  background-size: cover;
  background-position-x: center;
  /* background-position-y: 30%; */
  /* background-size: 740px 255px; */
  height: 243px;
  border-radius: 30px;
}
</style>
