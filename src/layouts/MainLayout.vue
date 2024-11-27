<template>
  <q-layout view="lHh Lpr lFf">
    <!-- <q-header elevated class="bg-white"> -->
    <q-header class="bg-white">
      <q-toolbar style="height: 90px;">
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
      style="background-color: #F7F7F7;"
    >

      <q-list>
        <q-item-label header style="margin-top: 20px; margin-bottom: 20px;">
          <img src="JooL-Box.svg" alt="JooL-Box.svg" width="70" height="50" style="position: relative; left: -5px;">
        </q-item-label>

        <div class="absolute" >
          <div class="q-ma-md q-pa-none div-content">
            <a @click="$router.push('/dashboard')" style="text-decoration: none; color: black;">
              <q-item
                dense
                clickable
                :active="link === '/dashboard'"
                @click="link = '/dashboard'"
                active-class="my-menu-link"
                class="effet-menu-link q-pa-none"
                @mouseover="libelle.dashboard = true"
                @mouseleave="libelle.dashboard = false"
                style="padding: 15px;"
              >
                <q-item-section avatar>
                  <q-icon v-if="link === '/dashboard'" name="img:menu/dashboard-active.svg" size="30px"/>
                  <q-icon v-else :name="libelle.dashboard ? 'img:menu/dashboard-active.svg': 'img:menu/dashboard.svg'" size="30px"/>
                </q-item-section>
                <q-item-section style="margin-left: -10px;">
                  <transition
                    appear
                    enter-active-class="animated fadeInLeft"
                    leave-active-class="animated fadeOutLeft"
                  >
                    <q-item-label v-show="libelle.dashboard" class="text-h6 q-pr-md">
                      Dashboard
                    </q-item-label>
                  </transition>
                </q-item-section>
              </q-item>
            </a>
          </div>

          <div class="q-ma-md q-pa-none div-content">
            <a @click="$router.push('/ruche')" style="text-decoration: none; color: black;">
              <q-item
                dense
                clickable
                :active="link === '/ruche'"
                @click="link = '/ruche'"
                active-class="my-menu-link"
                class="effet-menu-link q-pa-none"
                @mouseover="libelle.ruche = true"
                @mouseleave="libelle.ruche = false"
                style="padding: 15px;"
              >
                <q-item-section avatar>
                  <q-icon v-if="link === '/ruche'" name="img:menu/drone-active.svg" size="30px"/>
                  <q-icon v-else :name="libelle.ruche ? 'img:menu/drone-active.svg': 'img:menu/drone.svg'" size="30px"/>
                </q-item-section>
                <q-item-section style="margin-left: -10px;">
                  <transition
                    appear
                    enter-active-class="animated fadeInLeft"
                    leave-active-class="animated fadeOutLeft"
                  >
                    <q-item-label v-show="libelle.ruche" class="text-h6 q-pr-md">
                      Box
                    </q-item-label>
                  </transition>
                </q-item-section>
              </q-item>
            </a>
          </div>

          <div class="q-ma-md q-pa-none div-content">
            <a @click="$router.push('/restriction')" style="text-decoration: none; color: black;">
              <q-item
                dense
                clickable
                :active="link === '/restriction'"
                @click="link = '/restriction'"
                active-class="my-menu-link"
                class="effet-menu-link q-pa-none"
                @mouseover="libelle.restriction = true"
                @mouseleave="libelle.restriction = false"
                style="padding: 15px;"
              >
                <q-item-section avatar>
                  <q-icon v-if="link === '/restriction'" name="img:menu/echec-active.svg" size="30px"/>
                  <q-icon v-else :name="libelle.restriction ? 'img:menu/echec-active.svg': 'img:menu/echec.svg'" size="30px"/>
                </q-item-section>
                <q-item-section style="margin-left: -10px;">
                  <transition
                    appear
                    enter-active-class="animated fadeInLeft"
                    leave-active-class="animated fadeOutLeft"
                  >
                    <q-item-label v-show="libelle.restriction" class="text-h6 q-pr-md">
                      Restrictions
                    </q-item-label>
                  </transition>
                </q-item-section>
              </q-item>
            </a>
          </div>

          <!-- <div class="q-ma-md div-content" >
            d
          </div> -->
        </div>
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
    provide("link", link)
    let titlePage = ref()
    provide("titlePage", titlePage)
    let profilModal = ref(false)
    let auth = ref(JSON.parse(localStorage.getItem('auth')))
    let libelle = ref({
      dashboard: false,
      ruche: false,
      restriction: false,
    })

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
      auth,
      libelle,
    }
  }
})
</script>

<style scoped>
.my-menu-link {
  background: #55AAA0;
}

.effet-menu-link{
  min-width: 60px;
  border-radius: 7px;
  font-weight: bold;
}
.effet-menu-link:hover {
  color: #ffffff;
}

.div-content{
  width: 0px;
  height: 60px;
  transition: width 0.3s;
  border-radius: 7px;
  z-index: 1
}

.div-content:hover{
  width: 190px;
  background: #55AAA0;
}

.animated.fadeInLeft {
  animation-duration: 0.5s;
}

.animated.fadeOutLeft {
  animation-duration: 0.1s;
}
</style>
