#!/bin/bash

# Exit if any of the builds fails
set -e

# Source directories for packages to build with bazel and copy into dist/
packages=(cdk lib cdk-experimental material-experimental material-moment-adapter)

# The bazel-bin directory where the bazel output is written
bazel_bin="$(bazel info bazel-bin)"

# The dist/ directory where we want to copy the final result. Clear it out to avoid
# any artifacts from earlier builds being retained.
packages_dist="./dist/bazel-packages"
rm -rf ${packages_dist}
mkdir -p ${packages_dist}

for p in ${packages[@]}
do
  bazel build src/${p}:npm_package

  # The output for "lib" should go into a directory named "material"
  [[ ${p} = "lib" ]] && out_dir="material" || out_dir="${p}"

  # Copy without preserving the read-only mode from bazel so that we can make final modifications
  # to the generated package.
  mkdir -p ${packages_dist}/${out_dir}
  cp -r --no-preserve=mode ${bazel_bin}/src/${p}/npm_package/* ${packages_dist}/${out_dir}
done

# Update the root @angular/material metadata file to re-export metadata from each entry-point.
./scripts/bazel/update-material-metadata-reexports.js

# Update the Angular version used as a peerDependency for all of the packages.
ng_version=$(echo "console.log(require('./build-config').angularVersion)" | node)
find ${packages_dist} -type f -exec sed -i "s|0.0.0-NG|${ng_version}|g" {} \;

# Create a tgz for each package with `npm pack`. Change directory in a subshell because
# `npm pack` always outputs to the current working directory.
(cd ${packages_dist} ; find . -maxdepth 1 -mindepth 1 -type d | xargs npm pack)
