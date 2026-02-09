package org.example.backend.entities;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "stalls")
public class Stall {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "stall_code", nullable = false, unique = true)
    private String stallCode;

    @Enumerated(EnumType.STRING)
    @Column(name = "size", nullable = false)
    private Size size;

    @Column(name = "x_position", nullable = false)
    private int xPosition;

    @Column(name = "y_position", nullable = false)
    private int yPosition;
}
