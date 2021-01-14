<template type="x-template" id="update-shop-component">
  <div>
        <b-field label="Banner Image">
          <b-input v-model="shop_form.pictures.banner_image"></b-input>
        </b-field>

        <b-field label="Shop Logo / Icon">
          <b-input v-model="shop_form.pictures.logo"></b-input>
        </b-field>

        <b-field label="Theme Color">
          <b-input type="color" v-model="shop_form.theme_color" required></b-input>
        </b-field>

        <b-field label="Description">
          <b-input
            v-model="shop_form.description"
            maxlength="200"
            type="textarea"
            required
          ></b-input>
        </b-field>

        <!-- submit button -->
        <b-button type="success" class="is-success" @click="updateShop()"
          >Update</b-button
        >

    <b-loading
      :is-full-page="true"
      v-model="loading"
      :can-cancel="true"
    ></b-loading>
  </div>
</template>
