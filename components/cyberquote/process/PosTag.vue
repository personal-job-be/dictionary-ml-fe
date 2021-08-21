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
              PosTag Process
            </div>
          </div>
          <b-button
            class="btn-gradient btn-rounded drop-shadow"
            @click="nextProcess"
            >Next</b-button
          >
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
            content-class="py-3 pl-2 pr-3 "
          >
            <b-tab title="Pos Tag" active>
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

              <select v-model="selectedPos" class="form-control">
                <option value="-1" disabled>Please Select One</option>
                <option
                  v-for="(posTag, index) in posTags"
                  :key="index"
                  :value="posTag"
                >
                  {{ posTag.code }}
                </option>
              </select>
              <!-- list of selected words -->
              <span v-for="(selectedWord, index) in selectedWords" :key="index">
                <b-badge class="un-pos-tag ml-2 p-1 mt-1 text-primary" pill
                  ><span class="font-12">
                    {{ selectedWord.words }}
                  </span>
                  <i
                    class="fe-trash-2 font-weight-bold font-12 p-1"
                    style="cursor: pointer"
                    @click="removeSelected(selectedWord)"
                  />
                </b-badge>
              </span>
              <div class="d-flex justify-content-end mt-2">
                <b-button
                  variant="outline-primary"
                  pill
                  class="mr-2 drop-shadow"
                  @click="clearTag"
                  >Clear</b-button
                >
                <b-button
                  class="drop-shadow btn-gradient"
                  pill
                  @click="selectTag"
                  >Select tag</b-button
                >
              </div>
              <hr />
              <div class="sub-heading-strong mt-4 text-primary">Corpus</div>
              <span v-for="(corpusTag, index) in corpusesTag" :key="index">
                <b-tooltip :target="`corpusTag-${index}`"
                  >Pos Tag : {{ corpusTag.postag }}</b-tooltip
                >
                <b-badge
                  :id="`corpusTag-${index}`"
                  :class="[
                    corpusTag.postag !== null ? 'pos-tagged' : 'un-pos-tag  ',
                    'mr-2 p-1 mt-1 text-primary hand-cursor',
                  ]"
                  pill
                  ><span class="font-12" @click="selectWord(corpusTag)">
                    {{ corpusTag.words }}
                  </span>
                  <i
                    v-if="corpusTag.postag !== null"
                    class="fe-trash-2 font-weight-bold font-12 p-1"
                    @click="removeTag(corpusTag)"
                  />
                </b-badge>
              </span>
            </b-tab>
            <b-tab title="Result">
              <pos-tag-table ref="tagTable" :data-table="corpusesTag" />
            </b-tab>
          </b-tabs>
        </div>
      </b-card-body>
    </b-card>
    <!-- tags list -->
    <!-- <b-row>
          <b-col>
            <b-card title="Selected Words">
              <b-card-body> </b-card-body>
            </b-card>
          </b-col>
        </b-row> -->
    <!-- corpus -->
    <!-- <b-row>
          <b-col>
            <b-card title="Corpus">
              <b-card-body> </b-card-body>
            </b-card>
          </b-col>
        </b-row> -->
    <!-- table -->
    <!-- <b-row class="mt-2">
          <b-col> </b-col>
        </b-row> -->
  </div>
</template>

<script>
import Loading from 'vue-loading-overlay'
import PosTagTable from '@/components/cyberquote/table/Pos-Tag-Table.vue'
export default {
  components: {
    Loading,
    PosTagTable,
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
      isFetched: false,
      posTags: null,
      selectedPos: '-1',
      corpusesTag: null,
      isLoading: false,
      selectedWords: [],
      isModified: false,
      // alert
      errorMessage: null,
      dismissSecs: 3,
      dismissCountDown: 0,
      variant: null,
    }
  },
  async mounted() {
    try {
      this.isFetched = false
      this.isLoading = true
      this.isModified = false
      this.posTags = await this.fetchPosTag()
      this.corpusesTag = await this.fetchCorpusTag()
      this.isFetched = true
      this.isLoading = false
    } catch (error) {
      this.isLoading = false
    }
  },
  methods: {
    async fetchPosTag() {
      const resPosTag = await this.$axios.$get(`/master/postag/all`, {
        headers: {
          Authorization: this.$auth.strategy.token.get(),
        },
      })
      return resPosTag.data
    },
    async fetchCorpusTag() {
      // temporary waiting for API
      if (this.corpusData === null) {
        const resCorpusWords = await this.$axios.$get(
          `/corpus/${this.litigation.litigation_id}/words`,
          {
            headers: {
              Authorization: this.$auth.strategy.token.get(),
            },
          }
        )
        const resCorpusTag = await this.$axios.$get(
          `/corpus/${this.litigation.litigation_id}/postag`,
          {
            headers: {
              Authorization: this.$auth.strategy.token.get(),
            },
          }
        )
        resCorpusWords.data.forEach((data) => {
          let resFilterTag = resCorpusTag.data.filter(
            (corpusTag) => corpusTag.corpus_index === data.corpus_index
          )
          if (resFilterTag.length > 0) {
            resFilterTag = resFilterTag.reduce((corpusTag) => corpusTag)
            data.postag_id = resFilterTag.postag_id
            data.postag = resFilterTag.postag
          } else {
            data.postag_id = null
            data.postag = null
          }
        })
        return resCorpusWords.data
      }
      return this.corpusData
    },
    selectTag() {
      if (this.selectedWords.length > 0 && this.selectedPos !== '-1') {
        this.selectedWords.forEach((data) => {
          data.postag = this.selectedPos.code
          data.postag_id = this.selectedPos.id
        })
        this.isModified = true
        this.clearTag()
        this.$refs.tagTable.syncData()
      } else if (this.selectedWords.length === 0) {
        this.dismissCountDown = this.dismissSecs
        this.errorMessage = `Please select a word`
        this.variant = 'danger'
      } else if (this.selectedPos === '-1') {
        this.dismissCountDown = this.dismissSecs
        this.errorMessage = `Please select a tag`
        this.variant = 'danger'
      }
    },
    backDashboard() {
      this.$emit('backDashboard')
    },
    selectWord(word) {
      const index = this.selectedWords.indexOf(word)
      if (index >= 0) {
        this.dismissCountDown = this.dismissSecs
        this.errorMessage = `Word already selected`
        this.variant = 'danger'
        return
      }
      this.selectedWords.push(word)
    },
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    },
    removeTag(word) {
      word.postag = null
      word.postag_id = null
      this.$refs.tagTable.syncData()
    },
    removeSelected(word) {
      const index = this.selectedWords.indexOf(word)
      this.selectedWords.splice(index, 1)
    },
    clearTag() {
      this.selectedWords = []
    },
    async nextProcess() {
      const valid = this.corpusesTag.filter((data) => data.postag === null)
      if (valid.length > 0) {
        this.dismissCountDown = this.dismissSecs
        this.errorMessage = `Please finish your tagging process`
        this.variant = 'danger'
        return
      }
      if (this.isModified) {
        const resUniquePosTagId = this.corpusesTag
          .reduce((unique, o) => {
            if (!unique.some((obj) => obj.postag_id === o.postag_id)) {
              unique.push(o)
            }
            return unique
          }, [])
          .map((data) => data.postag_id)

        const resultTagging = []
        resUniquePosTagId.forEach((data) => {
          const singlePosTag = {
            postag_id: data,
            corpus_index: this.corpusesTag
              .filter((corpus) => corpus.postag_id === data)
              .map((corpus) => corpus.corpus_index),
          }
          resultTagging.push(singlePosTag)
        })

        try {
          await this.$axios.$post(
            `/corpus/${this.litigation.litigation_id}/postag`,
            {
              data: resultTagging,
            },
            {
              headers: {
                Authorization: this.$auth.strategy.token.get(),
              },
            }
          )
          this.dismissCountDown = this.dismissSecs
          this.errorMessage = 'Postag Words saved'
          this.variant = 'success'
        } catch (error) {
          this.dismissCountDown = this.dismissSecs
          this.errorMessage = error.response.data
          this.variant = 'danger'
        }
      }
      this.$emit('nextProcess', this.corpusesTag)
      // const valid = this.corpusesTag.filter((data) => data.postag === null)
      // if (valid.length > 0) {
      //   this.dismissCountDown = this.dismissSecs
      //   this.errorMessage = `Please finish your tagging process`
      //   this.variant = 'danger'
      //   return
      // }
      // this.$emit('nextProcess', this.corpusesTag)
    },
  },
}
</script>

<style lang="scss" scoped>
.un-pos-tag {
  background-color: #f5f5f5;
}
.pos-tagged {
  background-color: #ffe08a;
}
.hand-cursor {
  cursor: pointer;
}
.drop-shadow {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
}
</style>
