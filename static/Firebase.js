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

const defaultUser = {
  uid: 'default',
  displayName: 'Local User',
  photoURL: '/images/user_profile.png',
  isAnonymous: false,
  getIdToken: () => 'no-auth'
};

export async function loadLibraries() {
  // No-op: no Firebase libraries to load
}

export async function userIsLoggedIn() {
  return true;
}

export async function getLoggedInUser() {
  return defaultUser;
}

export async function getUserIdToken() {
  return 'no-auth';
}

export async function getUid() {
  return 'default';
}

export async function getAnonymousTokenId() {
  return null;
}

export function loadAuthUserInterface(elementName) {
  return Promise.resolve(defaultUser);
}

export async function logIn(providerName, locale) {
  return defaultUser;
}

export async function logInAnonymously() {
  return defaultUser;
}

export async function logInToSheets(locale) {
  throw new Error('Google Sheets integration not available');
}

export function logOut() {
  // No-op
}

export async function logUserActivity() {
  // No-op
}

export async function getWheels() {
  const response = await fetch('/api/wheels');
  const data = await response.json();
  return data.wheels;
}

export async function setAdminsWheelsToZero(adminsUid) {
  await fetch(`/api/admins/${encodeURIComponent(adminsUid)}/reset-reviews`, {
    method: 'POST'
  });
}

export async function logWheelRead(wheelTitle) {
  // No-op for saved wheel reads in this iteration
}

export async function deleteSavedWheel(wheelTitle) {
  await fetch(`/api/wheels/${encodeURIComponent(wheelTitle)}`, {
    method: 'DELETE'
  });
}

export async function saveWheel(config) {
  await fetch('/api/wheels', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({config: config})
  });
}

export async function getDirtyWords() {
  const response = await fetch('/api/settings/dirty-words');
  return await response.json();
}

export async function setDirtyWords(words) {
  await fetch('/api/settings/dirty-words', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({words: words})
  });
}

export async function getAdmins() {
  const response = await fetch('/api/admins');
  return await response.json();
}

export async function getEarningsPerReview() {
  const response = await fetch('/api/settings/earnings-per-review');
  return await response.json();
}

export async function deleteAdmin(uid) {
  await fetch(`/api/admins/${encodeURIComponent(uid)}`, {
    method: 'DELETE'
  });
}

export async function addAdmin(uid, name) {
  await fetch('/api/admins', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({uid: uid, name: name})
  });
}

export async function saveCarousel(carousel) {
  await fetch('/api/carousels', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({carousel: carousel})
  });
}

export async function approveSharedWheel(path) {
  await fetch(`/api/review-queue/${encodeURIComponent(path)}/approve`, {
    method: 'POST'
  });
}

export async function deleteSharedWheel(path, incReviewCount) {
  await fetch(`/api/review-queue/${encodeURIComponent(path)}/delete`, {
    method: 'POST'
  });
}

export async function resetSessionReviews(uid) {
  await fetch(`/api/admins/${encodeURIComponent(uid)}/reset-session`, {
    method: 'POST'
  });
}

export async function getSharedWheel(path) {
  const response = await fetch(`/api/shared-wheels/${encodeURIComponent(path)}`);
  const data = await response.json();
  if (data.wheelConfig && !data.wheelConfig.wheelNotFound) {
    return {
      path: path,
      config: data.wheelConfig.wheelConfig,
      copyable: data.wheelConfig.copyable,
      reviewStatus: data.wheelConfig.reviewStatus,
      created: null,
      lastRead: null,
      readCount: 0
    };
  }
  return null;
}

export async function getNextSharedWheelForReview() {
  const response = await fetch('/api/review-queue/next');
  return await response.json();
}
