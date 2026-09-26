package com.language.LanguageApp;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

// React Router handles page URLs in the browser, so opening or refreshing a page like
// /userDeck/5 must return index.html instead of a 404. Paths containing a dot (static
// files such as /assets/index.js) are left for Spring's static resource handling.
@Controller
public class SpaController {

    @GetMapping({ "/", "/{path:[^.]*}", "/{path:(?!api$)[^.]*}/**" })
    public String forwardToIndex() {
        return "forward:/index.html";
    }
}
