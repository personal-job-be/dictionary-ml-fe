<template>
  <div>
    <b-card>
      <b-card-body>
        <div class="d-flex justify-content-between">
          <div class="d-flex">
            <b-button
              class="btn-gradient btn-rounded drop-shadow"
              @click="backDashboard"
            >
              <i class="fas fa-home"></i>
            </b-button>
            <div class="font-weight-bold font-20 font-primary ml-2">
              Chunking Process
            </div>
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
        <div v-if="isFetched" class="mt-4">
          <b-tabs
            nav-class="nav-tabs nav-bordered sub-heading-strong"
            active-nav-item-class="text-primary"
            content-class="py-3 pl-2 pr-3"
          >
            <b-tab title="Chunk" active>
              <div class="sub-heading-strong text-primary">Selected Words</div>
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
                  v-for="(abbreviation, index) in abbreviations"
                  :key="index"
                  pill
                  class="text-primary mr-2 mt-2"
                  :style="`background-color:${abbreviation.color}; border: none;`"
                  @click="selectChunk(abbreviation)"
                  >{{ abbreviation.abbreviation }}</b-button
                >
              </span>
              <div class="mt-2">
                <span
                  v-for="(selectedChunk, index) in selectedChunks"
                  :key="index"
                >
                  <b-badge
                    v-if="selectedChunk.isDisplayed"
                    class="un-pos-tag mr-1 p-1 mt-1 text-primary hand-pointing"
                    pill
                    :style="
                      selectedChunk.chunker !== null
                        ? `background-color:${selectedChunk.chunker_color}`
                        : `background-color:#f5f5f5`
                    "
                    ><span class="font-12">
                      {{
                        selectedChunk.chunk_group !== null
                          ? selectedChunks
                              .filter(
                                (data) =>
                                  data.chunk_group === selectedChunk.chunk_group
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
              <hr />
              <div class="sub-heading-strong mt-4 text-primary">
                Corpus {{ litigation.case_no }}
              </div>
              <span
                v-for="(corpusChunk, index) in corpusesChunk"
                :key="index"
                class="mr-2"
              >
                <!-- <b-tooltip :target="`corpusChunk-${index}`"
                  >PosTag : {{ corpusChunk.postag }} <br />
                  Chunk :
                  {{ corpusChunk.chunker }}</b-tooltip
                > -->
                <div
                  class="btn-group mt-3"
                  role="group"
                  aria-label="Basic example"
                >
                  <button
                    type="button"
                    class="text-primary font-14 p-1 corpus-btn"
                    :style="
                      corpusChunk.chunker !== null
                        ? `background-color:${corpusChunk.chunker_color}`
                        : `background-color:#f5f5f5`
                    "
                    @click="selectCorpus(corpusChunk)"
                  >
                    {{ corpusChunk.words }}
                  </button>
                  <button
                    v-if="corpusChunk.chunk_group !== null"
                    type="button"
                    class="btn pos-tagged font-12 p-1"
                    @click="removeChunk(corpusChunk)"
                  >
                    <i class="fe-trash-2 text-primary font-weight-bold" />
                  </button>
                </div>

                <!-- <b-badge
                  :id="`corpusChunk-${index}`"
                  pill
                  class="hand-pointing mt-1 text-primary"
                  :style="
                    corpusChunk.chunker !== null
                      ? `background-color:${corpusChunk.chunker_color}`
                      : `background-color:#f5f5f5`
                  "
                  ><span
                    class="text-primary font-12"
                    @click="selectCorpus(corpusChunk)"
                  >
                    {{ corpusChunk.words }}
                  </span>
                  <i
                    v-if="corpusChunk.chunk_group !== null"
                    class="fe-trash-2 font-weight-bold font-12 p-1"
                    @click="removeChunk(corpusChunk)"
                  />
                </b-badge> -->
              </span>
            </b-tab>
            <b-tab title="Result">
              <chunk-table ref="chunkTable" :data-table="corpusesChunk" />
            </b-tab>
          </b-tabs>
        </div>
      </b-card-body>
    </b-card>
    <!-- <b-row>
            <b-col>
              <b-card title="Selected Words">
                <b-card-body> </b-card-body>
              </b-card>
            </b-col>
          </b-row>

          <b-row>
            <b-col>
              <b-card title="Corpus">
                <b-card-body> </b-card-body>
              </b-card>
            </b-col>
          </b-row>

          <b-row>
            <b-col> </b-col>
          </b-row> -->
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
      abbreviations: null,
      // alert
      errorMessage: null,
      dismissSecs: 3,
      dismissCountDown: 0,
      variant: null,
      isModified: false,
      relation: null,
    }
  },
  async mounted() {
    this.isFetched = false
    this.isLoading = true
    this.isModified = false
    this.chunks = await this.fetchChunks()
    this.abbreviations = this.chunks.reduce((unique, o) => {
      if (!unique.some((obj) => obj.abbreviation === o.abbreviation)) {
        unique.push(o)
      }
      return unique
    }, [])

    console.log(this.abbreviation)
    this.corpusesChunk = await this.fetchCorpusChunk()
    this.isFetched = true
    this.isLoading = false
  },
  methods: {
    async backDashboard() {
      if (this.isModified) await this.savingProcess()
      this.$emit('backDashboard')
    },

    async fetchChunks() {
      try {
        const resChunks = await this.$axios.$get(`/master/chunker/all`, {
          headers: {
            Authorization: this.$auth.strategy.token.get(),
          },
        })
        return resChunks.data.filter((chunk) => chunk.abbreviation !== 'O')
      } catch (error) {
        this.dismissCountDown = this.dismissSecs
        this.errorMessage = error.response.data
        this.variant = 'danger'
      }
    },

    async fetchCorpusChunk() {
      try {
        const resCorpusWords = await this.$axios.$get(
          `/corpus/${this.litigation.litigation_id}/words`,
          {
            headers: {
              Authorization: this.$auth.strategy.token.get(),
            },
          }
        )

        const resChunk = await this.$axios.$get(
          `/corpus/${this.litigation.litigation_id}/chunker`,
          {
            headers: {
              Authorization: this.$auth.strategy.token.get(),
            },
          }
        )
        console.log('resultChunk', resChunk)
        resCorpusWords.data.forEach((data) => {
          let resFilterChunk = resChunk.data.filter(
            (corpusChunk) => corpusChunk.corpus_index === data.corpus_index
          )
          if (resFilterChunk.length > 0) {
            resFilterChunk = resFilterChunk.reduce((corpusChunk) => corpusChunk)
            data.postag = resFilterChunk.postag
            data.chunk_group = resFilterChunk.chunk_group
            data.chunker = resFilterChunk.chunker
            data.chunker_color = resFilterChunk.chunker_color
            data.chunker_id = resFilterChunk.chunker_id
            data.isDisplayed = true
          } else {
            data.postag = null
            data.chunk_group = null
            data.chunker = null
            data.chunker_color = null
            data.chunker_id = null
            data.isDisplayed = true
          }
        })
        const max = resCorpusWords.data.reduce(function (prev, current) {
          return prev.chunk_group > current.chunk_group ? prev : current
        }).chunk_group
        this.idChunkGroup = max

        const resRelation = await this.$axios.$get(
          `/corpus/${this.litigation.litigation_id}/relation`,
          {
            headers: {
              Authorization: this.$auth.strategy.token.get(),
            },
          }
        )
        this.relation = resRelation.data

        return resCorpusWords.data
      } catch (error) {
        this.dismissCountDown = this.dismissSecs
        this.errorMessage = error.response.data
        this.variant = 'danger'
      }
    },

    selectCorpus(item) {
      const index = this.selectedChunks.indexOf(item)
      if (index >= 0) {
        this.dismissCountDown = this.dismissSecs
        this.errorMessage = `Word already selected`
        this.variant = 'danger'
        return
      }
      if (item.chunk_group !== null) {
        const groupedChunk = this.corpusesChunk.filter(
          (data) => data.chunk_group === item.chunk_group
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
      this.isModified = true
      this.idChunkGroup++
      const sameAbbreviation = this.chunks.filter(
        (data) => data.abbreviation.trim() === chunk.abbreviation.trim()
      )
      let bChunk
      let iChunk
      let singleChunk
      let isSingle = false
      if (sameAbbreviation.length > 1) {
        isSingle = false
        bChunk = sameAbbreviation
          .filter((data) => data.code === `B-${data.abbreviation.trim()}`)
          .reduce((data) => data)
        iChunk = sameAbbreviation
          .filter((data) => data.code === `I-${data.abbreviation.trim()}`)
          .reduce((data) => data)
      } else {
        isSingle = true
        singleChunk = sameAbbreviation.reduce((data) => data)
      }

      this.selectedChunks.forEach((data, index) => {
        data.chunk_group = this.idChunkGroup
        if (!isSingle) {
          if (index === 0) {
            data.abbreviation = bChunk.abbreviation.trim()
            data.chunker = bChunk.code
            data.chunker_color = bChunk.color
            data.chunker_id = bChunk.id
          } else {
            data.abbreviation = iChunk.abbreviation.trim()
            data.chunker = iChunk.code
            data.chunker_color = iChunk.color
            data.chunker_id = iChunk.id
          }
        } else {
          console.log('others', singleChunk)
          data.abbreviation = singleChunk.abbreviation.trim()
          data.chunker = singleChunk.code
          data.chunker_color = singleChunk.color
          data.chunker_id = singleChunk.id
        }
      })
      console.log('selected', this.corpusesChunk)
      this.selectedChunks = []
      this.$refs.chunkTable.syncData()
    },

    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    },

    async backProcess() {
      if (this.isModified) await this.savingProcess()
      this.$emit('backProcess', this.corpusesChunk)
    },

    async nextProcess() {
      if (this.isModified) await this.savingProcess()
      this.$emit('nextProcess', this.corpusesChunk)
    },

    removeChunk(chunk) {
      this.isModified = true
      console.log(this.relation)
      console.log(chunk)

      // check if chunk has relation
      let hasRelation = false
      const indexLeftNode = this.relation.filter(
        (data) =>
          data.chunk_group === chunk.chunk_group && data.relation_id !== null
      )
      if (indexLeftNode.length > 0) hasRelation = true
      console.log('left', indexLeftNode)
      const rightNode = this.relation
        .filter((data) => data.relation_id !== null)
        .map((data) => data.node_index)
      const indexRightNode = []
      rightNode.forEach((data) => {
        const chunkGroup = this.corpusesChunk.filter(
          (corpus) => corpus.corpus_index === data
        )
        console.log('gr', chunkGroup)
        const sameGroup = chunkGroup.filter(
          (corpus) => corpus.chunk_group === chunk.chunk_group
        )
        if (sameGroup.length > 0)
          indexRightNode.push(chunkGroup.reduce((corpus) => corpus))
      })
      if (indexRightNode.length > 0) hasRelation = true

      if (!hasRelation) {
        const sameGroup = this.corpusesChunk.filter(
          (data) => data.chunk_group === chunk.chunk_group
        )
        sameGroup.forEach((data) => {
          data.chunk_group = null
          data.chunker = null
          data.chunker_color = null
          data.chunker_id = null
          data.isDisplayed = true
        })

        this.$refs.chunkTable.syncData()
      } else {
        this.dismissCountDown = this.dismissSecs
        this.errorMessage = `Word has relation, You can't remove Chunker`
        this.variant = 'danger'
      }
    },

    removeSelected(word) {
      if (word.chunk_group === null) {
        const indexChunk = this.selectedChunks.indexOf(word)
        this.selectedChunks.splice(indexChunk, 1)
      } else {
        const chunkWords = this.selectedChunks.filter(
          (data) => data.chunk_group === word.chunk_group
        )
        chunkWords.forEach((data) => {
          const indexChunk = this.selectedChunks.indexOf(data)
          this.selectedChunks.splice(indexChunk, 1)
        })
      }
    },

    async savingProcess() {
      const resUniqueChunkerGroup = this.corpusesChunk
        .reduce((unique, o) => {
          if (
            !unique.some(
              (obj) =>
                obj.chunk_group === o.chunk_group &&
                obj.chunker_id === o.chunker_id
            ) &&
            o.chunk_group !== null
          ) {
            unique.push(o)
          }
          return unique
        }, [])
        .map((data) => {
          return { chunk_group: data.chunk_group, chunker_id: data.chunker_id }
        })

      const resultChunker = []
      resUniqueChunkerGroup.forEach((data) => {
        const singleChunker = {
          chunk_group: data.chunk_group,
          chunker_id: data.chunker_id,
          corpus_index: this.corpusesChunk
            .filter(
              (corpus) =>
                corpus.chunk_group === data.chunk_group &&
                corpus.chunker_id === data.chunker_id
            )
            .map((corpus) => corpus.corpus_index),
        }
        resultChunker.push(singleChunker)
      })
      console.log('save', resultChunker)
      try {
        await this.$axios.$post(
          `/corpus/${this.litigation.litigation_id}/chunker`,
          {
            data: resultChunker,
          },
          {
            headers: {
              Authorization: this.$auth.strategy.token.get(),
            },
          }
        )
        this.dismissCountDown = this.dismissSecs
        this.errorMessage = 'Chunker Words saved'
        this.variant = 'success'
      } catch (error) {
        this.dismissCountDown = this.dismissSecs
        this.errorMessage = error.response.data
        this.variant = 'danger'
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.un-chunk {
  background-color: #f5f5f5;
  border: none;
}
.corpus-btn {
  border: none;
}
.pos-tagged {
  background-color: #ffe08a;
  border: none;
}
.hand-pointing {
  cursor: pointer;
}
.drop-shadow {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
}
</style>
