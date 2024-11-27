<template>
  <q-page >
    <div class="row justify-center" style="background-color: #EFEFEF;">

      <div class="absolute-top-left" style="position: absolute; top: 50px; left: 100px;">
        <q-avatar square size="200px" >
          <img src="Login/JooL-Box.svg">
        </q-avatar>
      </div>

      <div class="col-xs-12 col-sm-7 col-md-7 col-lg-7 flex flex-center">

        <div style="width: 400px" v-if="!mailSend">
          <div class="q-mb-md">
            <span style="font-size:25px ;">
              Mot de passe oublié
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
              class="q-mb-none"
              type="test"
              placeholder="Email"
              v-model="formData.email"
              :rules="[
                (val) => !!val || 'Email est obligatoire',
                (val) => val.length < 49 || 'email trop long',
                isValidEmail
              ]"
              bg-color="white"
            >
              <template v-slot:prepend>
                <q-avatar square size="20px">
                  <img :src="formData.email ? 'Login/email_color.svg' : 'Login/email_dark.svg' "/>
                </q-avatar>
              </template>
            </q-input>

            <div class="" style="text-align: right;">
              <q-btn
                type="submit"
                class="q-mt-none"
                label="Réinitialiser"
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

            <div class="q-pt-lg">
              <q-btn
                type="submit"
                class="q-mt-xs full-width"
                color="white"
                text-color="black"
                padding="sm"
                style="width: 200px; border: 1px solid #707070;"
                unelevated
                no-caps=""
                @click="$router.push('/')"
              >
              <span class="text-weight-regular">Se connecter</span>
              </q-btn>
            </div>
          </q-form>
        </div>

        <div style="width: 600px" v-else>
          <div class="q-mb-md text-body1 " style="font-size:23px; text-align: center;">
            Nous vous avons envoyé un lien par mail à l’adresse <b>«{{ formData.email }}»</b>. Cliquez dessus pour réinitialiser votre mot de passe.
          </div>

          <div class="" style="text-align: center;">
              <q-btn
                class="q-mt-none"
                label="ok"
                color="primary"
                padding="sm"
                style="width: 80px; border-radius: 20px;"
                unelevated
                @click="mailSend = false"
              >
                <template v-slot:loading>
                  <q-spinner-facebook />
                </template>
              </q-btn>
            </div>
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
  name: 'Forget-Password',

  setup(){
    const instance = getCurrentInstance();
    const $q = useQuasar()
    const router = useRouter()
    let formData = ref({});
    let loginForm = ref(null);
    let isPwd = ref(true);
    const submitting = ref(false)
    const mailSend = ref(false)

    const token = $q.cookies.get('jool_auth_token')
    if(token) router.push('/dashboard')

    let isValidEmail = (val) => {
      const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
      return emailPattern.test(val) || `Saisissez un email valide`;
    };

    let submit = async () => {
      if (loginForm.value.validate()) {
        submitting.value = true
        try {
          await api({
            method: "POST",
            url: "/auth/forget-password",
            data: formData.value
          }).then((res) => {
            if (res.data.statut) {
              submitting.value = false
              mailSend.value = true
            } else {
              submitting.value = false
              $q.notify({
                type: 'negative',
                position: 'bottom',
                message: 'Cet email ne correspond a aucun utilisateur'
              })
            }
          })
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
      isValidEmail,
      submitting,
      mailSend
    }
  }
})
</script>
