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

        <article class="panel is-shadowless is-primary">
          <div class="panel-heading">
            <span>All Shop Categories</span>
            <span>
              <button
                class="button is-pulled-right is-small is-success"
                @click="goToAddCategory()"
              >
                New
              </button>
            </span>
          </div>
          <div class="panel-block" style="display: inherit !important">
            <div class="columns">
              <div class="column is-3">
                <b-field>
                  <b-button
                    label="Clear selected"
                    class="is-outlined"
                    type="is-danger"
                    :disabled="!selected_category"
                    @click="selected_category = null"
                  />
                </b-field>
              </div>

              <div class="column is-9" v-if="selected_category">
                <div class="field has-addons is-justify-content-flex-end">
                  <p class="control">
                    <button class="button" @click="goToUpdateCategory()">
                      <span>Edit</span>
                    </button>
                  </p>
                </div>
              </div>
            </div>

            <!-- Categories Table -->
            <b-table
              v-if="categories.length"
              :data="categories"
              :columns="columns"
              :selected.sync="selected_category"
              striped
            ></b-table>

            <div v-else class="notification is-light">
              No Categories yet
              <br />
              <b-button @click="goToAddCategory()"> New </b-button>
            </div>
          </div>
        </article>
      </b-tab-item>
      <b-tab-item>
        <template #header>
          <b-icon icon="source-pull"></b-icon>
          <span> {{ update ? 'Update' : 'Add' }} Category </span>
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
        <b-button
          :loading="loading"
          class="is-success"
          @click="update ? updateCategory() : addCategory()"
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

    <b-loading
      :is-full-page="true"
      v-model="loading"
      :can-cancel="true"
    ></b-loading>
  </div>
</template>
