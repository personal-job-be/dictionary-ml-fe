<template>
  <div>
    <div class="d-flex justify-content-between">
      <div class="d-flex">
        <div class="font-weight-bold font-20 font-primary mr-2">
          Relation Process
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
    <div v-if="isFetched" class="mt-2">
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
              <b-row>
                <b-col
                  md="12"
                  lg="4"
                  :class="[
                    isLeft && `border-red`,
                    `d-flex justify-content-center align-items-center font-weight-bold text-primary`,
                  ]"
                  :style="
                    leftWord !== null && leftWord.chunk !== null
                      ? `background-color:${leftWord.chunk.color}`
                      : `background-color:#f5f5f5`
                  "
                >
                  <span class="mr-3">
                    {{
                      leftWord === null || leftWord.words === null
                        ? null
                        : leftWord.idChunkGroup !== 0
                        ? corpusData
                            .filter(
                              (data) =>
                                data.idChunkGroup === leftWord.idChunkGroup
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
                    rightWord !== null && rightWord.chunk !== null
                      ? `background-color:${rightWord.chunk.color}`
                      : `background-color:#f5f5f5`
                  "
                >
                  <span>{{
                    rightWord === null || rightWord.words === null
                      ? null
                      : rightWord.idChunkGroup !== 0
                      ? corpusData
                          .filter(
                            (data) =>
                              data.idChunkGroup === rightWord.idChunkGroup
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
                  variant="success"
                  class="drop-shadow"
                  pill
                  @click="saveRelation"
                  >Select Relation</b-button
                >
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
                v-for="(corpusRelation, index) in corpusesRelation"
                :key="index"
                class="mr-1"
              >
                <b-tooltip :target="`corpusRelation-${index}`"
                  >PosTag : {{ corpusRelation.postag }} <br />
                  Chunk :
                  {{
                    corpusRelation.chunk !== null
                      ? corpusRelation.chunk.code
                      : null
                  }}
                  <br />
                  Relation :
                  {{
                    corpusRelation.relation !== null
                      ? corpusRelation.relation.code
                      : null
                  }}
                  <br />
                  Related To :
                  {{
                    corpusRelation.relatedTo !== null
                      ? corpusRelation.relatedTo
                          .map((data) => data.words)
                          .join(' ')
                      : null
                  }}
                  <br />
                  Related By :
                  {{
                    corpusRelation.relatedBy !== null
                      ? corpusRelation.relatedBy
                          .map((data) => data.words)
                          .join(' ')
                      : null
                  }}
                </b-tooltip>
                <b-badge
                  :id="`corpusRelation-${index}`"
                  pill
                  class="hand-pointing mt-1"
                  :style="
                    corpusRelation.chunk !== null
                      ? `background-color:${corpusRelation.chunk.color}`
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
            </b-card-body>
          </b-card>
        </b-col>
      </b-row>
    </div>

    <div class="mt-2">
      <relation-table
        v-if="corpusesRelation.length > 0"
        ref="relation"
        :data-table="corpusesRelation"
        :is-resume="false"
      />
    </div>
  </div>
</template>

<script>
import RelationTable from '@/components/cyberquote/table/Relation-Table.vue'
import Loading from 'vue-loading-overlay'
export default {
  components: { RelationTable, Loading },
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
    this.isFetched = true
    this.isLoading = false
  },
  methods: {
    backDashboard() {
      this.$emit('backDashboard')
    },
    syncData(data) {
      this.corpusesRelation = data
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
      if (this.corpusData[0].idChunkGroup !== undefined) {
        return this.corpusData
      }
      const resCorpusRelation = await this.$axios.$get(
        `/corpus/${this.litigation.litigation_id}/relation`,
        {
          headers: {
            Authorization: this.$auth.strategy.token.get(),
          },
        }
      )
      return resCorpusRelation.data
    },
    selectRelation(item) {
      if (this.isLeft) {
        if (item.relatedTo !== null) {
          this.dismissCountDown = this.dismissSecs
          this.errorMessage = `This word has relation, please remove the relation on table below`
          this.variant = 'danger'
          return
        }
        if (item === this.rightWord) {
          this.dismissCountDown = this.dismissSecs
          this.errorMessage = `Can't have relation with same corpus`
          this.variant = 'danger'
          return
        }
        this.leftWord = item
      } else {
        if (item.relatedBy !== null) {
          this.dismissCountDown = this.dismissSecs
          this.errorMessage = `This word has relation, please remove the relation on table below`
          this.variant = 'danger'
          return
        }
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
    back() {
      this.$emit('backProcess', this.corpusesRelation)
    },
    nextProcess() {
      this.$emit('nextProcess', this.corpusesRelation)
    },
    saveRelation() {
      if (
        this.leftWord !== null &&
        this.rightWord !== null &&
        this.selectedRelation !== '-1'
      ) {
        this.indexRelation++
        let leftWords = []
        let rightWords = []
        leftWords.push(this.leftWord)
        rightWords.push(this.rightWord)
        if (this.leftWord.idChunkGroup !== 0)
          leftWords = this.corpusesRelation.filter(
            (data) => data.idChunkGroup === this.leftWord.idChunkGroup
          )
        if (this.rightWord.idChunkGroup !== 0)
          rightWords = this.corpusesRelation.filter(
            (data) => data.idChunkGroup === this.rightWord.idChunkGroup
          )

        // if (this.leftWord.idChunkGroup !== 0)
        leftWords.forEach((data) => {
          data.relatedTo = rightWords
          data.idRelation = this.indexRelation
          data.relation = this.selectedRelation
        })
        // else
        rightWords.forEach((data) => {
          data.relatedBy = leftWords
          data.idRelation = this.indexRelation
          data.relation = this.selectedRelation
        })
        this.$refs.relation.syncData()
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
