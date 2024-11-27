<template>
  <q-page >
    <div class="row justify-center" style="background-color: #EFEFEF;">

      <div class="absolute-top-left" style="position: absolute; top: 50px; left: 100px;">
        <q-avatar square size="200px" >
          <img src="Login/JooL-Box.svg">
        </q-avatar>
      </div>

      <div class="col-xs-12 col-sm-7 col-md-7 col-lg-7 flex flex-center">

        <div style="width: 400px">
          <div class="q-mb-md">
            <span style="font-size:25px ;">
             Nouveau mot de passe
            </span>
          </div>

          <q-form
            ref="loginForm"
            @submit.prevent="submit"
            class=""
          >

            <q-input
              filled
              dense
              class="q-mb-sm"
              :type="isPwd ? 'password' : 'text'"
              placeholder="Nouveau mot de passe"
              v-model="formData.password"
              :rules="[
                (val) => !!val || 'Mot de passe est obligatoire',
                (val) => val.length > 5 || '6 caractères minimun',
                (val) => val.length < 49 || 'Mot de passe trop long',
              ]"
              bg-color="white"
            >
              <template v-slot:prepend>
                <q-avatar square size="20px">
                  <img :src="formData.password ? 'Login/password_color.svg' : 'Login/password_dark.svg' "/>
                </q-avatar>
              </template>
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>

            <q-input
              filled
              dense
              class="q-mb-sm"
              :type="isPwdComfirm ? 'password' : 'text'"
              placeholder="Confirmer mot de passe"
              v-model="formData.passwordConfirm"
              :rules="[
                (val) => !!val || 'Confirmer mot de passe est obligatoire',
                (val) => val.length > 5 || '6 caractères minimun',
                (val) => val.length < 49 || 'Mot de passe trop long',
                isPasswordConfirm
              ]"
              bg-color="white"
            >
              <template v-slot:prepend>
                <q-avatar square size="20px">
                  <img :src="formData.passwordConfirm ? 'Login/password_color.svg' : 'Login/password_dark.svg' "/>
                </q-avatar>
              </template>
              <template v-slot:append>
                <q-icon
                  :name="isPwdComfirm ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwdComfirm = !isPwdComfirm"
                />
              </template>
            </q-input>

            <div class="" style="text-align: right;">
              <q-btn
                type="submit"
                class="q-mt-none"
                label="Valider"
                color="primary"
                padding="sm"
                style="width: 200px;"
                :loading="submitting"
                unelevated
              >
                <template v-slot:loading>
                  <q-spinner-facebook />
                </template>
              </q-btn>
            </div>

          </q-form>
        </div>
      </div>

      <div class="col-xs-12 col-sm-5 col-md-5 col-lg-5"
        style="
          background-image: url(Login/DronePilot.svg);
          height: 100vh;
          background-position: right;
          background-repeat: no-repeat;
          background-size: contain, cover;
        ">
      </div>
    </div>
  </q-page>
</template>

<script>
import { api } from "boot/axios";
import { useQuasar } from 'quasar'
import { useRouter } from "vue-router"
import { defineComponent, ref, getCurrentInstance, onMounted, } from 'vue'
export default defineComponent({
  name: 'Reset-Password',

  setup(){
    const instance = getCurrentInstance();
    const $q = useQuasar()
    const router = useRouter()
    let formData = ref({});
    let loginForm = ref(null);
    let isPwd = ref(true);
    let isPwdComfirm = ref(true);
    const submitting = ref(false)

    let isPasswordConfirm = (val)=>{
      return val === formData.value.password || `Mot de passe non conforme`
    }

    let submit = async () => {

      if (loginForm.value.validate()) {
        submitting.value = true
        try {
          formData.value.user = router.currentRoute.value.href
          await api({
            method: "POST",
            url: "/auth/reset-password",
            data: formData.value
          }).then((res) =>{
            console.log(res.data);
            router.push("/")
          })

          submitting.value = false
        } catch (err) {
          console.log(err);
          $q.notify({
            type: 'negative',
            position: 'bottom',
            message: 'Erreur du serveur'
          })
          submitting.value = false
        }
      }

    };

    return {
      formData,
      submit,
      loginForm,
      isPwd,
      isPwdComfirm,
      isPasswordConfirm,
      submitting,
    }
  }
})
</script>
