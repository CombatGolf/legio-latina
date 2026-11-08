package com.combatgolf.legiolatina;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.speech.tts.TextToSpeech;
import android.speech.tts.Voice;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.util.Locale;
import java.util.Collections;

public final class MainActivity extends Activity {
    private static final String HOST = "appassets.androidplatform.net";
    private static final int IMPORT = 10;
    private static final int EXPORT = 11;
    private WebView web;
    private ValueCallback<Uri[]> importCallback;
    private String pendingExport;
    private TextToSpeech tts;
    private boolean speechReady;

    @Override public void onCreate(Bundle saved) {
        super.onCreate(saved);
        if (saved != null) pendingExport = saved.getString("pendingExport");

        web = new WebView(this);
        web.setBackgroundColor(0xff130e11);
        WebSettings settings = web.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);

        web.setWebViewClient(new WebViewClient() {
            @Override public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                return loadAsset(request);
            }

            @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                if (isLocal(uri)) return false;
                if (request.isForMainFrame() && request.hasGesture() && "https".equals(uri.getScheme())) {
                    try {
                        startActivity(new Intent(Intent.ACTION_VIEW, uri));
                    } catch (ActivityNotFoundException ignored) {
                        message("Nenhum navegador disponível para abrir a referência.");
                    }
                }
                return true;
            }
        });
        web.setWebChromeClient(new WebChromeClient() {
            @Override public boolean onShowFileChooser(WebView view, ValueCallback<Uri[]> callback, FileChooserParams params) {
                if (importCallback != null) importCallback.onReceiveValue(null);
                importCallback = callback;
                Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT)
                    .addCategory(Intent.CATEGORY_OPENABLE).setType("*/*");
                if (!openPicker(intent, IMPORT)) {
                    importCallback.onReceiveValue(null);
                    importCallback = null;
                }
                return true;
            }
        });
        web.addJavascriptInterface(new AndroidBridge(), "LegioAndroid");
        setContentView(web);
        web.loadUrl("https://" + HOST + "/index.html");
        tts = new TextToSpeech(this, status -> speechReady = status == TextToSpeech.SUCCESS);
    }

    private static boolean isLocal(Uri uri) {
        return "https".equals(uri.getScheme()) && HOST.equals(uri.getEncodedAuthority());
    }

    private WebResourceResponse loadAsset(WebResourceRequest request) {
        Uri uri = request.getUrl();
        if (!isLocal(uri) || !"GET".equals(request.getMethod())) {
            return error(403, "Forbidden");
        }

        String path = uri.getPath();
        if (path == null || !path.matches("/[A-Za-z0-9_./-]+") || path.contains("..")) {
            return error(404, "Not Found");
        }
        String type;
        if (path.endsWith(".html")) type = "text/html";
        else if (path.endsWith(".js")) type = "text/javascript";
        else if (path.endsWith(".css")) type = "text/css";
        else if (path.endsWith(".png")) type = "image/png";
        else if (path.endsWith(".svg")) type = "image/svg+xml";
        else if (path.endsWith(".webmanifest")) type = "application/manifest+json";
        else return error(404, "Not Found");
        try {
            return new WebResourceResponse(type, type.equals("image/png") ? null : "UTF-8",
                200, "OK", Collections.singletonMap("Content-Security-Policy",
                    "default-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self'; frame-src 'none'; object-src 'none'"),
                getAssets().open("web" + path));
        } catch (IOException ignored) {
            return error(404, "Not Found");
        }
    }

    private static WebResourceResponse error(int code, String reason) {
        return new WebResourceResponse("text/plain", "UTF-8", code, reason, Collections.emptyMap(),
            new ByteArrayInputStream(new byte[0]));
    }

    private boolean openPicker(Intent intent, int request) {
        try {
            startActivityForResult(intent, request);
            return true;
        } catch (ActivityNotFoundException ignored) {
            message("Nenhum seletor de arquivos disponível.");
            return false;
        }
    }

    @Override protected void onSaveInstanceState(Bundle out) {
        super.onSaveInstanceState(out);
        if (pendingExport != null) out.putString("pendingExport", pendingExport);
    }

    @Override protected void onActivityResult(int request, int result, Intent data) {
        super.onActivityResult(request, result, data);
        Uri uri = result == RESULT_OK && data != null ? data.getData() : null;
        if (request == IMPORT && importCallback != null) {
            importCallback.onReceiveValue(uri == null ? null : new Uri[]{uri});
            importCallback = null;
        }
        if (request == EXPORT) {
            String export = pendingExport;
            pendingExport = null;
            if (uri == null || export == null) return;
            try (OutputStream output = getContentResolver().openOutputStream(uri)) {
                if (output == null) throw new IOException("No output stream");
                output.write(export.getBytes(StandardCharsets.UTF_8));
                message("Progresso exportado.");
            } catch (IOException | SecurityException error) {
                message("Não foi possível exportar o progresso.");
            }
        }
    }

    @Override public void onBackPressed() {
        web.evaluateJavascript("window.legioBack && window.legioBack()", handled -> {
            if (!"true".equals(handled)) finish();
        });
    }

    @Override protected void onDestroy() {
        if (importCallback != null) importCallback.onReceiveValue(null);
        if (tts != null) tts.shutdown();
        web.destroy();
        super.onDestroy();
    }

    private void message(String text) {
        Toast.makeText(this, text, Toast.LENGTH_LONG).show();
    }

    private void speak(String text, double rate) {
        if (!speechReady || tts == null || tts.getVoices() == null) {
            message("O sintetizador do Android ainda está indisponível.");
            return;
        }
        Voice selected = null;
        for (String language : new String[]{"la", "it", "pt"}) {
            for (Voice voice : tts.getVoices()) {
                Locale locale = voice.getLocale();
                if (!voice.isNetworkConnectionRequired() && locale.getLanguage().equals(language)
                    && (voice.getFeatures() == null || !voice.getFeatures().contains(TextToSpeech.Engine.KEY_FEATURE_NOT_INSTALLED))) {
                    selected = voice;
                    break;
                }
            }
            if (selected != null) break;
        }
        if (selected == null || tts.setVoice(selected) == TextToSpeech.ERROR) {
            message("Instale uma voz italiana ou portuguesa no sintetizador do Android.");
            return;
        }
        tts.setSpeechRate((float) Math.max(0.65, Math.min(1.10, rate)));
        tts.speak(text, TextToSpeech.QUEUE_FLUSH, null, "legio");
    }

    private final class AndroidBridge {
        @JavascriptInterface public void speak(String text, double rate) {
            if (text != null && text.length() <= 350 && Double.isFinite(rate)) {
                runOnUiThread(() -> MainActivity.this.speak(text, rate));
            }
        }

        @JavascriptInterface public void exportProgress(String json) {
            if (json == null || json.length() > 250_000) return;
            runOnUiThread(() -> {
                if (pendingExport != null) return;
                pendingExport = json;
                Intent intent = new Intent(Intent.ACTION_CREATE_DOCUMENT)
                    .addCategory(Intent.CATEGORY_OPENABLE).setType("application/json")
                    .putExtra(Intent.EXTRA_TITLE, "legio-latina-progresso.json");
                if (!openPicker(intent, EXPORT)) pendingExport = null;
            });
        }
    }
}
