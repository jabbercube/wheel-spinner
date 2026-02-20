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
const webpack = require('webpack');
const dotenv = require('dotenv-webpack');
const {merge} = require('webpack-merge');
const baseConfig = require('./base.config.js');

module.exports = merge(baseConfig, {
  mode: 'production',
  plugins: [
    // Read build/prod.env if present; silent: true skips errors when missing.
    new dotenv({
      path: './build/prod.env',
      silent: true,
    }),
    // Fallback defaults for any process.env.* not defined by dotenv above.
    // Ensures `process` is never left as an undefined runtime reference.
    // WHEEL_DEFAULT_ENTRIES is handled at runtime via /config.js, not here.
    new webpack.DefinePlugin({
      'process.env.FIREBASE_API_KEY': JSON.stringify(''),
      'process.env.OAUTH_CLIENT_ID': JSON.stringify(''),
      'process.env.GCP_APP_ID': JSON.stringify(''),
    }),
  ],
})
