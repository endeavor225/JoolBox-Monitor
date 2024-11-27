<template>
  <q-card style="width: 780px; max-width: 80vw; border-radius: 8px;">
    <q-card-section class="row items-center q-pb-none">
      <div class="text-h6 q-mt-md q-ml-md">Modification de mot de passe</div>
    </q-card-section>

    <q-card-section class="q-ma-md" style="">
      <div class="row items-center">
        <div class="col-2">
          <q-img
            src="Pilote-Drone.svg"
            spinner-color="white"
            style="height: 130px; max-width: 150px"
          />
        </div>
        <div class="col-10">
          <q-form
            ref="changePwdForm"
            @submit="onSubmit"
          >
            <q-card-section class="text-subtitle1">
              <div class="row q-col-gutter-x-md">
                <div class="col-6">
                  <q-input
                    filled
                    dense
                    :type="isPwd ? 'password' : 'text'"
                    label="Ancien mot de passe"
                    v-model="formData.passwordCurrent"
                    :rules="[
                      (val) => !!val || 'Champ obligatoire',
                      (val) => val.length > 5 || '6 caractères minimun',
                      (val) => val.length < 49 || 'Mot de passe trop long',
                    ]"
                  >
                    <template v-slot:prepend>
                      <q-avatar square size="15px">
                        <img :src="formData.passwordCurrent ? 'Login/password_color.svg' : 'Login/password_dark.svg' "/>
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

              <div class="row q-col-gutter-x-md">
                <div class="col">
                  <q-input
                    filled
                    dense
                    :type="isNewPwd ? 'password' : 'text'"
                    label="Nouveau mot de passe"
                    v-model="formData.newPassword"
                    :rules="[
                      (val) => !!val || 'Champ obligatoire',
                      (val) => val.length > 5 || '6 caractères minimun',
                      (val) => val.length < 49 || 'Mot de passe trop long',
                    ]"
                  >
                    <template v-slot:prepend>
                      <q-avatar square size="15px">
                        <img :src="formData.newPassword ? 'Login/password_color.svg' : 'Login/password_dark.svg' "/>
                      </q-avatar>
                    </template>
                    <template v-slot:append>
                      <q-icon
                        :name="isNewPwd ? 'visibility_off' : 'visibility'"
                        class="cursor-pointer"
                        @click="isNewPwd = !isNewPwd"
                      />
                    </template>
                  </q-input>
                </div>
                <div class="col">
                  <q-input
                    filled
                    dense
                    :type="isPwdComfirm ? 'password' : 'text'"
                    label="Valider mot de passe"
                    v-model="formData.newPasswordConfirm"
                    :rules="[
                      (val) => !!val || 'Champ obligatoire',
                      (val) => val.length > 5 || '6 caractères minimun',
                      (val) => val.length < 49 || 'Mot de passe trop long',
                      isPasswordConfirm
                    ]"
                  >
                    <template v-slot:prepend>
                      <q-avatar square size="15px">
                        <img :src="formData.newPasswordConfirm ? 'Login/password_color.svg' : 'Login/password_dark.svg' "/>
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

              <div class="row q-col-gutter-x-md">
                <div class="col">
                  <q-btn
                    no-caps
                    text-color="black"
                    style="border-radius: 5px; border: 1px solid #b5b5b5; background-color: #EFEFEF;"
                    padding="sm"
                    unelevated
                    type="reset"
                    class="full-width"
                    v-close-popup
                  >
                    <span class="text-weight-light">Annuler</span>
                  </q-btn>
                </div>
                <div class="col">
                  <q-btn
                    color="secondary"
                    class="full-width"
                    no-caps
                    style="border-radius: 5px; width: 190px; border: 1px solid #26A69A;"
                    padding="sm"
                    unelevated
                    type="submit"
                    :loading="submitting"
                  >
                    <span class="text-weight-light">Valider</span>
                    <template v-slot:loading>
                      <q-spinner-facebook />
                    </template>
                  </q-btn>
                </div>
              </div>
            </q-card-section>
          </q-form>
        </div>
      </div>
    </q-card-section>

    <q-btn unelevated padding="none" color="negative" class="absolute-top-right" v-close-popup>
      <q-icon name="img:Close.svg" size="md" />
    </q-btn>

  </q-card>
</template>

<script>
import { api } from "boot/axios";
import { useRouter } from "vue-router";
import { useQuasar } from 'quasar'
import { defineComponent, getCurrentInstance, onMounted, ref, watch, inject,  } from 'vue'
export default defineComponent({
  // name: 'ComponentName',

  props: {
    idUser: {
      default() {
        return {};
      },
    },
  },

  setup (props) {
    const instance = getCurrentInstance()
    const router = useRouter()
    const $q = useQuasar()
    const token = $q.cookies.get('jool_auth_token')
    let auth = ref(JSON.parse(localStorage.getItem('auth')))
    let changePwdForm = ref(null);
    let formData = ref({})
    let isPwd = ref(true);
    let isNewPwd = ref(true);
    let isPwdComfirm = ref(true);
    const submitting = ref(false)
    let changePasswordModal = inject("changePasswordModal")

    let isPasswordConfirm = (val)=>{
      return val === formData.value.newPassword || `Mot de passe non conforme`
    }

    onMounted(async () =>{ })

    let onSubmit = async () => {
      submitting.value = true
      formData.value.id = auth.value.id
      if (changePwdForm.value.validate()) {
        try {
          await api({
          method: 'put',
          url: '/users/change-password/:id',
          data: formData.value,
          headers: {
            'Authorization': `Basic ${token}`
          }
        }).then(async(res) => {
            if (!res.data.status) {
              $q.notify({
                type: 'negative',
                position: 'bottom',
                message: 'Ancien mot de passe incorrect'
              })
              submitting.value = false
            }

            if (res.data.status) {
              $q.notify({
                type: 'positive',
                position: 'bottom',
                message: 'Mot de passe modifié avec succès'
              })
              submitting.value = false
              changePasswordModal.value = false
            }
          })
        } catch (error) {
          submitting.value = false
          console.log("error", error);
        }
      }
    }


    return {
      onSubmit,
      changePwdForm,
      formData,
      isPwd,
      isNewPwd,
      isPwdComfirm,
      isPasswordConfirm,
      submitting,
    }
  }
})
</script>
