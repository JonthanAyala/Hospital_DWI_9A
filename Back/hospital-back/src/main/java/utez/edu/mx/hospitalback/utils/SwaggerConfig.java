package utez.edu.mx.hospitalback.utils;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {
    @Bean
    public OpenAPI config(){
        return new OpenAPI().info(new Info()
                .title("API para almacenes")
                .description("Documentacion de los enpoints de la API para almacenes")
                .version("V1.0"));
    }
}
