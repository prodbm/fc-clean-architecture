import { Sequelize } from "sequelize-typescript";
import FindProductUseCase from "./find.product.usecases";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import ProductFactory from "../../../domain/product/factory/product.factory";

describe("Test find product use case", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        await sequelize.addModels([ProductModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should find a product", async () => {
        const productRepository = new ProductRepository()
        const productFindUseCase = new FindProductUseCase(productRepository);

        const product =  ProductFactory.create("a", "Product", 100);

        await productRepository.create(product)

        const input = {
            id: product.id
        };

        const result = await productFindUseCase.execute(input);

        const output = { id: product.id, name: product.name, price: product.price };

        expect(result).toEqual(output);
    });

    it("should not find a product", async () => {
        const productRepository = new ProductRepository()
        const productFindUseCase = new FindProductUseCase(productRepository);

        const input = {
            id: "1"
        };

        expect(() => {
            return productFindUseCase.execute(input);
        }).rejects.toThrow("Product not found");
    });
});
