# syntax=docker/dockerfile:experimental

# base
# 2
## base -> audit-deps
## base -> prep-deps
# 3
### base -> prep-deps -> prep-deps-with-files
### base -> prep-deps -> prep-deps-with-prod-files
### base -> prep-deps -> test-lint-lockfile @
# 4
#### base -> prep-deps -> prep-deps-with-files -> prep-deps-browser
#### base -> prep-deps -> prep-deps-with-prod-files -> prep-test
#### base -> prep-deps -> prep-deps-with-prod-files -> prep-build
#### base -> prep-deps -> prep-deps-with-prod-files -> prep-build-storybook @
#### base -> prep-deps -> prep-deps-with-files -> shellcheck @
#### base -> prep-deps -> prep-deps-with-files -> test-lint @
# 5
##### base -> prep-deps -> prep-deps-with-files -> prep-deps-browser -> prep-build-test
##### base -> prep-deps -> prep-deps-with-files -> prep-deps-browser -> prep-test-flat
##### base -> prep-deps -> prep-deps-with-prod-files -> prep-test -> test-unit @
##### base -> prep-deps -> prep-deps-with-prod-files -> prep-test -> test-unit-global @
##### base -> prep-deps -> prep-deps-with-prod-files -> prep-build -> test-mozilla-lint @
# 6
###### base -> prep-deps -> prep-deps-with-files -> prep-deps-browser -> prep-test-flat -> test-flat chrome/firefox
###### base -> prep-deps -> prep-deps-with-files -> prep-deps-browser -> prep-build-test -> e2e-chrome
###### base -> prep-deps -> prep-deps-with-files -> prep-deps-browser -> prep-build-test -> e2e-firefox
###### base -> prep-deps -> prep-deps-with-files -> prep-deps-browser -> prep-build-test -> benchmark

############################################################################# Level 1
# base
FROM circleci/node:10.16.3 AS base
RUN sudo apt update && sudo apt install lsof -y && sudo rm -rf /var/lib/apt/lists/*
WORKDIR /home/circleci/portal
COPY --chown=circleci:circleci yarn.lock package.json .

############################################################################# Level 2
# audit
FROM base AS audit-deps
COPY --chown=circleci:circleci .circleci/scripts/yarn-audit .
RUN ./yarn-audit

# prep-deps without browser
FROM base as prep-deps
COPY --chown=circleci:circleci .circleci/scripts/deps-install.sh .
RUN --mount=type=cache,target=/usr/local/share/.cache/yarn ./deps-install.sh

############################################################################# Level 3
# prep-deps-with-files without browser
FROM prep-deps as prep-deps-with-files
COPY --chown=circleci:circleci ./development/prepare-conflux-local-netowrk-lite.js ./development/
RUN yarn test:prepare-conflux-local
COPY --chown=circleci:circleci . .

RUN printf '#!/bin/sh\nexec "$@"\n' > /tmp/entrypoint-prep-deps \
  && chmod +x /tmp/entrypoint-prep-deps \
  && sudo mv /tmp/entrypoint-prep-deps /docker-entrypoint-prep-deps.sh
ENTRYPOINT ["/docker-entrypoint-prep-deps.sh"]

# prep-deps-with-prod-file
FROM prep-deps AS prep-deps-with-prod-files
COPY --chown=circleci:circleci gulpfile.js babel.config.js .
COPY --chown=circleci:circleci ui ./ui
COPY --chown=circleci:circleci app ./app

# test-lint-lockfile
FROM prep-deps AS test-lint-lockfile
RUN yarn lint:lockfile

############################################################################# Level 4
# prep-test
FROM prep-deps-with-prod-files AS prep-test
COPY --chown=circleci:circleci ./development/prepare-conflux-local-netowrk-lite.js ./development/prepare-conflux-local-netowrk-lite.js
COPY --chown=circleci:circleci ./test/env.js ./test/env.js
COPY --chown=circleci:circleci ./test/helper.js ./test/helper.js
COPY --chown=circleci:circleci ./test/setup.js ./test/setup.js

# prep-deps with browser
FROM circleci/node:10.16.3-browsers AS prep-deps-browser
# start xvfb automatically to avoid needing to express in circle.yml
ENV DISPLAY :99
RUN printf '#!/bin/sh\nsudo Xvfb :99 -screen 0 1280x1024x24 &\nexec "$@"\n' > /tmp/entrypoint \
  && chmod +x /tmp/entrypoint \
  && sudo mv /tmp/entrypoint /docker-entrypoint.sh

RUN sudo apt update && sudo apt install lsof -y && sudo rm -rf /var/lib/apt/lists/*

WORKDIR /home/circleci/portal

# install firefox
COPY --chown=circleci:circleci ./.circleci/scripts/firefox-install ./.circleci/scripts/firefox.cfg ./.circleci/scripts/
RUN ./.circleci/scripts/firefox-install

# install chrome
RUN curl --silent --show-error --location --fail --retry 3 --output /tmp/google-chrome-stable_current_amd64.deb https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb \
  && (sudo dpkg -i /tmp/google-chrome-stable_current_amd64.deb || sudo apt-get -fy install)  \
  && rm -rf /tmp/google-chrome-stable_current_amd64.deb \
  && sudo sed -i 's|HERE/chrome"|HERE/chrome" --disable-setuid-sandbox --no-sandbox|g' \
  "/opt/google/chrome/google-chrome" \
  && google-chrome --version

RUN CHROME_VERSION="$(google-chrome --version)" \
  && export CHROMEDRIVER_RELEASE="$(echo $CHROME_VERSION | sed 's/^Google Chrome //')" && export CHROMEDRIVER_RELEASE=${CHROMEDRIVER_RELEASE%%.*} \
  && CHROMEDRIVER_VERSION=$(curl --silent --show-error --location --fail --retry 4 --retry-delay 5 http://chromedriver.storage.googleapis.com/LATEST_RELEASE_${CHROMEDRIVER_RELEASE}) \
  && curl --silent --show-error --location --fail --retry 4 --retry-delay 5 --output /tmp/chromedriver_linux64.zip "http://chromedriver.storage.googleapis.com/$CHROMEDRIVER_VERSION/chromedriver_linux64.zip" \
  && cd /tmp \
  && unzip chromedriver_linux64.zip \
  && rm -rf chromedriver_linux64.zip \
  && sudo mv chromedriver /usr/local/bin/chromedriver \
  && sudo chmod +x /usr/local/bin/chromedriver \
  && chromedriver --version

ARG BUILDKITE
ARG BUILDKITE_BRANCH
ARG BUILDKITE_ORGANIZATION_SLUG
ARG BUILDKITE_REPO
ENV BUILDKITE ${BUILDKITE}
ENV BUILDKITE_BRANCH ${BUILDKITE_BRANCH}
ENV BUILDKITE_ORGANIZATION_SLUG ${BUILDKITE_ORGANIZATION_SLUG}
ENV BUILDKITE_REPO ${BUILDKITE_REPO}

COPY --chown=circleci:circleci --from=prep-deps-with-files /home/circleci/portal/ .

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["/bin/sh"]

# prep-build
FROM prep-deps-with-prod-files AS prep-build
RUN yarn dist
RUN find dist/ -type f -exec md5sum {} \; | sort -k 2

# prep-build-storybook
FROM prep-deps-with-prod-files AS prep-build-storybook
COPY --chown=circleci:circleci .storybook .
RUN yarn storybook:build

# test-lint-shellcheck
FROM prep-deps-with-files AS shellcheck
RUN sudo apt update && sudo apt install jq shellcheck -y && sudo rm -rf /var/lib/apt/lists/*
RUN yarn lint:shellcheck

# test-lint
FROM prep-deps-with-files AS test-lint
RUN yarn lint
RUN yarn verify-locales --quiet
############################################################################# Level 5
# test-unit
FROM prep-test AS test-unit
COPY --chown=circleci:circleci test/stub ./test/stub
COPY --chown=circleci:circleci ./test/lib ./test/lib
COPY --chown=circleci:circleci ./test/data ./test/data
COPY --chown=circleci:circleci ./test/unit ./test/unit
RUN yarn test:coverage

# test-unit-global
FROM prep-test AS test-unit-global
COPY --chown=circleci:circleci ./app/scripts/lib/freezeGlobals.js ./app/scripts/lib/freezeGlobals.js
COPY --chown=circleci:circleci ./test/unit-global ./test/unit-global
RUN yarn test:unit:global

# prep-build-test
FROM prep-deps-browser AS prep-build-test
RUN yarn build:test
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["/bin/sh"]

# test-integration-flat
FROM prep-deps-browser AS prep-test-flat
RUN find ui/app/css -type f -exec md5sum {} \; | sort -k 2 > scss_checksum
RUN yarn test:integration:build
RUN yarn test:flat:build
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["/bin/sh"]

# test-mozilla-lint
FROM prep-build AS test-mozilla-lint
RUN NODE_OPTIONS=--max_old_space_size=3072 yarn mozilla-lint

############################################################################# Level 6
# test-integration-flat
FROM prep-test-flat AS test-flat
ARG BROWSERS='["Chrome"]'
ENV BROWSERS ${BROWSERS}
RUN sudo Xvfb :99 -screen 0 1280x1024x24 & yarn run karma start test/flat.conf.js

# # test-e2e-chrome
# FROM prep-build-test AS e2e-chrome
# ARG BUILDKITE_PARALLEL_JOB
# ARG BUILDKITE_PARALLEL_JOB_COUNT
# ENV BUILDKITE_PARALLEL_JOB ${BUILDKITE_PARALLEL_JOB}
# ENV BUILDKITE_PARALLEL_JOB_COUNT ${BUILDKITE_PARALLEL_JOB_COUNT}
# RUN sudo Xvfb :99 -screen 0 1280x1024x24 & yarn test:e2e:chrome:parallel

# # test-e2e-firefox
# FROM prep-build-test AS e2e-firefox
# ARG BUILDKITE_PARALLEL_JOB
# ARG BUILDKITE_PARALLEL_JOB_COUNT
# ENV BUILDKITE_PARALLEL_JOB ${BUILDKITE_PARALLEL_JOB}
# ENV BUILDKITE_PARALLEL_JOB_COUNT ${BUILDKITE_PARALLEL_JOB_COUNT}
# RUN sudo Xvfb :99 -screen 0 1280x1024x24 & yarn test:e2e:firefox:parallel

# # benchmark
# FROM prep-build-test AS benchmark
# RUN sudo Xvfb :99 -screen 0 1280x1024x24 & yarn benchmark:chrome --out test-artifacts/chrome/benchmark/pageload.json

# job-publish-prerelease
FROM prep-build AS prerelease
COPY --chown=circleci:circleci ./development/source-map-explorer.sh ./development/source-map-explorer.sh
COPY --chown=circleci:circleci ./.circleci/scripts/create-sesify-viz ./.circleci/scripts/create-sesify-viz
COPY --chown=circleci:circleci ./development/metamaskbot-build-announce.js ./development/metamaskbot-build-announce.js
RUN ./development/source-map-explorer.sh
RUN ./.circleci/scripts/create-sesify-viz
# RUN ./development/metamaskbot-build-announce.js
