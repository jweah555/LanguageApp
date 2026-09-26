package com.language.LanguageApp;

import java.util.Map;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.deepl.api.DeepLClient;
import com.deepl.api.TextResult;

@RestController
        public class TranslateController {

            private final DeepLClient client = new DeepLClient(System.getenv("DEEPL_API_KEY"));

            @PostMapping("/translate")
            public Map<String, String> translate(@RequestBody Map<String, String> body) throws Exception {
                TextResult result = client.translateText(body.get("text"), null, body.get("targetLang"));
                return Map.of("translation", result.getText());
            }
}