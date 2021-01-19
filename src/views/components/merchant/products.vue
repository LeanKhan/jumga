<template type="x-template" id="products-component">
  <div>
    <b-tabs v-model="activeTab" vertical type="is-boxed">
      <b-tab-item>
        <template #header>
          <b-icon icon="information-outline"></b-icon>
          <span>
            Products <b-tag rounded> {{ products.length }} </b-tag>
          </span>
        </template>

        <article class="panel is-shadowless is-light">
          <div class="panel-heading">
            <span class="brand-title">Products</span>
            <div class="is-pulled-right">
              <button
                class="button is-small is-success"
                @click="goToAddProduct()"
              >
                New
              </button>

              <button
                class="button is-small is-outlined has-text-dark is-success is-rounded"
                @click="showModal = true"
              >
                Batch Upload
              </button>
            </div>
          </div>
          <div class="panel-block" style="display: inherit !important">
            <div class="columns">
              <div class="column is-3">
                <b-field>
                  <b-button
                    label="Clear selected"
                    class="is-outlined is-danger"
                    :disabled="!selected_product"
                    @click="selected_product = null"
                  />
                </b-field>
              </div>

              <div class="column is-9" v-if="selected_product">
                <div class="field has-addons is-justify-content-flex-end">
                  <p class="control">
                    <button class="button" @click="goToUpdateProduct()">
                      <span>Edit</span>
                    </button>
                  </p>

                  <p class="control">
                    <a
                      class="button"
                      :href="`/${shop_slug}/products/${selected_product.slug}`"
                    >
                      <span>View</span>
                    </a>
                  </p>

                  <p class="control">
                    <button class="button is-danger" @click="deleteProduct()">
                      <span>Delete</span>
                    </button>
                  </p>
                </div>
              </div>
            </div>

            <b-table
              v-if="products.length"
              :data="products"
              :selected.sync="selected_product"
              striped
            >
              <b-table-column field="name" label="Name" v-slot="props">
                {{ props.row.name }}
              </b-table-column>

              <b-table-column field="price" label="Price" v-slot="props">
                USD{{ props.row.price }}
              </b-table-column>

              <b-table-column field="category" label="Category" v-slot="props">
                {{ props.row.category }}
              </b-table-column>

              <!-- <b-table-column field="actions" v-slot="props">
                <a @click="viewProduct()">view</a>
                <b-button
                  type="is-danger"
                  @click="deleteProduct(props.row.slug)"
                  >delete</b-button
                >
              </b-table-column> -->
            </b-table>
            <div v-else class="notification is-light">
              You don't have any Products yet. <br />
              <b-button @click="activeTab = 1"> New </b-button>
            </div>
          </div>
        </article>
      </b-tab-item>
      <b-tab-item>
        <template #header>
          <b-icon icon="source-pull"></b-icon>
          <span> {{ update ? 'Update' : 'Add' }} Product </span>
        </template>

        <b-field label="Name" message="Name of your product">
          <b-input v-model="product_form.name" required></b-input>
        </b-field>

        <!-- TODO: show local price here... thank you Jesus! -->

        <b-field label="Price" message="Price must be the Dollar price">
          <b-field>
            <p class="control" v-if="country">
              <span class="button is-static">
                {{ country.currency_code }} {{ convertedCurrency }}
              </span>
            </p>
            <b-numberinput
              class="has-text-left"
              step="10"
              expanded
              controls-position="compact"
              v-model="product_form.price"
              required
              controls-alignment="right"
            />
          </b-field>
        </b-field>

        <b-field label="Picture">
          <b-input v-model="product_form.picture" required></b-input>
        </b-field>

        <b-field label="Description">
          <b-input
            v-model="product_form.description"
            maxlength="200"
            type="textarea"
            required
          ></b-input>
        </b-field>

        <b-field label="Tags">
          <b-taginput
            v-model="product_form.tags"
            ellipsis
            placeholder="Add a tag"
            aria-close-label="Delete this tag"
          >
          </b-taginput>
        </b-field>

        <!-- submit button -->
        <b-button
          :loading="loading"
          class="is-success"
          @click="update ? updateProduct() : addProduct()"
          >{{ update ? 'Update' : 'Add' }}</b-button
        >

        <b-button
          :loading="loading"
          class="is-outlined is-danger"
          @click="cancel()"
          >Cancel</b-button
        >
      </b-tab-item>
    </b-tabs>

    <!-- MODAL -->
    <modal v-if="showModal" @close="showModal = false">
      <!--
      you can use custom content here to overwrite
      default content
    -->
      <h3 slot="header">Upload .csv File containing Products</h3>

      <div slot="body">
          <div class="columns has-text-centered is-multiline">
            <div class="column is-notification">
              <span class="tag">.csv</span> file should have these headings. Picture is a link to the product's picture, tags is separated by comma
              <p>
                <table style="width: 100%">
                  <tr style="border: 1px solid green;">
                    <td style="border: 1px solid green;">
                      name
                    </td>
                    <td style="border: 1px solid green;">
                      price
                    </td>
                    <td style="border: 1px solid green;">
                      picture
                    </td>
                    <td style="border: 1px solid green;">
                      description
                    </td>
                    <td style="border: 1px solid green;">
                      tags
                    </td>
                  </tr>
                </table>
              </p>
              <p>You can use a Spreadsheet to make the table then export to CSV, comma separated o</p>
            </div>
            <div class="column is-12 is-centered">
              <div
          
        >
          <label for="csv">CSV File</label>
          <br />
          <b-field>
            <b-upload v-model="file" accept=".csv" drag-drop>
              <section class="section">
                <div class="content has-text-centered">
                  <p>
                    <img
                      src="https://icongr.am/feather/upload.svg?size=25&color=000"
                    />
                  </p>
                  <p>Drop your file here or click to upload</p>
                </div>
              </section>
            </b-upload>
          </b-field>

          <span v-if="file" :class="{ 'has-name': !!file }">
            {{ file.name }}
          </span>
          <button
            v-if="file"
                                v-bind:class="{'is-loading': loading}"
            class="button is-primary custom-input-submit"
            @click="submitBatchUpload()"
          > Upload </button>
        </div>
            </div>
          </div>
      </div>

      <div slot="footer">
        <div>
          <div>
            <button
              class="button is-dark"
              @click="
                showModal = false;
                file = null;
              "
            >
              CANCEL
            </button>
          </div>
        </div>
      </div>
    </modal>
    <!-- MODAL -->

    <b-loading
      :is-full-page="true"
      v-model="loading"
      :can-cancel="true"
    ></b-loading>
  </div>
</template>
