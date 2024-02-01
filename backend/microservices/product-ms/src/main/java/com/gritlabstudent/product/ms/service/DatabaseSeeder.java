package com.gritlabstudent.product.ms.service;

import com.gritlabstudent.product.ms.models.Product;
import com.gritlabstudent.product.ms.repositories.ProductRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private final ProductRepository productRepository;

    public DatabaseSeeder(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (productRepository.count() == 0) {
            seedProducts();
        }
    }

    private void seedProducts() {

        var p1 = new Product();
        p1.setId("p1");
        p1.setName("product1");
        p1.setDescription("description1 and the product is valid");
        p1.setPrice(1.0);
        p1.setUserId("2");
        p1.setQuantity(100);

        var p2 = new Product();
        p2.setId("p2");
        p2.setName("product2");
        p2.setDescription("description2 and the product is valid");
        p2.setPrice(2.0);
        p2.setUserId("2");
        p2.setQuantity(100);

        var p3 = new Product();
        p3.setId("p3");
        p3.setName("product3");
        p3.setDescription("description3 and the product is valid");
        p3.setPrice(3.0);
        p3.setUserId("2");
        p3.setQuantity(100);

        var p4 = new Product();
        p4.setId("p4");
        p4.setName("product4");
        p4.setDescription("description4 and the product is valid");
        p4.setPrice(4.0);
        p4.setUserId("2");
        p4.setQuantity(100);

        var p5 = new Product();
        p5.setId("p5");
        p5.setName("product5");
        p5.setDescription("description5 and the product is valid");
        p5.setPrice(5.0);
        p5.setUserId("2");
        p5.setQuantity(100);

        productRepository.save(p1);
        productRepository.save(p2);
        productRepository.save(p3);
        productRepository.save(p4);
        productRepository.save(p5);

        System.out.println("Initial users seeded.");
    }

}
