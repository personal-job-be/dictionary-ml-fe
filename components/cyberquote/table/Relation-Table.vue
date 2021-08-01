<template>
  <div>
    <b-card title="Result Table">
      <b-card-body>
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Left Node</th>
              <th>Relation</th>
              <th>Right Node</th>
              <th v-if="!isResume">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(data, index) in displayedData" :key="index">
              <td class="text-primary">
                <b-badge
                  pill
                  :style="
                    data.leftNodeColor !== null
                      ? `background-color:${data.leftNodeColor}`
                      : `background-color:#f5f5f5`
                  "
                  ><span class="text-primary font-12">
                    {{ data.leftNode }}
                  </span>
                </b-badge>
              </td>
              <td class="text-primary font-12">{{ data.relation.code }}</td>
              <td class="text-primary">
                <b-badge
                  pill
                  :style="
                    data.rightNodeColor !== null
                      ? `background-color:${data.rightNodeColor}`
                      : `background-color:#f5f5f5`
                  "
                  ><span class="text-primary font-12">
                    {{ data.rightNode }}
                  </span>
                </b-badge>
              </td>
              <td v-if="!isResume">
                <i
                  class="fe-trash-2 font-weight-bold font-12 p-1 text-primary"
                  style="cursor: pointer"
                  @click="removeRelation(data)"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </b-card-body>
    </b-card>
  </div>
</template>

<script>
export default {
  props: {
    dataTable: {
      type: Array,
      default: null,
    },
    isResume: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      relationData: this.dataTable,
      displayedData: [],
    }
  },
  mounted() {
    this.syncData()
  },
  methods: {
    syncData() {
      this.relationData = this.dataTable
      // filter distinct
      let indexRelation = []
      this.displayedData = []
      this.relationData.filter((item) => {
        const i = indexRelation.findIndex(
          (x) => x.idRelation === item.idRelation
        )
        if (i <= -1) {
          indexRelation.push({
            idRelation: item.idRelation,
            relation: item.relation,
          })
        }
        return null
      })
      indexRelation = indexRelation.filter((data) => data.idRelation !== 0)
      console.log('idx', indexRelation)

      indexRelation.forEach((data) => {
        const leftNode = this.relationData
          .filter(
            (subData) =>
              subData.idRelation === data.idRelation &&
              subData.relatedBy === null
          )
          .map((subData) => {
            return { words: subData.words, chunk: subData.chunk }
          })
        // .join(' ')
        const rightNode = this.relationData
          .filter(
            (subData) =>
              subData.idRelation === data.idRelation &&
              subData.relatedTo === null
          )
          .map((subData) => {
            return { words: subData.words, chunk: subData.chunk }
          })
        // .join(' ')
        const singleData = {
          idRelation: data.idRelation,
          leftNode: leftNode.map((data) => data.words).join(' '),
          leftNodeColor:
            leftNode[0].chunk === null ? null : leftNode[0].chunk.color,
          relation: data.relation,
          rightNode: rightNode.map((data) => data.words).join(' '),
          rightNodeColor:
            rightNode[0].chunk === null ? null : rightNode[0].chunk.color,
        }
        this.displayedData.push(singleData)
      })
      console.log(this.displayedData)
    },
    removeRelation(node) {
      const resRemoveNode = this.relationData.filter(
        (data) => data.idRelation === node.idRelation
      )
      resRemoveNode.forEach((data) => {
        data.idRelation = 0
        data.relation = null
        data.relatedTo = null
        data.relatedBy = null
      })
      const index = this.displayedData.indexOf(node)
      this.displayedData.splice(index, 1)
      this.$emit('syncData', this.relationData)
    },
  },
}
</script>

<style lang="scss" scoped></style>
