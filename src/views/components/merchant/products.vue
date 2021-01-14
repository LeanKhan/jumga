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

        <b-table
          v-if="products.length"
          :data="products"
          :columns="columns"
        ></b-table>
        <div v-else class="notification is-light">
          You don't have any Products yet. <br />
          <b-button @click="activeTab = 1"> New </b-button>
        </div>
      </b-tab-item>
      <b-tab-item>
        <template #header>
          <b-icon icon="source-pull"></b-icon>
          <span> Add Product </span>
        </template>

        <b-field label="Name">
          <b-input v-model="product_form.name" required></b-input>
        </b-field>

        <b-field label="Category">
          <b-input v-model="product_form.category" required></b-input>
        </b-field>

        <b-field label="Price">
          <b-input v-model="product_form.price" required></b-input>
          <p>Must be in USD</p>
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
        <b-button type="success" class="is-success" @click="addProduct()"
          >Create</b-button
        >
      </b-tab-item>
    </b-tabs>

    <b-loading
      :is-full-page="true"
      v-model="loading"
      :can-cancel="true"
    ></b-loading>
  </div>
</template>
