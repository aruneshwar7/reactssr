package com.example.reactssr.controller;

import com.example.reactssr.service.JsRunnerService;
import com.example.reactssr.service.NodeEnvironmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class home {

    @Autowired
    JsRunnerService jsRunnerService;
    @Autowired
    NodeEnvironmentService nodeEnvironmentService;


    @GetMapping("/home")
    String home() {
        try {
//            String result =  jsRunnerService.runJs();
//            String react = jsRunnerService.render();
           String response =  nodeEnvironmentService.testConsole();
            return response;
        } catch ( Exception e)
        {
             e.printStackTrace();
             return  "Exception";
        }



    }
}
