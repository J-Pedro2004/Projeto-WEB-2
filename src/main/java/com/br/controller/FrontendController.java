package com.br.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class FrontendController {

    // Redireciona rotas de nível único (ex: /pedidos, /autores) para o index.html
    // O regex [^\\.]* garante que não capture arquivos com extensão (.js, .css, etc)
    @RequestMapping(value = "/{path:[^\\.]*}")
    public String redirect() {
        return "forward:/index.html";
    }

    // Redireciona rotas aninhadas (ex: /pedidos/novo)
    @RequestMapping(value = "/**/{path:[^\\.]*}")
    public String redirectNested() {
        return "forward:/index.html";
    }
}
