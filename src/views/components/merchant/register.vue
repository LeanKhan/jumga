<template type="x-template" id="register-form-component">
  <div>
    <b-steps
      :value="current_step"
      :has-navigation="false"
      type="is-success"
      size="is-medium"
    >
      <b-step-item :step="1" label="Account">
        <p class="subheader body has-text-centered">Hahaha</p>
        <form method="POST" action="/signup?returnTo=/register?step=1">
          <div class="field">
            <div class="control">
              <label class="label has-text-left" for="firstname"
                >Firstname</label
              >

              <input
                class="input"
                name="firstname"
                placeholder="firstname"
                required
              />
            </div>
          </div>

          <div class="field">
            <div class="control">
              <label class="label has-text-left" for="lastname">Lastname</label>

              <input
                class="input"
                name="lastname"
                type="text"
                placeholder="lastname"
                required
              />
            </div>
          </div>

          <div class="field">
            <div class="control">
              <label class="label has-text-left" for="phonenumber"
                >Phonenumber</label
              >

              <input
                class="input"
                name="phonenumber"
                type="text"
                placeholder="phonenumber"
              />
            </div>
          </div>

          <div class="field">
            <div class="control">
              <label class="label has-text-left" for="phonenumber">Email</label>

              <input
                class="input"
                name="email"
                type="email"
                placeholder="email"
                required
              />
            </div>
          </div>

          <div class="field">
            <div class="control">
              <label class="label has-text-left" for="password">Password</label>

              <input
                class="input"
                name="password"
                type="password"
                placeholder="password"
                required
              />
            </div>
          </div>

          <div class="field">
            <div class="control">
              <label class="label has-text-left" for="confirmPassword"
                >Confirm Password</label
              >

              <input
                class="input"
                name="confirmPassword"
                type="password"
                placeholder="confirm password"
              />
            </div>
          </div>
          <button class="button is-block is-primary is-fullwidth is-medium">
            Create Account
          </button>
          <br />
          <small
            >Already have an account?
            <a class="has-text-primary" href="/signin">Sign in</a></small
          >
        </form>
      </b-step-item>
      <b-step-item :step="2" label="Shop">
        <form method="POST" action="/shops/new?returnTo=/register?step=2">
          <div class="field">
            <div class="control">
              <label class="label has-text-left" for="shopName"
                >Shop Name</label
              >

              <input
                class="input is-rounded"
                name="shopName"
                placeholder="My Shop"
                required
              />
            </div>
          </div>

          <div class="field">
            <div class="control">
              <label class="label has-text-left is-rounded" for="description"
                >Description</label
              >

              <textarea
                class="textarea is-warning is-rounded"
                name="description"
                type="text"
                placeholder="We sell all things :)"
                rows="3"
                required
              ></textarea>
              <!-- NOT CLOSING THIS textarea caused major problems. The Javascript on the page wasn't loadigg...
              I was very confused :/ - 1 AM Jan 11, 2021 -->
            </div>
          </div>

          <div class="field">
            <div class="control">
              <label class="label has-text-left" for="category"
                >Shop Category</label
              >

              <div class="select is-rounded is-block">
                <select name="category" style="width: 100%">
                  <option v-for="(c, i) in categories" :key="i" :value="c.slug">
                    {{ c.name }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <button
            class="button is-block is-warning jumga-yellow is-fullwidth is-medium"
          >
            Create Shop
          </button>
          <br />
          <small
            >Do this later
            <a class="has-text-primary" href="/shops/dashboard"
              >Sign in</a
            ></small
          >
        </form>
      </b-step-item>
      <b-step-item :step="3" label="Done"></b-step-item>
    </b-steps>
  </div>
</template>
