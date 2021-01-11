<template type="x-template" id="categories-component">
  <div>
    <b-tabs v-model="activeTab" vertical type="is-boxed">
      <b-tab-item>
        <template #header>
          <b-icon icon="information-outline"></b-icon>
          <span>
            Categories <b-tag rounded> {{ categories.length }} </b-tag>
          </span>
        </template>

        <b-table
          v-if="categories.length"
          :data="categories"
          :columns="columns"
        ></b-table>

        <div v-else class="notification is-light">
          No Categories yet
          <br />
          <b-button @click="activeTab = 1"> New </b-button>
        </div>
      </b-tab-item>
      <b-tab-item>
        <template #header>
          <b-icon icon="source-pull"></b-icon>
          <span> Add Category </span>
        </template>
        <!-- form -->
        <b-field label="Name">
          <b-input
            v-model="category_form.name"
            placeholder="Tech"
            required
          ></b-input>
        </b-field>

        <b-field label="Item Name (Singular)">
          <b-input
            v-model="category_form.item_name_singular"
            placeholder="Device"
            required
          ></b-input>
        </b-field>

        <b-field label="Item Name (Plural)">
          <b-input
            v-model="category_form.item_name_plural"
            placeholder="Devices"
            required
          ></b-input>
        </b-field>

        <!-- submit button -->
        <b-button :loading="loading" class="is-success" @click="addCategory()"
          >Add</b-button
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
