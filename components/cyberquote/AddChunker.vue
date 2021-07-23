<template>
  <div>
    <div class="mb-1">
      <strong class="text-primary">Description</strong>
    </div>
    <b-form-input
      v-model="form.desc"
      type="text"
      placeholder="Description"
      :class="{
        'is-invalid': submitted && $v.form.desc.$error,
      }"
    ></b-form-input>
    <div v-if="submitted && !$v.form.desc.required" class="text-danger">
      Description is required.
    </div>
    <div class="mt-3 mb-1">
      <strong class="text-primary">Abbreviation</strong>
    </div>
    <b-form-input
      v-model="form.abbreviation"
      type="text"
      placeholder="Abbreviation"
      :class="{
        'is-invalid': submitted && $v.form.abbreviation.$error,
      }"
    ></b-form-input>
    <div v-if="submitted && !$v.form.abbreviation.required" class="text-danger">
      Abbreviation is required.
    </div>
    <div class="mt-3 mb-1">
      <strong class="text-primary mt-2">Code</strong>
    </div>
    <b-form-input
      v-model="form.code"
      type="text"
      placeholder="Code"
      :class="{
        'is-invalid': submitted && $v.form.code.$error,
      }"
    ></b-form-input>
    <div v-if="submitted && !$v.form.code.required" class="text-danger">
      Code is required.
    </div>
    <div class="mt-3 mb-1">
      <strong class="text-primary mt-2">Color</strong>
    </div>
    <b-form-input
      v-model="form.color"
      type="color"
      placeholder="Code"
      :class="{
        'is-invalid': submitted && $v.form.color.$error,
      }"
    ></b-form-input>
    <div v-if="submitted && !$v.form.color.required" class="text-danger">
      Code is required.
    </div>
    <div>
      <b-button
        block
        class="btn-rounded drop-shadow mt-3 btn-gradient"
        @click="save"
      >
        Save</b-button
      >
      <div class="d-flex justify-content-center mt-2">
        <div class="text-primary hand-pointer font=16" @click="cancel">
          Cancel
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
export default {
  data() {
    return {
      form: {
        desc: null,
        abbreviation: null,
        code: null,
        color: null,
      },
      idMaster: null,
      submitted: false,
    }
  },
  validations: {
    form: {
      desc: {
        required,
      },
      abbreviation: {
        required,
      },
      code: {
        required,
      },
      color: {
        required,
      },
    },
  },
  methods: {
    cancel() {
      this.$emit('cancelNew', 'cancel')
    },
    async save() {
      this.submitted = true
      this.$v.$touch()
      console.log(this.$v)
      if (this.$v.$invalid) {
        console.log(this.$v)
      } else {
        const payLoad = {
          abbreviation: this.form.abbreviation,
          description: this.form.desc,
          code: this.form.code,
          color: this.form.color,
        }
        try {
          await this.$axios.$post(`/master/chunker`, payLoad, {
            headers: {
              Authorization: this.$auth.strategy.token.get(),
            },
          })
          this.$emit('cancelNew', 'new')
        } catch (error) {}
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.hand-pointer {
  cursor: pointer;
}
</style>
