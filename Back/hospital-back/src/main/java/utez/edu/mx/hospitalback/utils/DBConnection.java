package utez.edu.mx.hospitalback.utils;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

import javax.sql.DataSource;

/*
* Configuration le dice a spring que esta clase va a a configurar algo
* pero esta notacion requiere al menos de un metodo que retorne
* dicha configuracion
*
* @Bean define el metodo que va a regresar dicha configuracion
* */
@Configuration
public class DBConnection {
    @Value("${db.url}")
    private String DB_URL;
    @Value("${db.password}")
    private String DB_PASSWORD;
    @Value("${db.username}")
    private String DB_USERNAME;

    @Bean
    public DataSource getConnection() {
        try {
            DriverManagerDataSource configuration = new DriverManagerDataSource();
            configuration.setUrl(DB_URL);
            configuration.setUsername(DB_USERNAME);
            configuration.setPassword(DB_PASSWORD);
            configuration.setDriverClassName("com.mysql.cj.jdbc.Driver");
            return configuration;
        }catch (Exception e) {
            System.out.println("Error de conexion a base de datos");
            e.printStackTrace();
            return null;
        }
    }
}

