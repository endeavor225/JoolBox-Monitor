<template>
  <q-page >
    <div class="row justify-center" style="background-color: #EFEFEF;">

      <div class="absolute-top-left" style="position: absolute; top: 5%; left: 5%;">
        <q-avatar square size="200px" >
          <img src="Login/JooL-Box.svg">
        </q-avatar>
      </div>

      <div class="col-xs-12 col-sm-7 col-md-7 col-lg-7 flex flex-center">

        <div style="width: 780px; position: relative; left: 50px;">
          <div class="q-mb-md">
            <span style="font-size:25px;">
              Inscription
            </span>
          </div>


          <q-form
            ref="createForm"
            @submit.prevent="submit"
            class=""
          >
            <div class="row q-gutter-x-lg">
              <div class="col">
                <q-input
                  filled
                  dense
                  class="q-mb-sm"
                  type="test"
                  placeholder="Nom"
                  v-model="formData.last_name"
                  :rules="[
                    (val) => !!val || 'Nom est obligatoire',
                    (val) => val.length > 2 || '3 caractères minimun',
                    (val) => val.length < 49 || 'Nom trop long'
                  ]"
                  bg-color="white"
                >
                  <template v-slot:prepend>
                    <q-avatar square size="20px">
                      <img :src="formData.last_name ? 'Login/profile_color.svg' : 'Login/profile_dark.svg' "/>
                    </q-avatar>
                  </template>
                </q-input>
              </div>
              <div class="col">
                <q-select
                  filled
                  dense
                  class="q-mb-sm"
                  placeholder="Compagnie"
                  :options="company"
                  option-label="name"
                  option-value="id"
                  bg-color="white"
                  label="Compagnie"
                  v-model="formData.company"
                  :rules="[ (val) => !!val || 'Compagnie est obligatoire']"
                >
                  <template v-slot:prepend>
                    <q-avatar square size="20px">
                      <img :src="formData.company ? 'Login/entreprise_color.svg' : 'Login/entreprise_dark.svg' "/>
                    </q-avatar>
                  </template>
                </q-select>
              </div>
            </div>
            <div class="row q-gutter-x-lg">
              <div class="col">
                <q-input
                  filled
                  dense
                  class="q-mb-sm"
                  type="test"
                  placeholder="Prenom"
                  v-model="formData.first_name"
                  :rules="[
                    (val) => !!val || 'Prenom est obligatoire',
                    (val) => val.length > 2 || '3 caractères minimun',
                    (val) => val.length < 49 || 'Prenom trop long']"
                  bg-color="white"
                >
                  <template v-slot:prepend>
                    <q-avatar square size="20px">
                      <img :src="formData.first_name ? 'Login/profile_color.svg' : 'Login/profile_dark.svg' "/>
                    </q-avatar>
                  </template>
                </q-input>
              </div>
              <div class="col">
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
                    (val) => val.length < 49 || 'Mot de passe trop long'
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
              </div>
            </div>
            <div class="row q-gutter-x-lg">
              <div class="col">
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
                    isValidEmail, isEmailExist
                  ]"
                  bg-color="white"
                >
                  <template v-slot:prepend>
                    <q-avatar square size="20px">
                      <img :src="formData.email ? 'Login/email_color.svg' : 'Login/email_dark.svg' "/>
                    </q-avatar>
                  </template>
                </q-input>
              </div>
              <div class="col">
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
              </div>
            </div>
            <div class="" style="text-align: right;">
              <q-btn
                type="submit"
                class="q-mt-xs"
                label="Inscription"
                color="primary"
                padding="sm"
                style="width: 200px;"
                :loading="submitting"
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
import { defineComponent, ref, getCurrentInstance, onBeforeMount, onMounted, watch} from 'vue'
export default defineComponent({
  name: 'InscriptionPage',

  setup(){
    const instance = getCurrentInstance();
    const $q = useQuasar()
    const router = useRouter()

    let formData = ref({});
    let createForm = ref(null);
    let isPwd = ref(true);
    let isPwdComfirm = ref(true);

    const company = ref([])
    const users = ref([])
    const submitting = ref(false)

    const token = $q.cookies.get('jool_auth_token')
    if(token) router.push('/dashboard')

    let isValidEmail = (val) => {
      const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
      return emailPattern.test(val) || `Saisissez un email valide`;
    };

    let isPasswordConfirm = (val)=>{
      return val === formData.value.password || `Mot de passe non conforme`
    }

    let isEmailExist = (val)=>{
      for (const iterator of users.value) {
        if (iterator.email === val) {
          return  'Email existant déjà'
        }
      }
    }

    onBeforeMount(async () => {
      await api({
        method: "GET",
        url: "/compagnies",
      }).then( async (response) => {
        company.value = response.data
      });

      await api({
        method: "GET",
        url: "/users/email",
      }).then( async (response) => {
        users.value = response.data
      });
    })

    onMounted(async () => {})

    let submit = async () => {
      submitting.value = true
      if (createForm.value.validate()) {
        try {
          formData.value.company = formData.value.company.id

          let result = await api({
            method: "POST",
            url: "/users",
            data: formData.value
          });

          if (!result.data) {
            $q.notify({
              type: 'negative',
              position: 'top',
              message: 'Erreur de création'
            })
            submitting.value = false
          } else {
            $q.notify({
              type: 'positive',
              position: 'top',
              message: 'Opération effectuée avec succès'
            })
            submitting.value = false
            router.push("/")
          }

        } catch (err) {
          console.log(err);
          $q.notify({
            type: 'negative',
            position: 'bottom',
            message: 'Erreur de création'
          })
          submitting.value = false
        }
      }

    };

    return {
      formData,
      submit,
      createForm,
      isPwd,
      isPwdComfirm,
      isValidEmail,
      isPasswordConfirm,
      isEmailExist,
      company,
      submitting


    }
  }
})
</script>
