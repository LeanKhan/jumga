<template type="x-template" id="shop-dashboard-component">
  <section>
    <b-tabs v-model="activeTab">
      <b-tab-item label="Products">
        <!-- list of products thank you Jesus -->
        <products-table></products-table>
      </b-tab-item>

      <b-tab-item label="Add Product!!!">
        <span>HIII</span>
        <b-field label="Name">
          <b-input v-model="product_form.name"></b-input>
        </b-field>

        <b-field label="Category">
          <b-input v-model="product_form.category"></b-input>
        </b-field>

        <b-field label="Message">
          <b-input
            v-model="product_form.category"
            maxlength="200"
            type="textarea"
          ></b-input>
        </b-field>

        <b-field label="Tags">
          <b-taginput
            v-model="product_form.tags"
            ellipsis
            icon="label"
            placeholder="Add a tag"
            aria-close-label="Delete this tag"
          >
          </b-taginput>
        </b-field>
      </b-tab-item>
    </b-tabs>
  </section>
</template>
