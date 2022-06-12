import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './category.schema';
import { CategoryDto } from './dtos/create-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  async getCategories() {
    const categories = await this.categoryModel.find();
    return categories;
  }

  async createCategory(dto: CategoryDto) {
    const { name } = dto;

    const category = await this.categoryModel.findOne({ name });

    if (category) throw new ForbiddenException('This category already exists');

    const newCategory = new this.categoryModel({ name });

    await newCategory.save();

    return { msg: 'Created new category successfully' };
  }

  async deleteCategory(id: string) {
    const result = await this.categoryModel.findByIdAndDelete({ _id: id });

    if (!result) throw new NotFoundException('Category not found');

    return { msg: 'Category deleted successfully' };
  }

  async updateCategory(id: string, dto: CategoryDto) {
    const result = await this.categoryModel.findByIdAndUpdate(
      {
        _id: id,
      },
      { ...dto },
    );

    if (!result) throw new NotFoundException('Category not found');

    return { msg: 'Category updated successfully' };
  }
}
