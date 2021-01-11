<template type="x-template" id="riders-component">
  <div>
    <p class="subheader">Dispatch Riders on Jumga</p>

    <b-tabs v-model="activeTab" vertical type="is-boxed">
      <b-tab-item>
        <template #header>
          <b-icon icon="information-outline"></b-icon>
          <span>
            Dispatch Riders <b-tag rounded> {{ riders.length }} </b-tag>
          </span>
        </template>

        <b-table
          v-if="riders.length"
          :data="riders"
          :columns="columns"
        ></b-table>
        <div v-else class="notification is-light">
          No Dispatch Riders yet<br />
          <b-button @click="activeTab = 1"> New </b-button>
        </div>
      </b-tab-item>
      <b-tab-item>
        <template #header>
          <b-icon icon="source-pull"></b-icon>
          <span> Add Dispatch Rider </span>
        </template>

        <div class="p-3">
          <b-field label="Firstname">
            <b-input v-model="rider_form.firstname" required></b-input>
          </b-field>

          <b-field label="Lastname">
            <b-input v-model="rider_form.lastname" required></b-input>
          </b-field>

          <b-field label="Phonenumber">
            <b-input v-model="rider_form.phonenumber" required></b-input>
          </b-field>

          <b-field label="Account Number">
            <b-input v-model="rider_form.account_number" required></b-input>
          </b-field>

          <b-field label="Account Name">
            <b-input v-model="rider_form.account_name" required></b-input>
          </b-field>

          <b-field label="Bank">
            <b-input v-model="rider_form.bank" required></b-input>
          </b-field>

          <b-field label="Country">
            <b-input v-model="rider_form.country" required></b-input>
          </b-field>

          <b-field label="Bio">
            <b-input
              v-model="rider_form.bio"
              maxlength="200"
              type="textarea"
              required
            ></b-input>
          </b-field>

          <!-- submit button -->
          <b-button :loading="loading" class="is-success" @click="addRider()"
            >Add</b-button
          >
        </div>
      </b-tab-item>
    </b-tabs>

    <b-loading
      :is-full-page="true"
      v-model="loading"
      :can-cancel="true"
    ></b-loading>
  </div>
</template>
