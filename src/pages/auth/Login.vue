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
              Connectez-vous
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

            <q-input
              filled
              dense
              class="q-mb-sm"
              :type="isPwd ? 'password' : 'text'"
              placeholder="Mot de passe"
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

            <div class="row">
              <div class="col-md-6" style="margin-top: 20px;">
                <a href="/forget-password"
                  style="text-decoration: none"
                  class="text-black"
                >
                  Mot de passe oublié ?
                </a>
              </div>

              <div class="col-md-6">
                <q-btn
                  type="submit"
                  class="q-mt-xs full-width"
                  label="Connexion"
                  color="primary"
                  padding="sm"
                  :loading="submitting"
                >
                  <template v-slot:loading>
                    <q-spinner-facebook />
                  </template>
                </q-btn>
              </div>
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
import { defineComponent, ref, getCurrentInstance, onMounted, onBeforeMount } from 'vue'
export default defineComponent({
  name: 'LoginPage',

  setup(){
    const instance = getCurrentInstance()
    const $q = useQuasar()
    const router = useRouter()
    let formData = ref({});
    let loginForm = ref(null);
    let isPwd = ref(true);
    const submitting = ref(false)

    const token = $q.cookies.get('jool_auth_token')
    if(token) router.push('/dashboard')

    onBeforeMount(async() => {})

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
            url: "/auth/login",
            data: formData.value
          }).then(async (res) => {

            if (!res.data.login) {
              $q.notify({
                type: 'negative',
                position: 'bottom',
                message: 'Paire login/mot de passe incorrecte'
              })
              submitting.value = false
            }

            if (res.data.login) {
              //localStorage.setItem('token', JSON.stringify(res.data.accessToken))
              $q.cookies.set('jool_auth_token', res.data.accessToken, {expires: 30})
              $q.cookies.set('date_auth', new Date())
              await api({
                method: "GET",
                url: "/auth/me",
                headers: {
                  'Authorization': `Basic ${res.data.accessToken}`
                }
              }).then( async (res) => {
                res.data.first_name = res.data.first_name.split(" ").join("")
                res.data.last_name = res.data.last_name.split(" ").join("")
                localStorage.setItem('auth', JSON.stringify(res.data))
              })
              submitting.value = false
              router.push("dashboard")
            }
          });
        } catch (err) {
          console.log(err);
          submitting.value = false
          $q.notify({
            type: 'negative',
            position: 'bottom',
            message: 'Erreur de connexion'
          })
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
    }
  }
})
</script>
