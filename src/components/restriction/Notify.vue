<template>
  <q-card class="notify" style="" >

    <q-card-section class="q-ma-sm" style="text-align: center; padding-top: 30px; padding-left: 50px; padding-right: 50px;">
      Nouvelle restriction ajoutée avec succès.
    </q-card-section>

    <q-card-actions align="center" class="text-teal q-pt-none q-pb-md">
      <q-btn label="OK" v-close-popup color="secondary" style="border-radius: 15px; width: 100px"/>
    </q-card-actions>
  </q-card>
</template>

<script>
import { defineComponent, getCurrentInstance, ref, onMounted, inject } from "vue";
export default defineComponent({
  // name: 'ComponentName',
  setup () {
    let notify = inject("notify")

      /* setTimeout(() =>{
        notify.value = false
      }, 5000) */
    return {}
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
