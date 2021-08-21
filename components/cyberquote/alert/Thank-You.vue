<template>
  <div>
    <b-row>
      <b-col>
        <img src="/done.png" alt="" srcset="" width="100%" />
      </b-col>
    </b-row>
    <b-row class="d-flex justify-content-center mt-2">
      <b-col>
        <h4>Your litigation has been finalized</h4>
      </b-col>
    </b-row>
    <b-row class="d-flex justify-content-center mt-2">
      <b-col>
        <b-button class="btn-gradient btn-rounded" block @click="next">
          Continue
        </b-button>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  mounted() {},
  methods: {
    next() {
      this.$emit('closeModal')
    },
  },
}
</script>

<style lang="scss" scoped></style>
