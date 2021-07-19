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
        variant="success"
        block
        class="btn-rounded drop-shadow mt-3"
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
  async mounted() {
    try {
      const resAddPost = await this.$axios.$get(
        `/corpus_detail?filterByFormula=FIND("CHUNKER", {detail_master_desc})`,
        {
          headers: {
            Authorization: this.$config.API_KEY,
          },
        }
      )
      this.idMaster = resAddPost.records[0].id
    } catch (error) {
      console.log(error)
    }
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
          records: [
            {
              fields: {
                sub_detail_master_abbreviation: this.form.abbreviation,
                sub_detail_master_desc: this.form.desc,
                sub_detail_master_code: this.form.code,
                sub_detail_master_color: this.form.color,
                corpus_detail: [`${this.idMaster}`],
              },
            },
          ],
        }
        try {
          const resAddPost = await this.$axios.$post(`/sub_detail`, payLoad, {
            headers: {
              Authorization: this.$config.API_KEY,
            },
          })
          this.$emit('cancelNew', 'new')
          console.log(resAddPost)
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
