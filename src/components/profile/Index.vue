<template>
  <q-card style="width: 400px; background-color: #fafafa;">
    <div class="q-mt-xs">
      <q-btn flat icon="close" padding="xs" v-close-popup/> <span>Espace Personnel</span>
    </div>

    <q-card-section class="row items-center no-wrap" style="margin-top: 50px;">
      <div class="text-weight-regular">Connecté {{ dateConnect }}</div>
      <q-space />
      <q-btn
        flat
        label="Se déconnecter"
        no-caps
        padding="xs"
        size="md"
        class=""
        color="secondary"
        style="top: 2px;"
        @click="onDeconneted()"
      />
    </q-card-section>

    <q-card-section class="">
      <div style="text-align: center;">
        <q-avatar round size="190px">
          <img src="employes.svg"/>
        </q-avatar>

        <div style="font-size: 25px;">
          {{auth.first_name}} {{auth.last_name}}
        </div>
        <div style="color: #058B46;">
          {{auth.company_name}}
        </div>
      </div>
    </q-card-section>

    <q-card-section v-if="!editProfil" style="margin-top: 50px;">
      <div class="row q-mb-md">
        <div class="col-2">
          Nom :
        </div>
        <div class="col-10 text-weight-bold" v-if="!editProfil">
          {{auth.last_name}}
        </div>
      </div>

      <div class="row q-mb-md">
        <div class="col-2">
          Prenom :
        </div>
        <div class="col-10 text-weight-bold">
          {{auth.first_name}}
        </div>
      </div>

      <div class="row q-mb-md">
        <div class="col-2">
          Email :
        </div>
        <div class="col-10 text-weight-bold">
          {{auth.email}}
        </div>
      </div>

      <div class="q-mt-lg" style="text-align: center">
        <q-btn
          label="Modifier"
          no-caps
          unelevated
          size="md"
          class="text-weight-regular"
          color="secondary"
          style="width: 150px; top: 8px;"
          @click="onEditProfil()"
        />
      </div>

      <q-btn
        label="Modifier votre mot de passe"
        no-caps
        flat
        unelevated
        size="md"
        padding="xs"
        class=""
        color="secondary"
        style="top: 40px; left: -5px;"
        @click="onChangePassword()"
      />
    </q-card-section>

    <q-card-section v-if="editProfil" style="margin-top: 50px;">
      <q-form
        ref="updateForm"
        @submit="onSubmit"
      >
        <div class="row q-mb-md">
          <div class="col-2">
            Nom :
          </div>
          <div class="col-10" style="position: relative; bottom: 16px;">
            <q-input
              v-model="formData.last_name"
              dense
              label=""
              style="margin-bottom: -20px;"
              :rules="[
                (val) => !!val || 'Nom est obligatoire',
                (val) => val.length > 2 || '3 caractères minimun',
                (val) => val.length < 36 || 'Nom trop long'
              ]"
            />
          </div>
        </div>

        <div class="row q-mb-md" style="position: relative; top: -19px;">
          <div class="col-2">
            Prenom :
          </div>
          <div class="col-10" style="position: relative; bottom: 16px;">
            <q-input
              v-model="formData.first_name"
              dense
              label=""
              style="margin-bottom: -20px;"
              :rules="[
                (val) => !!val || 'Prenom est obligatoire',
                (val) => val.length > 2 || '3 caractères minimun',
                (val) => val.length < 26 || 'Prenom trop long'
              ]"
            />
          </div>
        </div>

        <div class="row q-mb-md" style="position: relative; top: -38px;">
          <div class="col-2">
            Email :
          </div>
          <div class="col-10" style="position: relative; bottom: 16px;">
            <q-input
              v-model="formData.email"
              dense
              label=""
              style="margin-bottom: -20px;"
              :rules="[
                (val) => !!val || 'Email est obligatoire',
                (val) => val.length < 49 || 'email trop long',
                isValidEmail
              ]"
            />
          </div>
        </div>

        <div class="q-mt-lg" style="position: relative; top: -50px;">
          <q-btn
            label="Annuler"
            no-caps
            unelevated
            size="md"
            class="q-mr-sm"
            text-color="black"
            style="border-radius: 5px; width: 47%; border: 1px solid #b5b5b5; background-color: #EFEFEF;"
            @click="editProfil = false"
          />

          <q-btn
            label="Valider"
            no-caps
            unelevated
            size="md"
            class="q-ml-sm"
            color="secondary"
            style="width: 48%;"
            type="submit"
            :loading="submitting"
          >
            <template v-slot:loading>
              <q-spinner-facebook />
            </template>
          </q-btn>
        </div>
      </q-form>

      <q-btn
        label="Modifier votre mot de passe"
        flat=""
        no-caps
        unelevated
        size="md"
        padding="xs"
        class=""
        color="secondary"
        style="top: -17px; left: -5px"
        @click="onChangePassword()"
      />
    </q-card-section>
  </q-card>

  <q-dialog
    v-model="changePasswordModal"
    transition-show="slide-down" transition-hide="slide-up"
  >
    <UpdatePassword :idUser="auth.id"/>
  </q-dialog>

  <q-dialog
    v-model="signOutModal"
    transition-show="slide-down" transition-hide="slide-up"
    persistent
  >
    <ConfirmSignOut/>
  </q-dialog>
</template>

<script>
import { api } from "boot/axios";
import moment from 'moment';
import { useQuasar } from 'quasar'
import { defineComponent, getCurrentInstance, onMounted, ref, watch, provide,  } from 'vue'
import UpdatePassword from "components/profile/UpdatePassword.vue"
import ConfirmSignOut from "./ConfirmSignOut.vue";
export default defineComponent({
  // name: 'ComponentName',

  components: {
    UpdatePassword,
    ConfirmSignOut
  },

  setup () {
    const instance = getCurrentInstance()
    const $q = useQuasar()
    const token = $q.cookies.get('jool_auth_token')
    let auth = ref(JSON.parse(localStorage.getItem('auth')))
    const date_auth = $q.cookies.get('date_auth')
    let editProfil = ref(false)
    let formData = ref({})
    let updateForm = ref(null);
    let dateConnect = ref()
    const submitting = ref(false)
    let changePasswordModal = ref(false)
    provide("changePasswordModal", changePasswordModal)
    let signOutModal = ref(false)

    let isValidEmail = (val) => {
      const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
      return emailPattern.test(val) || `Saisissez un email valide`;
    };

    onMounted(async () =>{
      moment.locale('fr')
      dateConnect.value = moment(JSON.parse(date_auth)).fromNow()

      formData.value = {...auth.value}
    })

    let onEditProfil = () => {
      editProfil.value = true
      formData.value = {...auth.value}
    }

    let onSubmit = async () => {
      submitting.value = true
      if (updateForm.value.validate()) {
        try {
          await api({
          method: 'put',
          url: '/users/:id',
          data: formData.value,
          headers: {
            'Authorization': `Basic ${token}`
          }
        }).then(async(res) => {
          /* Recuperation des infos de users  */
          await api({
            method: "GET",
            url: "/users/:id",
            params: {
              id: auth.value.id,
            },
            headers: {
              'Authorization': `Basic ${token}`
            }
          }).then(async (res) => {
            auth.value.first_name = res.data.first_name.split(" ").join("")
            auth.value.last_name = res.data.last_name.split(" ").join("")
            auth.value.email = res.data.email

            localStorage.setItem('auth', JSON.stringify(auth.value))

            submitting.value = false
            editProfil.value = false
          })
        })
      } catch (error) {
        console.log("error", error);
        submitting.value = false
      }
      }
    }

    let onChangePassword = async (res) => {
      changePasswordModal.value = true
    }

    let onDeconneted = async () => {
      signOutModal.value = true
    }
    return {
      onDeconneted,
      auth,
      dateConnect,
      onEditProfil,
      editProfil,
      formData,
      onSubmit,
      isValidEmail,
      updateForm,
      submitting,
      changePasswordModal,
      onChangePassword,
      signOutModal
    }
  }
})
</script>
