import ProductFactory from "../../../domain/product/factory/product.factory";
import FindProductUseCase from "./find.product.usecases";

const product = ProductFactory.create("a", "Product", 100);

const MockRepository = () => {
    return {
        find: jest.fn().mockReturnValue(Promise.resolve(product)),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
    }
}

describe("Unit test find product use case", () => {
    it("should find a product", async () => {
        const productRepository = MockRepository();
        const productFindUseCase = new FindProductUseCase(productRepository);

        const input = {
            id: product.id
        };

        const result = await productFindUseCase.execute(input);

        const output = { id: product.id, name: product.name, price: product.price };

        expect(result).toEqual(output);
    });

    it("should not find a product", async () => {
        const productRepository = MockRepository();
        productRepository.find.mockImplementation(() => {
            throw new Error("Product not found");
        });
        const productFindUseCase = new FindProductUseCase(productRepository);

        const input = {
            id: "1"
        };

        expect(() => {
            return productFindUseCase.execute(input);
        }).rejects.toThrow("Product not found");
    });
});
