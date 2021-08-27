<template>
  <div>
    <b-card>
      <b-card-body>
        <div class="d-flex justify-content-between">
          <div class="d-flex">
            <b-button
              class="btn-gradient btn-rounded drop-shadow"
              :disabled="isLoadingFinal"
              @click="backDashboard"
            >
              <i class="fas fa-home"></i>
            </b-button>
            <div class="font-weight-bold font-20 font-primary ml-2">Resume</div>
          </div>
          <div v-if="!isFinal">
            <b-button
              variant="outline-primary"
              pill
              class="mr-2 drop-shadow"
              :disabled="isLoadingFinal"
              @click="backProcess"
              >Back</b-button
            >
            <b-button
              class="btn-gradient btn-rounded drop-shadow"
              :disabled="isLoadingFinal"
              @click="final"
              >Finalize</b-button
            >
          </div>
        </div>
        <div class="mt-3">
          <b-alert
            :show="dismissCountDown"
            dismissible
            fade
            :variant="variant"
            @dismiss-count-down="countDownChanged"
          >
            {{ errorMessage }}
          </b-alert>
          <Skeleton :loading="isLoadingFinal" class="mt-2" />
          <Skeleton :loading="isLoadingFinal" class="mt-1" />
          <b-tabs
            nav-class="nav-tabs nav-bordered sub-heading-strong"
            active-nav-item-class="text-primary"
            content-class="py-3 pl-2 pr-3"
          >
            <b-tab title="Pos Tag" active>
              <pos-tag-table
                v-if="corpusesTag !== null"
                :data-table="corpusesTag"
              />
            </b-tab>
            <b-tab title="Chunk">
              <chunk-table
                v-if="corpusesChunk !== null"
                :data-table="corpusesChunk"
              />
            </b-tab>
            <b-tab title="Relation">
              <relation-table
                v-if="isFinishSync"
                ref="relation"
                :data-table="relationList"
                :data-chunk="corpusesChunk"
                :is-resume="true"
              />
            </b-tab>
          </b-tabs>
        </div>
      </b-card-body>
    </b-card>

    <!-- <relation-table
          v-if="isFinishSync"
          :data-table="corpusesRelation"
          :is-resume="true"
        /> -->
    <b-modal
      id="modal-confirm"
      body-class="p-4"
      hide-header
      hide-footer
      centered
      content-class="bg-white"
      size="sm"
    >
      <confirmation
        message="Are you sure you want to finalize this litigation ?"
        @cancelModal="cancelModal"
        @confirmation="confirmation"
      />
    </b-modal>
    <b-modal
      id="modalThank"
      centered
      size="sm"
      class="p-0"
      :no-close-on-backdrop="true"
      :hide-footer="true"
      :hide-header="true"
    >
      <thank-you @closeModal="closeModal" />
    </b-modal>
  </div>
</template>

<script>
import PosTagTable from '@/components/cyberquote/table/Pos-Tag-Table.vue'
import ChunkTable from '@/components/cyberquote/table/Chunk-Table.vue'
import RelationTable from '@/components/cyberquote/table/Relation-Table.vue'
import Confirmation from '@/components/cyberquote/alert/Confirmation'
import ThankYou from '@/components/cyberquote/alert/Thank-You'
import { Skeleton } from 'vue-loading-skeleton'
export default {
  components: {
    PosTagTable,
    ChunkTable,
    RelationTable,
    Confirmation,
    Skeleton,
    ThankYou,
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
    isFinal: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      corpusesTag: null,
      corpusesChunk: null,
      corpusesRelation: null,
      relations: null,
      isFinishSync: false,
      indexRelation: 0,
      relationList: [],
      errorMessage: null,
      dismissSecs: 3,
      dismissCountDown: 0,
      isLoadingFinal: false,
    }
  },
  async mounted() {
    this.isFinishSync = false
    this.corpusesTag = await this.fetchCorpusTag()
    this.corpusesChunk = await this.fetchCorpusChunk()
    this.relations = await this.fetchRelations()
    this.corpusesRelation = await this.fetchCorpusRelation()
    // this.syncRelatedTo()
    this.isFinishSync = true
  },
  methods: {
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    },
    async fetchCorpusTag() {
      try {
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

        return resCorpusWords.data
      } catch (error) {
        this.dismissCountDown = this.dismissSecs
        this.errorMessage = error.response.data
        this.variant = 'danger'
      }
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

        return resCorpusWords.data
      } catch (error) {
        this.dismissCountDown = this.dismissSecs
        this.errorMessage = error.response.data
        this.variant = 'danger'
      }
    },
    async fetchRelations() {
      try {
        const resRelations = await this.$axios.$get(`/master/relation/all`, {
          headers: {
            Authorization: this.$auth.strategy.token.get(),
          },
        })
        return resRelations.data
      } catch (error) {
        this.dismissCountDown = this.dismissSecs
        this.errorMessage = error.response.data
        this.variant = 'danger'
      }
    },
    backDashboard() {
      this.$emit('backDashboard')
    },
    final() {
      this.$root.$emit('bv::show::modal', 'modal-confirm')
    },
    backProcess() {
      this.$emit('backProcess', this.corpusData)
    },
    async confirmation() {
      this.$root.$emit('bv::hide::modal', 'modal-confirm')
      this.isLoadingFinal = true
      try {
        await this.$axios.$post(
          `/litigation/${this.litigation.litigation_id}/final`,
          {
            headers: {
              Authorization: this.$auth.strategy.token.get(),
            },
          }
        )
        this.$root.$emit('bv::show::modal', 'modalThank')
      } catch (error) {
        this.dismissCountDown = this.dismissSecs
        this.errorMessage = error.response.data
        this.variant = 'danger'
      }
      this.isLoadingFinal = false
    },
    cancelModal() {
      this.$root.$emit('bv::hide::modal', 'modal-confirm')
    },
    closeModal() {
      this.$root.$emit('bv::hide::modal', 'modalThank')
      this.$emit('backDashboard')
    },
  },
}
</script>

<style lang="scss" scoped>
.drop-shadow {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
}
</style>
