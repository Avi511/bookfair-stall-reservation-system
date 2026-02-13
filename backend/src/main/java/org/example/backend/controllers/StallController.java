package org.example.backend.controllers;


import lombok.AllArgsConstructor;
import org.example.backend.dtos.AddStallRequest;
import org.example.backend.dtos.StallAvailabilityDto;
import org.example.backend.dtos.StallDto;
import org.example.backend.services.StallService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/api/stalls")
public class StallController {
    private final StallService stallService;

    @GetMapping
    public List<StallDto> getAllStalls() {
        return stallService.listStalls();
    }

    @GetMapping("/{id}")
    public ResponseEntity<StallDto> getStallById(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(stallService.getStall(id));
    }

    @GetMapping("/event/{eventId}")
    public List<StallAvailabilityDto> getStallsWithStatus(
            @PathVariable Integer eventId
    ) {
        return stallService.listStallAvailability(eventId);
    }

    @PostMapping
    public ResponseEntity<StallDto> createStall(
            @RequestBody AddStallRequest request,
            UriComponentsBuilder uriComponentsBuilder
    ) {
        var dto = stallService.createStall(request);
        var uri = uriComponentsBuilder.path("/api/stalls/{id}").buildAndExpand(dto.getId()).toUri();
        return ResponseEntity.created(uri).body(dto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<StallDto> updateStall(
            @PathVariable Long id,
            @RequestBody AddStallRequest request
    ) {
        return ResponseEntity.ok(stallService.updateStall(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStall(
            @PathVariable Long id
    ) {
        stallService.deleteStall(id);
        return ResponseEntity.noContent().build();
    }

}
