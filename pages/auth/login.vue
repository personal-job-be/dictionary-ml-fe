<template>
  <b-row class="d-flex justify-content-center align-items-center left-side">
    <b-col md="7">
      <div class="card-body">
        <div class="text-center w-80 m-auto">
          <div class="auth-logo">
            <span class="logo-lg font-primary">
              <h1 class="text-primary">Login</h1>
            </span>
          </div>
          <p class="text-black-board mb-4 mt-3 font-14">
            With more than 20 years of experience in serving the investing
            public <br />
            and the financial services industry
          </p>
        </div>

        <form action="#" @submit.prevent="tryToLogIn">
          <b-alert
            :show="dismissCountDown"
            dismissible
            fade
            variant="danger"
            @dismiss-count-down="countDownChanged"
          >
            {{ errorMessage }}
          </b-alert>

          <div class="form-group mb-4">
            <label class="text-dark" for="userName">User Name</label>
            <input
              id="userName"
              v-model="userName"
              class="form-control"
              type="text"
              placeholder="Enter your user name"
              :class="{ 'is-invalid': submitted && $v.userName.$error }"
            />
            <div
              v-if="submitted && $v.userName.$error"
              class="invalid-feedback"
            >
              <span v-if="!$v.userName.required">User name is required.</span>
            </div>
          </div>

          <div class="form-group mb-2">
            <label class="text-dark" for="password">Password</label>
            <div class="input-group input-group-merge">
              <input
                id="password"
                v-model="password"
                :type="typePassword"
                class="form-control"
                placeholder="Enter your password"
                :class="{ 'is-invalid': submitted && $v.password.$error }"
              />

              <div class="input-group-append" data-password="false">
                <div class="input-group-text">
                  <i
                    :class="`${iconPassword} eye`"
                    aria-hidden="true"
                    @click="toggleEye"
                  ></i>
                </div>
              </div>
              <div
                v-if="submitted && !$v.password.required"
                class="invalid-feedback"
              >
                Password is required.
              </div>
            </div>
          </div>

          <div class="pr-5 pl-5 pt-3">
            <div class="form-group text-center">
              <button
                class="
                  btn btn-gradient btn-block
                  font-16
                  btn-semi-rounded
                  text-white
                "
                type="submit"
              >
                Continue
              </button>
            </div>

            <div class="row mt-2">
              <div class="col-10 text-center"></div>
            </div>
          </div>
        </form>
      </div>
    </b-col>
  </b-row>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
export default {
  layout: 'auth-login',
  data() {
    return {
      iconPassword: 'fa fa-eye-slash',
      typePassword: 'password',
      password: null,
      userName: null,
      errorMessage: null,
      dismissSecs: 5,
      dismissCountDown: 0,
      submitted: false,
    }
  },
  validations: {
    userName: {
      required,
    },
    password: {
      required,
    },
  },
  methods: {
    toggleEye() {
      this.isEye = !this.isEye
      if (this.isEye) {
        this.iconPassword = 'fa fa-eye-slash'
        this.typePassword = 'password'
      } else {
        this.iconPassword = 'fa fa-eye'
        this.typePassword = 'text'
      }
    },
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    },
    async tryToLogIn() {
      this.submitted = true
      // // stop here if form is invalid
      this.$v.$touch()
      if (this.$v.$invalid) {
        console.log('invalid')
      } else {
        // valid input
        try {
          await this.$auth.loginWith('local', {
            data: {
              username: this.userName,
              password: this.password,
            },
          })
        } catch (error) {
          this.dismissCountDown = this.dismissSecs
          this.errorMessage = "Your account doesn't exist"
        }

        // this.$router.push('/dashboard')
      }
    },
  },
}
</script>

<style lang="scss" scoped>
// html {
//   font-family: 'Oxygen';
// }
.eye {
  cursor: pointer;
}
</style>
