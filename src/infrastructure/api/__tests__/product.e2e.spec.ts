import e from "express";
import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for product", () => {
    beforeEach(async () => {
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it("should create a product", async () => {
        const response = await request(app)
            .post("/product")
            .send({
                type: "a",
                name: "Product",
                price: 100,
            });

        expect(response.status).toBe(200);
        expect(response.body.name).toBe("Product");
        expect(response.body.price).toBe(100);
    });

    it("should not create a product", async () => {
        const response = await request(app).post("/product").send({
            name: "product",
        });
        expect(response.status).toBe(500);
    });

    it("should list all product", async () => {
        const response = await request(app)
            .post("/product")
            .send({
                type: "a",
                name: "Product",
                price: 100,
            });
        expect(response.status).toBe(200);
        const productCreatedResponse = response.body;

        const response2 = await request(app)
            .post("/product")
            .send({
                type: "b",
                name: "Product 2",
                price: 200,
            });

        expect(response2.status).toBe(200);
        const productCreatedResponse2 = response2.body;

        const listResponse = await request(app).get("/product");
        expect(listResponse.status).toBe(200);
        expect(listResponse.body.products.length).toBe(2);
        const product = listResponse.body.products[0];
        expect(product.id).toBe(productCreatedResponse.id);
        expect(product.name).toBe(productCreatedResponse.name);
        expect(product.price).toBe(productCreatedResponse.price);
        const product2 = listResponse.body.products[1];
        expect(product2.id).toBe(productCreatedResponse2.id);
        expect(product2.name).toBe(productCreatedResponse2.name);
        expect(product2.price).toBe(productCreatedResponse2.price);

        const listResponseXML = await request(app)
            .get("/product")
            .set("Accept", "application/xml");
        expect(listResponseXML.status).toBe(200);
   
        let xmlOutput = `<?xml version="1.0" encoding="UTF-8"?>\n`;

        xmlOutput.concat(`<products>\n`,
            `<product><id>${product.id}</id>\n<name>${product.name}</name>\n<price>${product.price}</price>\n</product>\n`,
            `<product><id>${product2.id}</id>\n<name>${product2.name}</name>\n<price>${product2.price}</price>\n</product>\n`,
            `</products>`);
        expect(listResponseXML.text).toContain(xmlOutput);
    });
});
