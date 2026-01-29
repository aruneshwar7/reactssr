package com.example.reactssr.controller;

import com.example.reactssr.data.Dummydata;
import com.example.reactssr.service.JsRunnerService;
import com.example.reactssr.service.NodeEnvironmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import tools.jackson.databind.ObjectMapper;

import java.util.HashMap;
import java.util.Map;

@RestController
public class home {

    @Autowired
    JsRunnerService jsRunnerService;
    @Autowired
    NodeEnvironmentService nodeEnvironmentService;
    @Autowired
    Dummydata dummydata;

    @GetMapping("/home")
    String home() {
        try {
//            String result =  jsRunnerService.runJs();
//            String react = jsRunnerService.render();
           String response =  nodeEnvironmentService.testConsole("/invoice");
            return response;
        } catch ( Exception e)
        {
             e.printStackTrace();
             return  "Exception";
        }
    }

    @GetMapping("/invoices")
    String invoiceList(){
        try {
            Map<String, Object> props = new HashMap<>();
            props.put("route", "/invoices");
            ObjectMapper objectMapper = new ObjectMapper();
            Object invoiceObj =
                    objectMapper.readValue(dummydata.getInvoicesJson(), Object.class);
            props.put("invoices", invoiceObj);
            String s = objectMapper.writeValueAsString(props);
        String response =  nodeEnvironmentService.testConsole(s);
        return  response;
        } catch (Exception e)
        {
            e.printStackTrace();
        }
        return "expection";
    }

    @GetMapping("/invoices/{id}")
    String invoice(){
        try {
            Map<String, Object> props = new HashMap<>();
            props.put("route", "/invoice");
            ObjectMapper objectMapper = new ObjectMapper();
            Object invoiceObj =
                    objectMapper.readValue(dummydata.getInvoice(), Object.class);
            props.put("invoice", invoiceObj);
            String s = objectMapper.writeValueAsString(props);
            String response =  nodeEnvironmentService.testConsole(s);
            return  response;
        } catch (Exception e)
        {
            e.printStackTrace();
        }
        return "expection";
    }
}
