package com.language.LanguageApp;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

// React Router handles page URLs in the browser, so opening or refreshing a page like
// /userDeck/5/view must return index.html instead of a 404. Only paths whose last segment
// has no dot are matched, so static files such as /assets/index.js are still served as-is.
// Add a deeper pattern here if a frontend route ever goes beyond three segments.
@Controller
public class SpaController {

    @GetMapping({
            "/",
            "/{a:[^.]*}",
            "/{a:(?!api$)[^.]*}/{b:[^.]*}",
            "/{a:(?!api$)[^.]*}/{b:[^.]*}/{c:[^.]*}" })
    public String forwardToIndex() {
        return "forward:/index.html";
    }
}
