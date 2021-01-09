<template type="x-template" id="riders-component">
  <div>
    <b-table :data="riders" :columns="columns"></b-table>

    <!-- Add Rider Panel! -->
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
        <b-button :loading="loading" type="success" @click="addRider()"
          >Add</b-button
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
