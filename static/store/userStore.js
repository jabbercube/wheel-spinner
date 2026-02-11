/*
Copyright 2020 Google LLC

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    https://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import * as ServerFunctions from '../ServerFunctions.js';
import * as Firebase from '../Firebase.js';

export default {
  state: {
    userPhotoUrl: '/images/user_profile.png',
    userDisplayName: 'Local User',
    savedWheels: [],
    sharedWheels: []
  },
  getters: {
    userPhotoUrl: state => state.userPhotoUrl,
    userDisplayName: state => state.userDisplayName,
    savedWheels: state => state.savedWheels,
    sharedWheels: state => state.sharedWheels,
  },
  mutations: {
    setUserPhotoUrl(state, userPhotoUrl) {
      state.userPhotoUrl = userPhotoUrl || '/images/user_profile.png';
    },
    setUserDisplayName(state, userDisplayName) {
      state.userDisplayName = userDisplayName;
    },
    setSavedWheels(state, savedWheels) {
      state.savedWheels = savedWheels;
    },
    setSharedWheels(state, sharedWheels) {
      state.sharedWheels = sharedWheels;
    },
    clearUser(state) {
      state.userPhotoUrl = '/images/user_profile.png';
      state.userDisplayName = 'Local User';
      state.savedWheels = [];
      state.sharedWheels = [];
    },
  },
  actions: {
    async userIsLoggedIn({state, commit, rootState}) {
      await Firebase.loadLibraries();
      return true;
    },
    async logOut({state, commit, rootState}) {
      commit('clearUser');
    },
    async deleteAccount({state, commit, rootState}) {
      // No-op: no auth in this iteration
    },
    async loginAnonymously(context) {
      // No-op: always logged in
    },
    async loginWithUi({state, commit, rootState}, elementName) {
      // No-op: always logged in
    },
    async logInToSheets({state, commit, rootState}, locale) {
      throw new Error('Google Sheets integration not available');
    },
    async logUserActivity() {
      // No-op
    },
    async getUid() {
      return 'default';
    },
    async loadSavedWheels(context) {
      const wheels = await Firebase.getWheels();
      context.commit('setSavedWheels', wheels);
    },
    async logWheelRead(context, wheelTitle) {
      await Firebase.logWheelRead(wheelTitle);
    },
    async deleteSavedWheel(context, wheelTitle) {
      await Firebase.deleteSavedWheel(wheelTitle);
    },
    async saveWheel(context, wheelConfig) {
      await Firebase.saveWheel(wheelConfig.getValues());
    },
    async loadSharedWheels(context) {
      const wheels = await ServerFunctions.getSharedWheels();
      context.commit('setSharedWheels', wheels);
    },
    async shareWheel(context, {wheelConfig, copyableWheel}) {
      return await ServerFunctions.createSharedWheel(
        copyableWheel, wheelConfig
      );
    },
    async deleteSharedWheel(context, path) {
      const wheels = await ServerFunctions.deleteSharedWheel(path);
      context.commit('setSharedWheels', wheels);
    }
  }
}
