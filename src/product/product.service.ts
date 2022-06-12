import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { query } from 'express';
import { Model } from 'mongoose';
import { APIfeatures } from 'src/utils/productQuery';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { Product, ProductDocument } from './product.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async get(query: Object) {
    const features = new APIfeatures(this.productModel.find(), query)
      .filtering()
      .sorting()
      .paginating();

    const products = await features.query;

    return {
      status: 'success',
      result: products.length,
      products: products,
    };
  }

  async createProduct(dto: CreateProductDto) {
    const {
      product_id,
      image: { filename, publicUrl },
    } = dto;
    const product = await this.productModel.findOne({ product_id });

    if (product) throw new ForbiddenException('This Product is already exists');

    if (!filename || !publicUrl)
      throw new ForbiddenException('filename and publicUrl is required');

    dto.image = { filename, publicUrl };

    const newProduct = new this.productModel({ ...dto });

    const saveProduct = await newProduct.save();

    if (!saveProduct)
      throw new InternalServerErrorException('Failed to add new product');

    return { msg: 'Added new product successfully' };
  }

  async delete(id: string) {
    const result = await this.productModel.findByIdAndDelete(id);
    if (!result)
      throw new InternalServerErrorException('Failed to delete product');

    return { msg: 'Deleted product successfully' };
  }

  async update(id: string, dto: UpdateProductDto) {
    const {
      image: { filename, publicUrl },
    } = dto;

    dto.image = {};

    if (filename) {
      dto.image = { filename };
    }

    if (publicUrl) {
      dto.image.publicUrl = publicUrl;
    }
    const result = await this.productModel.findByIdAndUpdate(id, { ...dto });
    if (!result)
      throw new InternalServerErrorException('Failed to update product');

    return { msg: 'Updated product successfully' };
  }
}
