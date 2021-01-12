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

        <div class="columns" v-if="selected_rider">
          <div class="column is-12">
            <b-field>
              <b-button
                label="Clear selected"
                type="is-danger"
                icon-left="close"
                :disabled="!selected_rider"
                @click="selected_rider = null"
              />
            </b-field>

            <div class="field has-addons right" v-show="selected_rider">
              <p class="control">
                <button class="button" @click="goToAddAccount">
                  <span>Add Account</span>
                </button>
              </p>
              <p
                class="control"
                v-if="
                  !selected_rider.employed &&
                  selected_rider.account.subaccount_id
                "
              >
                <button class="button" @click="assignToShop()">
                  <span>Assign To Shop</span>
                </button>
              </p>
              <p class="control">
                <button class="button">
                  <span>Delete</span>
                </button>
              </p>
            </div>
          </div>
        </div>

        <b-table
          v-if="riders.length"
          :data="riders"
          :columns="columns"
          :selected.sync="selected_rider"
          focusable
          striped
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

      <b-tab-item v-if="selected_rider">
        <template #header>
          <b-icon icon="source-pull"></b-icon>
          <span> Add Subaccount </span>
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
            <b-input
              v-model="rider_form.account.account_number"
              required
            ></b-input>
          </b-field>

          <b-field label="Account Name">
            <b-input
              v-model="rider_form.account.account_name"
              required
            ></b-input>
          </b-field>

          <b-field label="Bank">
            <b-input v-model="rider_form.account.bank" required></b-input>
          </b-field>

          <b-field label="Country">
            <b-input v-model="rider_form.account.country" required></b-input>
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
          <b-button
            :loading="loading"
            class="is-info"
            @click="addRiderAccount()"
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
