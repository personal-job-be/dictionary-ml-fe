<template>
  <div>
    <div class="d-flex justify-content-between">
      <div class="d-flex">
        <div class="font-weight-bold font-20 font-primary mr-2">
          Chunking Process
        </div>
        <b-button
          class="btn-success btn-rounded drop-shadow"
          @click="backDashboard"
        >
          Back to Dashboard
        </b-button>
      </div>

      <div>
        <b-button
          variant="outline-primary"
          pill
          class="mr-2 drop-shadow"
          @click="backProcess"
          >Back</b-button
        >
        <b-button
          class="btn-gradient btn-rounded drop-shadow"
          @click="nextProcess"
          >Next</b-button
        >
      </div>
    </div>
    <loading
      :active="isLoading"
      :can-cancel="false"
      :is-full-page="true"
      loader="bars"
      color="#5b315f"
      :opacity="0"
      :width="64"
      :height="64"
    />
    <div v-if="isFetched">
      <b-row>
        <b-col md="11" class="mt-3">
          <b-row>
            <b-col>
              <b-card title="Selected Words">
                <b-card-body>
                  <b-alert
                    :show="dismissCountDown"
                    dismissible
                    fade
                    :variant="variant"
                    @dismiss-count-down="countDownChanged"
                  >
                    {{ errorMessage }}
                  </b-alert>
                  <span>
                    <b-button
                      v-for="(chunk, index) in chunks"
                      :key="index"
                      pill
                      class="text-primary mr-2 mt-2"
                      :style="`background-color:${chunk.color}; border: none;`"
                      @click="selectChunk(chunk)"
                      >{{ chunk.code }}</b-button
                    >
                  </span>
                  <div class="mt-2">
                    <span
                      v-for="(selectedChunk, index) in selectedChunks"
                      :key="index"
                    >
                      <b-badge
                        v-if="selectedChunk.isDisplayed"
                        class="
                          un-pos-tag
                          mr-1
                          p-1
                          mt-1
                          text-primary
                          hand-pointing
                        "
                        pill
                        :style="
                          selectedChunk.chunk !== null
                            ? `background-color:${selectedChunk.chunk.color}`
                            : `background-color:#f5f5f5`
                        "
                        ><span class="font-12">
                          {{
                            selectedChunk.idChunkGroup !== 0
                              ? selectedChunks
                                  .filter(
                                    (data) =>
                                      data.idChunkGroup ===
                                      selectedChunk.idChunkGroup
                                  )
                                  .map((data) => data.words)
                                  .join(' ')
                              : selectedChunk.words
                          }}
                        </span>
                        <i
                          class="fe-trash-2 font-weight-bold font-12 p-1"
                          style="cursor: pointer"
                          @click="removeSelected(selectedChunk)"
                        />
                      </b-badge>
                    </span>
                  </div>
                </b-card-body>
              </b-card>
            </b-col>
          </b-row>

          <b-row>
            <b-col>
              <b-card title="Corpus">
                <b-card-body>
                  <span
                    v-for="(corpusChunk, index) in corpusesChunk"
                    :key="index"
                    class="mr-1"
                  >
                    <b-tooltip :target="`corpusChunk-${index}`"
                      >PosTag : {{ corpusChunk.postag }} <br />
                      Chunk :
                      {{
                        corpusChunk.chunk !== null
                          ? corpusChunk.chunk.code
                          : null
                      }}</b-tooltip
                    >
                    <b-badge
                      :id="`corpusChunk-${index}`"
                      pill
                      class="hand-pointing mt-1 text-primary"
                      :style="
                        corpusChunk.chunk !== null
                          ? `background-color:${corpusChunk.chunk.color}`
                          : `background-color:#f5f5f5`
                      "
                      ><span
                        class="text-primary font-12"
                        @click="selectCorpus(corpusChunk)"
                      >
                        {{ corpusChunk.words }}
                      </span>
                      <i
                        v-if="corpusChunk.idChunkGroup !== 0"
                        class="fe-trash-2 font-weight-bold font-12 p-1"
                        @click="removeChunk(corpusChunk)"
                      />
                    </b-badge>
                  </span>
                </b-card-body>
              </b-card>
            </b-col>
          </b-row>

          <b-row>
            <b-col>
              <chunk-table ref="chunkTable" :data-table="corpusesChunk" />
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import Loading from 'vue-loading-overlay'
import ChunkTable from '@/components/cyberquote/table/Chunk-Table.vue'
export default {
  components: {
    Loading,
    ChunkTable,
  },
  props: {
    litigation: {
      type: Object,
      default: null,
    },
    corpusData: {
      type: Array,
      default: null,
    },
  },
  data() {
    return {
      chunks: [],
      corpusesChunk: [],
      selectedChunks: [],
      idChunkGroup: 0,
      isLoading: false,
      isFetched: false,
      // alert
      errorMessage: null,
      dismissSecs: 3,
      dismissCountDown: 0,
      variant: null,
    }
  },
  async mounted() {
    this.isFetched = false
    this.isLoading = true
    this.chunks = await this.fetchChunks()
    this.corpusesChunk = await this.fetchCorpusChunk()
    this.isFetched = true
    this.isLoading = false
  },
  methods: {
    backDashboard() {
      this.$emit('backDashboard')
    },
    async fetchChunks() {
      const resChunks = await this.$axios.$get(`/master/chunker/all`, {
        headers: {
          Authorization: this.$auth.strategy.token.get(),
        },
      })
      return resChunks.data
    },
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    },
    fetchCorpusChunk() {
      // let resCorpusChunk = await this.$axios.$get(
      //   `/corpus/${this.litigation.litigation_id}/chunker`,
      //   {
      //     headers: {
      //       Authorization: this.$auth.strategy.token.get(),
      //     },
      //   }
      // )
      //       const resCorpusChunk = resCorpusChunk.data.map((obj) => ({
      //   ...obj,
      //   idChunkGroup: 0,
      //   chunk: null,
      //   isDisplayed: true,
      // }))
      if (this.corpusData[0].idChunkGroup !== undefined) return this.corpusData
      const resCorpusChunk = this.corpusData.map((obj) => ({
        ...obj,
        idChunkGroup: 0,
        chunk: null,
        isDisplayed: true,
        idRelation: 0,
        relatedTo: null,
        relation: null,
        relatedBy: null,
      }))
      return resCorpusChunk
    },
    backProcess() {
      this.$emit('backProcess', this.corpusesChunk)
    },
    nextProcess() {
      this.$emit('nextProcess', this.corpusesChunk)
    },
    selectCorpus(item) {
      const index = this.selectedChunks.indexOf(item)
      if (index >= 0) {
        this.dismissCountDown = this.dismissSecs
        this.errorMessage = `Word already selected`
        this.variant = 'danger'
        return
      }
      if (item.idChunkGroup !== 0) {
        const groupedChunk = this.corpusesChunk.filter(
          (data) => data.idChunkGroup === item.idChunkGroup
        )
        groupedChunk.forEach((data, index) => {
          if (index > 0) data.isDisplayed = false
          this.selectedChunks.push(data)
        })
        return
      }
      this.selectedChunks.push(item)
    },
    selectChunk(chunk) {
      this.idChunkGroup++
      this.selectedChunks.forEach((data) => {
        data.idChunkGroup = this.idChunkGroup
        data.chunk = chunk
      })
      this.selectedChunks = []
      this.$refs.chunkTable.syncData()
    },
    removeChunk(chunk) {
      chunk.idChunkGroup = 0
      chunk.chunk = null
      chunk.isDisplayed = true
    },
    removeSelected(word) {
      if (word.idChunkGroup === 0) {
        const indexChunk = this.selectedChunks.indexOf(word)
        this.selectedChunks.splice(indexChunk, 1)
      } else {
        const chunkWords = this.selectedChunks.filter(
          (data) => data.idChunkGroup === word.idChunkGroup
        )
        chunkWords.forEach((data) => {
          const indexChunk = this.selectedChunks.indexOf(data)
          this.selectedChunks.splice(indexChunk, 1)
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.un-chunk {
  background-color: #f5f5f5;
}
.hand-pointing {
  cursor: pointer;
}
.drop-shadow {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
}
</style>
