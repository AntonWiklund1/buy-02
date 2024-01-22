package com.gritlabstudent.media.ms;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.kafka.annotation.EnableKafka;

@SpringBootApplication
@EnableKafka
public class MediaMsApplication {

	public static void main(String[] args) {
		SpringApplication.run(MediaMsApplication.class, args);
	}

}
