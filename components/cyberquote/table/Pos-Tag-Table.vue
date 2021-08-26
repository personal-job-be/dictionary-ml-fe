<template>
  <div v-if="displayedData !== null">
    <span v-for="(corpusTag, index) in displayedData" :key="index" class="mr-2">
      <div class="btn-group mt-3" role="group" aria-label="Basic example">
        <button
          type="button"
          :class="[
            corpusTag.postag !== null
              ? 'pos-tagged'
              : corpusTag.isSelected
              ? 'selected-tag'
              : 'un-pos-tag  ',
            'text-primary hand-cursor font-14 p-1',
          ]"
          @click="selectWord(corpusTag)"
        >
          {{ corpusTag.words }}
        </button>
        <button
          v-if="corpusTag.postag !== null"
          type="button"
          class="bg-primary text-white p-1"
        >
          {{ corpusTag.postag }}
        </button>
      </div>
    </span>
    <!-- <table class="table table-striped">
      <thead>
        <tr>
          <th>Tag</th>
          <th>Words</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(data, index) in displayedData" :key="index">
          <td>
            <b-badge pill style="background-color: #f5f5f5"
              ><span class="text-primary font-12">
                {{ data.postag }}
              </span>
            </b-badge>
          </td>
          <td>
            <b-badge
              v-for="(subData, index1) in data.words"
              :key="index1"
              pill
              class="mr-2"
              style="background-color: #f5f5f5"
              ><span class="text-primary font-12">
                {{ subData.words }}
              </span>
            </b-badge>
          </td>
        </tr>
      </tbody>
    </table> -->
  </div>
</template>

<script>
export default {
  props: {
    dataTable: {
      type: Array,
      default: null,
    },
  },
  data() {
    return {
      displayedData: this.dataTable,
    }
  },
  mounted() {
    this.syncData()
  },
  methods: {
    syncData() {
      this.displayedData = this.dataTable
      // distinct tag
      // let tags = []
      // this.dataTable.filter((item) => {
      //   const i = tags.findIndex((x) => x.postag === item.postag)
      //   if (i <= -1) {
      //     tags.push({ postag: item.postag })
      //   }
      //   return null
      // })
      // tags = tags.filter((data) => data.postag !== null)
      // this.displayedData = []
      // tags.forEach((data) => {
      //   const words = this.dataTable.filter(
      //     (subData) => subData.postag === data.postag
      //   )
      //   this.displayedData.push({
      //     postag: data.postag,
      //     words,
      //   })
      // })
    },
  },
}
</script>

<style lang="scss" scoped>
.un-pos-tag {
  background-color: #f5f5f5;
  border: none;
}
.pos-tagged {
  background-color: #ffe08a;
  border: none;
}
.selected-tag {
  background-color: #b5b6b0;
  border: none;
}
</style>
