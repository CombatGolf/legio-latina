#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

sdk="${ANDROID_SDK_ROOT:-${ANDROID_HOME:-}}"
tools="$sdk/build-tools/35.0.0"
platform="$sdk/platforms/android-35/android.jar"
if [[ -z "$sdk" || ! -f "$platform" || ! -x "$tools/aapt2" ]]; then
  printf '%s\n' 'Instale Android SDK Platform 35 e Build Tools 35.0.0 e defina ANDROID_SDK_ROOT.' >&2
  exit 1
fi
output="$PWD/android/out"
mkdir -p "$output"
work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT

GITHUB_PAGES=0 npm run build
mkdir -p "$work/assets/web" "$work/res/drawable" "$work/classes" "$work/dex"
cp -R dist/. "$work/assets/web/"
cp -R android/res/. "$work/res/"
cp public/icon-192.png "$work/res/drawable/legio.png"

"$tools/aapt2" compile --dir "$work/res" -o "$work/res.zip"
"$tools/aapt2" link -I "$platform" --manifest android/AndroidManifest.xml \
  -A "$work/assets" -o "$work/resources.apk" "$work/res.zip"
javac --release 8 -classpath "$platform" -d "$work/classes" android/src/MainActivity.java
jar cf "$work/classes.jar" -C "$work/classes" .
"$tools/d8" --min-api 26 --lib "$platform" --output "$work/dex" "$work/classes.jar"
zip -jq "$work/resources.apk" "$work/dex/classes.dex"
"$tools/zipalign" -f 4 "$work/resources.apk" "$work/aligned.apk"

keystore="${LEGIO_KEYSTORE:-$output/debug.keystore}"
if [[ -z "${LEGIO_KEYSTORE:-}" && ! -f "$keystore" ]]; then
  keytool -genkeypair -keystore "$keystore" -storepass android -keypass android \
    -alias androiddebugkey -keyalg RSA -keysize 2048 -validity 10000 \
    -dname 'CN=Android Debug,O=Android,C=US'
fi
if [[ -z "${LEGIO_KEYSTORE:-}" ]]; then
  export LEGIO_STORE_PASSWORD=android LEGIO_KEY_ALIAS=androiddebugkey
fi
: "${LEGIO_STORE_PASSWORD:?Informe a senha do keystore}"
: "${LEGIO_KEY_ALIAS:?Informe o alias da chave}"
args=(--ks "$keystore" --ks-pass env:LEGIO_STORE_PASSWORD --ks-key-alias "$LEGIO_KEY_ALIAS")
if [[ -n "${LEGIO_KEY_PASSWORD:-}" ]]; then args+=(--key-pass env:LEGIO_KEY_PASSWORD); fi
"$tools/apksigner" sign "${args[@]}" --out "$output/Legio-Latina-Opus-Magnum.apk" "$work/aligned.apk"
"$tools/apksigner" verify "$output/Legio-Latina-Opus-Magnum.apk"
"$tools/zipalign" -c 4 "$output/Legio-Latina-Opus-Magnum.apk"
printf '%s\n' "$output/Legio-Latina-Opus-Magnum.apk"
