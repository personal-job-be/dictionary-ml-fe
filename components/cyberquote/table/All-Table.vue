<template>
  <div>
    <div class="d-flex justify-content-between">
      <div class="d-flex">
        <div class="font-weight-bold font-20 font-primary mr-2">Resume</div>
        <b-button
          class="btn-success btn-rounded drop-shadow"
          @click="backDashboard"
        >
          Back to Dashboard
        </b-button>
      </div>
      <b-button
        class="btn-gradient btn-rounded drop-shadow"
        @click="backProcess"
        >Back</b-button
      >
    </div>
    <b-row>
      <b-col md="11" class="mt-3">
        <pos-tag-table :data-table="corpusData" />
        <chunk-table :data-table="corpusData" />
        <relation-table :data-table="corpusData" :is-resume="true" />
      </b-col>
    </b-row>
  </div>
</template>

<script>
import PosTagTable from '@/components/cyberquote/table/Pos-Tag-Table.vue'
import ChunkTable from '@/components/cyberquote/table/Chunk-Table.vue'
import RelationTable from '@/components/cyberquote/table/Relation-Table.vue'
export default {
  components: {
    PosTagTable,
    ChunkTable,
    RelationTable,
  },
  props: {
    corpusData: {
      type: Array,
      default: null,
    },
  },
  mounted() {
    console.log(this.corpusData)
  },
  methods: {
    backDashboard() {
      this.$emit('backDashboard')
    },
    backProcess() {
      this.$emit('backProcess', this.corpusData)
    },
  },
}
</script>

<style lang="scss" scoped>
.drop-shadow {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
}
</style>
