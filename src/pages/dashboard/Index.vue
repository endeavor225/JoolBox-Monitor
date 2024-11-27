<template>
  <q-page class="q-pa-sm" style="background-color: #efefef">

    <Resumes/>

    <div class="row q-gutter-y-sm q-mt-lg q-pl-md q-pr-md" style="margin-top: 10px;">
      <div class="col-xs-12 col-sm-12 col-md-9 ">
        <Missions/>
      </div>

      <div class="col-xs-12 col-sm-12 col-md-3 q-pl-md">
        <Calendrier/>
      </div>
    </div>
  </q-page>
</template>

<script>
import { useQuasar } from 'quasar'
import { useRouter } from "vue-router"
import { defineComponent, getCurrentInstance, inject } from "vue";
import Resumes from "components/dashboard/Resumes.vue"
import Calendrier from "components/dashboard/Calendrier.vue"
import Missions from "components/dashboard/Missions.vue"

export default defineComponent({
  name: "dashboard",

  components : {
    Resumes,
    Missions,
    Calendrier,
  },

  setup() {
    let instance = getCurrentInstance()
    const router = useRouter()
    const $q = useQuasar()
    let titlePage = inject("titlePage")
    titlePage.value = "Tableau de bord"

    const token = $q.cookies.get('jool_auth_token')
    if(!token) router.push('/')

    return {};
  },
});
</script>
<style scoped>
.vertical-line {
    border-left: 2px solid #55AAA0;
    margin-right: 5px;
  }
</style>
