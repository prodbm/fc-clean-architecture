import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import ProductFactory from "../../../domain/product/factory/product.factory";
import UpdateProductUseCase from "./update.product.usecases";

const product = ProductFactory.create("a", "Product", 100);

const input = {
    id: product.id,
    name: "Product Updated",
    price: 300
};


describe("Integration test for product update use case", () => {

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

        input.name = "Product Updated",
        input.price = 300;


    });

    afterEach(async () => {
        await sequelize.close();
    });


    it("should update a product", async () => {
        const repository = new ProductRepository();

        await repository.create(product);

        const updateProductUseCase = new UpdateProductUseCase(repository);        

        const output = await updateProductUseCase.execute(input);       
      
        expect(output).toEqual(input);
    });

    it("should thrown an error when name is missing", async () => {
        const repository = new ProductRepository();

        await repository.create(product);

        const updateProductUseCase = new UpdateProductUseCase(repository);

        input.name = "";

        await expect(updateProductUseCase.execute(input)).rejects.toThrow(
            "Name is required"
        );
    });

    it("should thrown an error when price is less than zero", async () => {
        const repository = new ProductRepository();

        await repository.create(product);

        const updateProductUseCase = new UpdateProductUseCase(repository);

        input.price = -1;

        await expect(updateProductUseCase.execute(input)).rejects.toThrow(
            "Price must be greater than zero"
        );
    });
});