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
              Relation Process
            </div>
          </div>
          <div>
            <b-button
              variant="outline-primary"
              pill
              class="mr-2 drop-shadow"
              @click="back"
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
        <div v-if="isFetched" class="mt-3">
          <b-tabs
            nav-class="nav-tabs nav-bordered sub-heading-strong"
            active-nav-item-class="text-primary"
            content-class="py-3 pl-2 pr-3"
          >
            <b-tab title="Relation" active>
              <div class="sub-heading-strong text-primary mb-2">
                Selected Words
              </div>
              <b-alert
                :show="dismissCountDown"
                dismissible
                fade
                :variant="variant"
                @dismiss-count-down="countDownChanged"
              >
                {{ errorMessage }}
              </b-alert>
              <b-row>
                <b-col
                  md="12"
                  lg="4"
                  :class="[
                    isLeft && `border-red`,
                    `d-flex justify-content-center align-items-center font-weight-bold text-primary`,
                  ]"
                  :style="
                    leftWord !== null && leftWord.chunker_color !== null
                      ? `background-color:${leftWord.chunker_color}`
                      : `background-color:#f5f5f5`
                  "
                >
                  <span class="mr-3">
                    {{
                      leftWord === null || leftWord.words === null
                        ? null
                        : leftWord.chunk_group !== 0
                        ? corpusData
                            .filter(
                              (data) =>
                                data.chunk_group === leftWord.chunk_group
                            )
                            .map((data) => data.words)
                            .join(' ')
                        : leftWord.words
                    }}</span
                  >
                </b-col>
                <b-col
                  md="12"
                  lg="4"
                  class="d-flex justify-content-center align-items-center"
                >
                  <select v-model="selectedRelation" class="form-control mr-3">
                    <option value="-1" disabled>Please Select One</option>
                    <option
                      v-for="(relation, index) in relations"
                      :key="index"
                      :value="relation"
                    >
                      {{ relation.code }}
                    </option>
                  </select>
                </b-col>
                <b-col
                  md="12"
                  lg="4"
                  :class="[
                    !isLeft && `border-red`,
                    `d-flex justify-content-center align-items-center font-weight-bold text-primary`,
                  ]"
                  :style="
                    rightWord !== null && rightWord.chunker_color !== null
                      ? `background-color:${rightWord.chunker_color}`
                      : `background-color:#f5f5f5`
                  "
                >
                  <span>{{
                    rightWord === null || rightWord.words === null
                      ? null
                      : rightWord.chunk_group !== 0
                      ? corpusData
                          .filter(
                            (data) => data.chunk_group === rightWord.chunk_group
                          )
                          .map((data) => data.words)
                          .join(' ')
                      : rightWord.words
                  }}</span>
                </b-col>
              </b-row>
              <div class="d-flex justify-content-end mt-2">
                <b-button
                  variant="outline-primary"
                  pill
                  class="mr-2 drop-shadow"
                  @click="clearRelation"
                  >Clear</b-button
                >
                <b-button
                  class="drop-shadow btn-gradient"
                  pill
                  @click="setRelation"
                  >Select Relation</b-button
                >
              </div>
              <hr />
              <div class="sub-heading-strong mt-4 text-primary">
                Corpus {{ litigation.case_no }}
              </div>
              <span
                v-for="(corpusRelation, index) in corpusesRelation"
                :key="index"
                class="mr-1"
              >
                <!-- <b-tooltip :target="`corpusRelation-${index}`">
                  Relation :
                  {{
                    corpusRelation.relation_type !== null
                      ? corpusRelation.relation_type.code
                      : null
                  }}
                  <br />
                  Related To :
                  {{
                    corpusRelation.relation_to !== null
                      ? corpusesRelation
                          .filter(
                            (data) =>
                              data.chunk_group === corpusRelation.relation_to
                          )
                          .map((data) => data.words)
                          .join(' ')
                      : null
                  }}
                  <br />
                  Related By :
                  {{
                    corpusRelation.related_by !== null
                      ? corpusesRelation
                          .filter(
                            (data) =>
                              data.chunk_group === corpusRelation.related_by
                          )
                          .map((data) => data.words)
                          .join(' ')
                      : null
                  }}
                </b-tooltip> -->
                <b-badge
                  :id="`corpusRelation-${index}`"
                  pill
                  class="hand-pointing mt-1"
                  :style="
                    corpusRelation.chunker_color !== null
                      ? `background-color:${corpusRelation.chunker_color}`
                      : `background-color:#f5f5f5`
                  "
                  ><span
                    class="text-primary font-12"
                    @click="selectRelation(corpusRelation)"
                  >
                    {{ corpusRelation.words }}
                  </span>
                </b-badge>
              </span>
            </b-tab>
            <b-tab title="Result">
              <relation-table
                v-if="isFetched"
                ref="relation"
                :data-table="relationList"
                :data-chunk="corpusesRelation"
                :is-resume="false"
                @remove="remove"
              />
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
      </b-row> -->

    <!-- <div class="mt-2"></div> -->
  </div>
</template>

<script>
import RelationTable from '@/components/cyberquote/table/Relation-Table.vue'
import Loading from 'vue-loading-overlay'
export default {
  components: {
    RelationTable,
    Loading,
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
      relations: [],
      corpusesRelation: [],
      isLoading: false,
      isFetched: false,
      selectedRelation: '-1',
      isLeft: true,
      leftWord: null,
      rightWord: null,
      indexRelation: 0,
      isModified: false,
      relationList: [],
      resChunk: [],

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
    this.relations = await this.fetchRelations()
    this.corpusesRelation = await this.fetchCorpusRelation()
    // this.syncRelatedTo()
    this.isFetched = true
    this.isLoading = false
  },
  methods: {
    remove() {
      this.isModified = true
    },
    backDashboard() {
      this.$emit('backDashboard')
    },
    syncData(data) {
      this.corpusesRelation = data
      this.isModified = true
    },
    clearRelation() {
      this.isLeft = true
      this.leftWord = null
      this.rightWord = null
    },
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    },
    async fetchRelations() {
      try {
        const resRelations = await this.$axios.$get(`/master/relation/all`, {
          headers: {
            Authorization: this.$auth.strategy.token.get(),
          },
        })
        return resRelations.data
      } catch (error) {}
    },
    async fetchCorpusRelation() {
      try {
        const resCorpusWords = await this.$axios.$get(
          `/corpus/${this.litigation.litigation_id}/words`,
          {
            headers: {
              Authorization: this.$auth.strategy.token.get(),
            },
          }
        )

        this.resChunk = await this.$axios.$get(
          `/corpus/${this.litigation.litigation_id}/chunker`,
          {
            headers: {
              Authorization: this.$auth.strategy.token.get(),
            },
          }
        )
        resCorpusWords.data.forEach((data) => {
          let resFilterChunk = this.resChunk.data.filter(
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

        const resRelation = await this.$axios.$get(
          `/corpus/${this.litigation.litigation_id}/relation`,
          {
            headers: {
              Authorization: this.$auth.strategy.token.get(),
            },
          }
        )
        console.log('relation', resRelation)
        this.relationList = []
        this.indexRelation = 0
        resCorpusWords.data.forEach((word) => {
          // check relation
          const resultFilter = resRelation.data.filter(
            (relation) =>
              relation.corpus_index === word.corpus_index &&
              relation.relation_id !== null
          )

          resultFilter.forEach((filter) => {
            this.indexRelation++
            this.relationList.push({
              id: this.indexRelation,
              corpus_index: filter.corpus_index,
              relation_id: filter.relation_id,
              relation_type: filter.relation_type,
              node_index: filter.node_index,
            })
          })
        })
        console.log('relation1', this.relationList)
        // resCorpusWords.data.forEach((data) => {
        //   let resFilterRelation = resRelation.data.filter(
        //     (corpusRelation) =>
        //       corpusRelation.corpus_index === data.corpus_index
        //   )
        //   if (resFilterRelation.length > 0) {
        //     resFilterRelation = resFilterRelation.reduce(
        //       (corpusChunk) => corpusChunk
        //     )
        //     data.node_index = resFilterRelation.node_index
        //     data.relation_id = resFilterRelation.relation_id
        //     data.relation_type = resFilterRelation.relation_type
        //     data.relation_to = resFilterRelation.relation_to
        //     data.chunk_group = resFilterRelation.chunk_group
        //     data.chunk_color = resFilterRelation.chunk_color
        //   } else {
        //     data.node_index = null
        //     data.relation_id = null
        //     data.relation_type = null
        //     data.relation_to = null
        //     data.chunk_group = null
        //     data.chunk_color = null
        //   }
        // })

        return resCorpusWords.data
      } catch (error) {}
    },
    syncRelatedTo() {
      const hasRelation = this.corpusesRelation.filter(
        (data) => data.relation_id !== null
      )

      hasRelation.forEach((data) => {
        this.indexRelation++
        // define all same chunk group related_to
        const sameGroup = this.corpusesRelation.filter(
          (corpus) => corpus.chunk_group === data.chunk_group
        )

        const relation = this.relations
          .filter((relation) => relation.id === data.relation_id)
          .reduce((relation) => relation)

        sameGroup.forEach((corpus) => {
          corpus.relation_to = this.corpusesRelation
            .filter((relation) => relation.corpus_index === data.node_index)
            .reduce((relation) => relation).chunk_group
          corpus.relation_id = this.indexRelation
          corpus.relation_type = relation
        })

        // define all same chunk group related_by
        const findChunkGroup = this.corpusesRelation
          .filter((corpus) => corpus.corpus_index === data.node_index)
          .reduce((corpus) => corpus)
        const sameGroupBy = this.corpusesRelation.filter(
          (corpus) => corpus.chunk_group === findChunkGroup.chunk_group
        )

        sameGroupBy.forEach((corpus) => {
          corpus.related_by = data.chunk_group
          corpus.relation_id = this.indexRelation
          corpus.relation_type = relation
        })
      })
    },
    selectRelation(item) {
      if (item.chunk_group === null) {
        this.dismissCountDown = this.dismissSecs
        this.errorMessage = `This word has no chunk`
        this.variant = 'danger'
        return
      }
      if (this.isLeft) {
        // if (item.relation_to !== null) {
        //   this.dismissCountDown = this.dismissSecs
        //   this.errorMessage = `This word has relation, please remove the relation on table below`
        //   this.variant = 'danger'
        //   return
        // }
        if (item === this.rightWord) {
          this.dismissCountDown = this.dismissSecs
          this.errorMessage = `Can't have relation with same corpus`
          this.variant = 'danger'
          return
        }
        this.leftWord = item
      } else {
        // const hasRelation = this.corpusesRelation.filter(
        //   (data) => data.relation_to === item.chunk_group
        // )
        // if (hasRelation.length > 0) {
        //   this.dismissCountDown = this.dismissSecs
        //   this.errorMessage = `This word has relation, please remove the relation on table below`
        //   this.variant = 'danger'
        //   return
        // }
        if (item === this.leftWord) {
          this.dismissCountDown = this.dismissSecs
          this.errorMessage = `Can't have relation with same corpus`
          this.variant = 'danger'
          return
        }
        this.rightWord = item
      }
      this.isLeft = !this.isLeft
    },
    async back() {
      if (this.isModified) await this.savingProcess()
      this.$emit('backProcess', this.corpusesRelation)
    },
    async nextProcess() {
      if (this.isModified) await this.savingProcess()
      this.$emit('nextProcess', this.corpusesRelation)
    },
    setRelation() {
      if (
        this.leftWord !== null &&
        this.rightWord !== null &&
        this.selectedRelation !== '-1'
      ) {
        const leftNode = this.corpusesRelation.filter(
          (corpus) => corpus.chunk_group === this.leftWord.chunk_group
        )
        const rightNode = this.corpusesRelation.filter(
          (corpus) => corpus.chunk_group === this.rightWord.chunk_group
        )

        this.relationList.push({
          corpus_index: leftNode[leftNode.length - 1].corpus_index,
          relation_id: this.selectedRelation.id,
          relation_type: this.selectedRelation.code,
          node_index: rightNode[rightNode.length - 1].corpus_index,
        })
        this.isModified = true
        this.$refs.relation.convertData()
        this.clearRelation()
      }
    },
    saveRelation() {
      if (
        this.leftWord !== null &&
        this.rightWord !== null &&
        this.selectedRelation !== '-1'
      ) {
        this.indexRelation++
        this.isModified = true
        let leftWords = []
        // const rightWords = []
        leftWords.push(this.leftWord)
        // rightWords.push(this.rightWord)
        if (this.leftWord.chunk_group !== 0)
          leftWords = this.corpusesRelation.filter(
            (data) => data.chunk_group === this.leftWord.chunk_group
          )
        // if (this.rightWord.chunk_group !== 0)
        //   rightWords = this.corpusesRelation.filter(
        //     (data) => data.chunk_group === this.rightWord.chunk_group
        //   )
        // if (this.leftWord.idChunkGroup !== 0)
        leftWords.forEach((data) => {
          data.relation_to.push(this.rightWord.chunk_group)
          data.relation_id.push(this.indexRelation)
          data.relation_type.push(this.selectedRelation)
        })
        // else
        // rightWords.forEach((data) => {
        //   data.related_by = this.leftWord.chunk_group
        //   data.relation_id = this.indexRelation
        //   data.relation_type = this.selectedRelation
        // })
        // this.$refs.relation.syncData()
        this.clearRelation()
      } else if (this.leftWord === null || this.rightWord === null) {
        this.dismissCountDown = this.dismissSecs
        this.errorMessage = `Left Word or Right Word Can't be empty`
        this.variant = 'danger'
      } else if (this.selectedRelation === '-1') {
        this.dismissCountDown = this.dismissSecs
        this.errorMessage = `Please Select The Relation`
        this.variant = 'danger'
      }
    },
    async savingProcess() {
      const resultRelation = []
      this.relationList.forEach((data) => {
        resultRelation.push({
          corpus_index: data.corpus_index,
          node_index: data.node_index,
          relation_id: data.relation_id,
        })
      })
      console.log(resultRelation)
      try {
        await this.$axios.$post(
          `/corpus/${this.litigation.litigation_id}/relation`,
          {
            data: resultRelation,
          },
          {
            headers: {
              Authorization: this.$auth.strategy.token.get(),
            },
          }
        )
        this.dismissCountDown = this.dismissSecs
        this.errorMessage = 'Relation Words saved'
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
.hand-pointing {
  cursor: pointer;
}
.border-red {
  border: 1px solid var(--primary);
}
.drop-shadow {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
}
</style>
