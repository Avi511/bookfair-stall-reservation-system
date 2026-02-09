package org.example.backend.controllers;


import lombok.AllArgsConstructor;
import org.example.backend.entities.Stall;
import org.example.backend.repositories.StallRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/api/stalls")
public class StallController {
    private final StallRepository stallRepository;

    @GetMapping
    public List<Stall> getAllStalls() {
        return stallRepository.findAll();
    }

    @GetMapping("/{id}")
    public Stall getStallById(
            @PathVariable Long id
    ) {
        return stallRepository.findById(id).orElse(null);
    }

    @PostMapping
    public Stall createStall(
            @RequestBody Stall stall
    ) {
        stallRepository.save(stall);
        return stall;
    }
}
