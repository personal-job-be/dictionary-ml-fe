<template>
  <div>
    <!-- <b-card title="Result Table">
      <b-card-body> -->
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
          <td class="text-primary font-12">{{ data.relation }}</td>
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
    <!-- </b-card-body>
    </b-card> -->
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
    dataChunk: {
      type: Array,
      default: null,
    },
  },
  data() {
    return {
      relationData: this.dataTable,
      displayedData: [],
    }
  },
  mounted() {
    // this.syncData()
    this.convertData()
  },
  methods: {
    convertData() {
      this.displayedData = []
      this.relationData.forEach((relation) => {
        const chunkGroupLeft = this.dataChunk
          .filter((chunk) => chunk.corpus_index === relation.corpus_index)
          .reduce((data) => data)
        const leftWords = this.dataChunk
          .filter((chunk) => chunk.chunk_group === chunkGroupLeft.chunk_group)
          .map((word) => {
            return { words: word.words, chunker_color: word.chunker_color }
          })
        const chunkGroupRight = this.dataChunk
          .filter((chunk) => chunk.corpus_index === relation.node_index)
          .reduce((data) => data)
        const rightWords = this.dataChunk
          .filter((chunk) => chunk.chunk_group === chunkGroupRight.chunk_group)
          .map((word) => {
            return { words: word.words, chunker_color: word.chunker_color }
          })
        const singleRelation = {
          id: relation.id,
          leftNode: leftWords.map((word) => word.words).join(' '),
          leftNodeColor: leftWords[0].chunker_color,
          relation: relation.relation_type,
          rightNode: rightWords.map((word) => word.words).join(' '),
          rightNodeColor: rightWords[0].chunker_color,
        }
        this.displayedData.push(singleRelation)
      })
    },
    syncData() {
      this.relationData = this.dataTable
      // filter distinct
      const indexRelation = []
      this.displayedData = []
      this.relationData.filter((item) => {
        if (item.relation_id !== null) {
          const i = indexRelation.findIndex(
            (x) => x.item.relation_id === item.relation_id
          )
          if (i <= -1) {
            indexRelation.push({ item })
            // indexRelation.push({
            //   relation_id: item.relation_id,
            //   relation: item.relation_type,
            // })
          }
        }
        return null
      })
      // indexRelation = indexRelation.filter((data) => data.relation_id !== 0)
      indexRelation.forEach((data) => {
        const leftNode = this.relationData
          .filter((subData) => subData.chunk_group === data.item.chunk_group)
          .map((subData) => {
            return { words: subData.words, chunk_color: subData.chunk_color }
          })
        const rightNode = this.relationData
          .filter((subData) => subData.chunk_group === data.item.relation_to)
          .map((subData) => {
            return { words: subData.words, chunk_color: subData.chunk_color }
          })
        const singleData = {
          idRelation: data.item.relation_id,
          leftNode: leftNode.map((data) => data.words).join(' '),
          leftNodeColor:
            leftNode[0].chunk_color === null ? null : leftNode[0].chunk_color,
          relation: data.item.relation_type.abbreviation,
          rightNode: rightNode.map((data) => data.words).join(' '),
          rightNodeColor:
            rightNode[0].chunk_color === null ? null : rightNode[0].chunk_color,
        }
        this.displayedData.push(singleData)
      })

      // indexRelation.forEach((data) => {
      //   const leftNode = this.relationData
      //     .filter(
      //       (subData) =>
      //         subData.relation_id === data.relation_id &&
      //         subData.related_by === null
      //     )
      //     .map((subData) => {
      //       return { words: subData.words, chunk: subData.chunk }
      //     })
      //   const rightNode = this.relationData
      //     .filter(
      //       (subData) =>
      //         subData.idRelation === data.idRelation &&
      //         subData.relatedTo === null
      //     )
      //     .map((subData) => {
      //       return { words: subData.words, chunk: subData.chunk }
      //     })
      //   const singleData = {
      //     idRelation: data.idRelation,
      //     leftNode: leftNode.map((data) => data.words).join(' '),
      //     leftNodeColor:
      //       leftNode[0].chunk === null ? null : leftNode[0].chunk.color,
      //     relation: data.relation,
      //     rightNode: rightNode.map((data) => data.words).join(' '),
      //     rightNodeColor:
      //       rightNode[0].chunk === null ? null : rightNode[0].chunk.color,
      //   }
      //   this.displayedData.push(singleData)
      // })
    },
    removeRelation(node) {
      const indexRemove = this.relationData
        .map((data) => data.id)
        .indexOf(node.id)
      this.relationData.splice(indexRemove, 1)
      this.convertData()
      this.$emit('remove')
      // const resRemoveNode = this.relationData.filter(
      //   (data) => data.relation_id === node.idRelation
      // )
      // resRemoveNode.forEach((data) => {
      //   data.relation_id = 0
      //   data.relation_type = null
      //   data.relation_to = null
      //   data.related_by = null
      // })
      // const index = this.displayedData.indexOf(node)
      // this.displayedData.splice(index, 1)
    },
  },
}
</script>

<style lang="scss" scoped></style>
