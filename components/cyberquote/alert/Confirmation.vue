<template>
  <div class="text-center">
    <i class="bx bxs-no-entry h1 text-primary"></i>
    <h4 class="mt-2 text-primary body-strong">Confirmation !</h4>
    <p class="mt-3 text-primary body-reguler">{{ message }}</p>
    <b-button
      type="button"
      class="btn-gradient btn-rounded drop-shadow"
      @click="confirmation"
    >
      Yes
    </b-button>
    <b-button
      variant="outline-primary"
      pill
      class="ml-2 drop-shadow"
      @click="cancelModal"
    >
      Cancel
    </b-button>
  </div>
</template>

<script>
export default {
  props: {
    selectedRecord: {
      type: Object,
      default: null,
    },
    message: {
      type: String,
      default: null,
    },
  },

  methods: {
    cancelModal() {
      this.$emit('cancelModal')
    },
    confirmation() {
      this.$emit('confirmation', this.selectedRecord)
    },
  },
}
</script>

<style lang="scss" scoped></style>
