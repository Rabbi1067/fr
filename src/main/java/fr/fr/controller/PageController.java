package fr.fr.controller;

import fr.fr.ContactForm;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

@Slf4j
@Controller
public class PageController {

    @GetMapping("/")
    public String index() {
        return "index";
    }

    @PostMapping("/")
    public String submitContact(@ModelAttribute ContactForm contactForm) {
        log.info("New message from: {} ({})", contactForm.getName(), contactForm.getEmail());
        log.info("Subject: {}", contactForm.getSubject());
        log.info("Message: {}", contactForm.getMessage());

        return "redirect:/";
    }
}
