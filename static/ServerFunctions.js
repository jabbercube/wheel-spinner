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
import * as Util from './Util.js';

export async function createSharedWheel(copyable, wheelConfig) {
  const payload = {copyable: copyable, wheelConfig: wheelConfig.getValues()};
  const response = await fetch('/api/shared-wheels', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(payload)
  });
  const respObj = await response.json();
  if (respObj.hasOwnProperty('error')) throw respObj.error;
  return respObj.path;
}

export async function logSharedWheelRead(path) {
  if (!path) return;
  await fetch('/api/shared-wheel-reads', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({path: path})
  });
}

export async function getSharedWheel(path) {
  const response = await fetch(`/api/shared-wheels/${path}`);
  const respObj = await response.json();
  return respObj.wheelConfig;
}

export async function getSharedWheels() {
  const response = await fetch('/api/shared-wheels');
  const respObj = await response.json();
  return respObj.wheels;
}

export async function deleteSharedWheel(path) {
  const response = await fetch(`/api/shared-wheels/${encodeURIComponent(path)}`, {
    method: 'DELETE'
  });
  const respObj = await response.json();
  return respObj.wheels;
}

export async function fetchSocialMediaUsers(searchTerm) {
  return [];
}

export async function convertAccount() {
  // No-op: no auth in this iteration
}

export async function deleteAccount() {
  // No-op: no auth in this iteration
}

export async function getCarousels() {
  try {
    const response = await fetch('/api/carousels');
    const respObj = await response.json();
    return respObj;
  }
  catch(ex) {
    Util.trackException(ex);
    return [''];
  }
}

export async function getNumberOfWheelsInReviewQueue() {
  const response = await fetch('/api/review-queue/count');
  const respObj = await response.json();
  if (respObj.error) throw respObj.error;
  return respObj.wheelsInReviewQueue;
}

export async function translate(idToken, entries) {
  // Cloud Translate not available without GCP
  return entries.map(() => '');
}

export async function userIsAdmin() {
  const response = await fetch('/api/user/is-admin');
  const respObj = await response.json();
  return respObj.userIsAdmin;
}

export async function getSpinStats() {
  try {
    const response = await fetch('/api/spin-stats');
    const respObj = await response.json();
    return respObj;
  }
  catch(ex) {
    Util.trackException(ex);
    return {};
  }
}
