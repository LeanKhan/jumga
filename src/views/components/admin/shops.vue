<template type="x-template" id="shops-component">
  <div>
    <b-tabs v-model="activeTab" vertical type="is-boxed">
      <b-tab-item>
        <template #header>
          <b-icon icon="information-outline"></b-icon>
          <span>
            Shops <b-tag rounded> {{ shops.length }} </b-tag>
          </span>
        </template>

        <article class="panel is-shadowless is-dark has-text-white">
          <div class="panel-heading">
            <span class="brand-title">Shops</span>
          </div>
          <div class="panel-block" style="display: inherit !important">
            <div class="columns">
              <div class="column is-3">
                <b-field>
                  <b-button
                    label="Clear selected"
                    class="is-outlined"
                    type="is-danger"
                    :disabled="!selected_shop"
                    @click="selected_shop = null"
                  />
                </b-field>
              </div>
            </div>

            <b-table
              v-if="shops.length"
              :data="shops"
              :selected.sync="selected_shop"
              striped
            >
              <b-table-column field="name" label="Name" v-slot="props">
                {{ props.row.name }}
              </b-table-column>

              <b-table-column field="category" label="Category" v-slot="props">
                {{ props.row.category }}
              </b-table-column>

              <b-table-column field="country" label="Country" v-slot="props">
                {{ props.row.country }}
              </b-table-column>

              <b-table-column
                field="isApproved"
                label="Approved?"
                v-slot="props"
              >
                {{ props.row.isApproved }}
              </b-table-column>

              <b-table-column
                field="hasPaidFee"
                label="Has Paid Fee?"
                v-slot="props"
              >
                {{ props.row.hasPaidFee }}
              </b-table-column>

              <b-table-column field="isLive" label="Live?" v-slot="props">
                {{ props.row.isLive }}
              </b-table-column>

              <b-table-column label="Products" v-slot="props">
                {{ props.row.products.length }}
              </b-table-column>

              <b-table-column field="actions" v-slot="props">
                <a
                  class="button is-small is-outlined is-dark"
                  :href="`/${props.row.slug}`"
                  >view</a
                >
                <button
                  class="button is-small is-outlined is-danger"
                  @click="deleteShop"
                >
                  delete
                </button>
              </b-table-column>
            </b-table>

            <div v-else class="notification is-light">No Shops yet <br /></div>
          </div>
        </article>
      </b-tab-item>
    </b-tabs>

    <b-loading
      :is-full-page="true"
      v-model="loading"
      :can-cancel="true"
    ></b-loading>
  </div>
</template>
