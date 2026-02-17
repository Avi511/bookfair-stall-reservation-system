package org.example.backend.config;

import lombok.RequiredArgsConstructor;
import org.example.backend.entities.Role;
import org.example.backend.filters.JwtAuthenticationFilter;
//import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    /*
 Optional frontend URL (not required if allowing all origins)
    @Value("${app.frontend-url:}")
    private String frontendUrl;
*/

    private final UserDetailsService userDetailsService;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        var provider = new DaoAuthenticationProvider(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config
    ) {
        return config.getAuthenticationManager();
    }

    // 🔥 Allow CORS from everywhere (for testing)
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // IMPORTANT: use allowedOriginPatterns when allowCredentials(true)
        configuration.setAllowedOriginPatterns(List.of("*"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http){

        http
                .cors(cors -> {})
                .sessionManagement(c -> c.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(c -> c
                        .requestMatchers(HttpMethod.GET,"/api/events").permitAll()
                        .requestMatchers(HttpMethod.GET,"/api/events/{id}").permitAll()
                        .requestMatchers(HttpMethod.GET,"/api/events/active").permitAll()
                        .requestMatchers(HttpMethod.POST,"/api/users").permitAll()
                        .requestMatchers(HttpMethod.POST,"/api/auth/login").permitAll()
                        .requestMatchers(HttpMethod.POST,"/api/auth/refresh").permitAll()
                        .requestMatchers(HttpMethod.GET,"/api/stalls/**").permitAll()
                        .requestMatchers(HttpMethod.GET,"/api/genres/**").permitAll()
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/swagger-ui.html").permitAll()

                        .requestMatchers(HttpMethod.PUT,"/api/users")
                        .hasRole(Role.USER.name())

                        .requestMatchers(HttpMethod.GET,"/api/reservations")
                        .hasRole(Role.EMPLOYEE.name())

                        .requestMatchers("/api/employees/**")
                        .hasRole(Role.EMPLOYEE.name())

                        .requestMatchers("/api/events/**")
                        .hasRole(Role.EMPLOYEE.name())

                        .requestMatchers(HttpMethod.POST,"/api/stalls")
                        .hasRole(Role.EMPLOYEE.name())

                        .requestMatchers(HttpMethod.PUT,"/api/stalls/{id}")
                        .hasRole(Role.EMPLOYEE.name())

                        .requestMatchers(HttpMethod.DELETE,"/api/stalls/{id}")
                        .hasRole(Role.EMPLOYEE.name())

                        .requestMatchers(HttpMethod.POST,"/api/genres")
                        .hasRole(Role.EMPLOYEE.name())

                        .requestMatchers(HttpMethod.PUT,"/api/genres/{id}")
                        .hasRole(Role.EMPLOYEE.name())

                        .requestMatchers(HttpMethod.DELETE,"/api/genres/{id}")
                        .hasRole(Role.EMPLOYEE.name())

                        .requestMatchers("/api/reservations/**")
                        .hasRole(Role.USER.name())

                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .exceptionHandling(c -> {
                    c.authenticationEntryPoint(
                            new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED));
                    c.accessDeniedHandler((request, response, accessDeniedException) ->
                            response.setStatus(HttpStatus.FORBIDDEN.value()));
                });

        return http.build();
    }
}
