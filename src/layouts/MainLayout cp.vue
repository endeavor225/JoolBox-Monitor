<template>
  <q-layout view="lHh Lpr lFf">
    <!-- <q-header elevated class="bg-white"> -->
      <q-header class="bg-white">
      <q-toolbar style="height: 90px;">
        <!-- <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        /> -->

        <q-toolbar-title class="text-black text-h4 q-pt-lg q-ml-md">
          {{ titlePage }}
        </q-toolbar-title>

        <transition
          appear
          enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOut"
        >
          <div v-if="link != '/dashboard'" class="q-ma-md text-grey text-weight-medium">{{ auth.company_name }}</div>
        </transition>

        <div class="text-black" style="background-color: #EFEFEF; border-radius: 10px;">
          <q-btn flat="" padding="md" class="q-ma-nome" style=" border-radius: 10px;" @click="onProfil()">
            <q-icon name="img:Logo-Entreprise.svg" size="lg" />
          </q-btn>
        </div>

      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
        show-if-above
        :width="90"
        :breakpoint="50"
        class=""
        style="background-color: #F7F7F7;"
      >

      <q-list padding class="">
        <q-item-label
          header
        >
          <img src="JooL-Box.svg" alt="JooL-Box.svg" width="60" height="60">
        </q-item-label>

          <a @click="$router.push('/dashboard')" style="text-decoration: none; color: black">
            <q-item
            clickable
            v-ripple
            :active="link === '/dashboard'"
            @click="link = '/dashboard'"
            active-class="my-menu-link"
          >
            <q-item-section avatar>
              <q-icon name="dashboard" size="60px"  />
            </q-item-section>
          </q-item>
        </a>

        <a @click="$router.push('/ruche')" style="text-decoration: none; color: black">
          <q-item
            clickable
            v-ripple
            :active="link === '/ruche'"
            @click="link = '/ruche'"
            active-class="my-menu-link"
          >
            <q-item-section avatar>
              <q-icon name="inbox" size="60px"  />
            </q-item-section>
          </q-item>
        </a>

        <a @click="$router.push('/restriction')" style="text-decoration: none; color: black">
            <q-item
            clickable
            v-ripple
            :active="link === '/restriction'"
            @click="link = '/restriction'"
            active-class="my-menu-link"
          >
            <q-item-section avatar>
              <q-icon name="admin_panel_settings" size="60px"  />
            </q-item-section>
          </q-item>
        </a>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-dialog
      v-model="profilModal"
      position="right"
      maximized
      persistent
      transition-show="slide-left"
      transition-hide="slide-right"
    >
      <Profil/>
    </q-dialog>
  </q-layout>
</template>

<script>
import EssentialLink from 'components/EssentialLink.vue'

const linksList = [
  {
    title: 'Docs',
    caption: 'quasar.dev',
    icon: 'school',
    link: 'https://quasar.dev'
  },
  {
    title: 'Github',
    caption: 'github.com/quasarframework',
    icon: 'code',
    link: 'https://github.com/quasarframework'
  },
]
import {useRouter} from "vue-router"
import { defineComponent, getCurrentInstance, onBeforeMount, ref, watch, provide,  } from 'vue'
import Profil from "components/profile/Index.vue"
export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink,
    Profil
  },

  setup () {
    const leftDrawerOpen = ref(false)
    const iconInfoGoogle = ref(false);
    const router = useRouter();
    let link = ref()
    let titlePage = ref()
    provide("titlePage", titlePage)
    let profilModal = ref(false)
    let auth = ref(JSON.parse(localStorage.getItem('auth')))

    onBeforeMount(async () =>{
      link.value = router.currentRoute.value.path
    })

    watch(link, async()=>{
      switch (link.value) {
        case "/dashboard":
          titlePage.value = "Tableau de bord"
          break;

        case "/ruche":
          titlePage.value = "Box"
          break;

        case "/restriction":
          titlePage.value = "Restrictions"
          break;

      }
    })

    let onProfil = () => {
      profilModal.value = true;
    }

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
      link,
      titlePage,
      onProfil,
      profilModal,
      iconInfoGoogle,
      auth
    }
  }
})
</script>

<style scoped>
.my-menu-link {
  color: #058B46;
  background: transparent;
  font-weight: bold
}

.modal{
  margin-top: 20px;
  padding-top: 20px;

}
</style>
