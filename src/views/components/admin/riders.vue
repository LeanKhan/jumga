<template type="x-template" id="riders-component">
  <div>
    <b-tabs v-model="activeTab" vertical type="is-boxed">
      <b-tab-item class="pt-0">
        <template #header>
          <b-icon icon="information-outline"></b-icon>
          <span>
            Dispatch Riders <b-tag rounded> {{ riders.length }} </b-tag>
          </span>
        </template>

        <article class="panel is-shadowless is-primary">
          <div class="panel-heading">
            <span>Dispatch Riders</span>
            <span>
              <button
                class="button is-pulled-right is-small is-success"
                @click="goToAddRider()"
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
                    :disabled="!selected_rider"
                    @click="selected_rider = null"
                  />
                </b-field>
              </div>

              <div class="column is-9" v-if="selected_rider">
                <div
                  class="field has-addons is-justify-content-flex-end"
                  v-show="selected_rider"
                >
                  <p
                    class="control"
                    v-if="!selected_rider.account.subaccount_id"
                  >
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
                    <button class="button" @click="goToUpdateRider()">
                      <span>Edit</span>
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
              striped
            ></b-table>
            <div v-else class="notification is-light">
              No Dispatch Riders yet<br />
              <b-button @click="activeTab = 1"> New </b-button>
            </div>
          </div>
        </article>
      </b-tab-item>
      <b-tab-item>
        <template #header>
          <b-icon icon="source-pull"></b-icon>
          <span> {{ update ? 'Update' : 'Add' }} Dispatch Rider </span>
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
          <b-button
            :loading="loading"
            class="is-success"
            @click="update ? updateRider() : addRider()"
            >{{ update ? 'Update' : 'Add' }}</b-button
          >

          <b-button
            :loading="loading"
            class="is-outlined is-danger"
            @click="cancel()"
            >Cancel</b-button
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
