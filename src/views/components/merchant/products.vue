<template type="x-template" id="products-component">
  <div>
    <b-table :data="products" :columns="columns"></b-table>

    <!-- add product -->
    <b-collapse
      aria-id="addRiderContent"
      class="panel"
      animation="slide"
      v-model="isOpen"
    >
      <template #trigger>
        <div
          class="panel-heading"
          role="button"
          aria-controls="addRiderContent"
        >
          <strong>Add Rider</strong>
        </div>
      </template>

      <div class="p-3">
        <b-field label="Name">
          <b-input v-model="product_form.name" required></b-input>
        </b-field>

        <b-field label="Category">
          <b-input v-model="product_form.category" required></b-input>
        </b-field>

        <b-field label="Price">
          <b-input v-model="product_form.price" required></b-input>
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
            icon="label"
            placeholder="Add a tag"
            aria-close-label="Delete this tag"
          >
          </b-taginput>
        </b-field>

        <!-- submit button -->
        <b-button type="success" class="is-success" @click="addProduct()"
          >Create</b-button
        >
      </div>
    </b-collapse>

    <b-loading
      :is-full-page="true"
      v-model="loading"
      :can-cancel="true"
    ></b-loading>
  </div>
</template>
