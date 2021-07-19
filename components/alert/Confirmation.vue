<template>
  <div class="text-center">
    <i class="bx bxs-no-entry h1 text-danger"></i>
    <h4 class="mt-2 text-danger">Confirmation !</h4>
    <p class="mt-3 text-danger">Are you sure, you want to delete this data ?</p>
    <b-button
      type="button"
      class="btn btn-danger my-2 btn-rounded"
      @click="confirmation"
    >
      Yes
    </b-button>
    <b-button
      type="button"
      class="btn btn-success my-2 btn-rounded"
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
