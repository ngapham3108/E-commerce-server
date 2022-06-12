import {
  Controller,
  Get,
  UseGuards,
  Post,
  Body,
  Delete,
  Query,
  Param,
  Put,
} from '@nestjs/common';
import { identity } from 'rxjs';
import { AdminRequiredGuard } from 'src/guard/admin.guard';
import { CategoryService } from './category.service';
import { CategoryDto } from './dtos/create-category.dto';

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get('')
  @UseGuards(AdminRequiredGuard)
  getCategories() {
    return this.categoryService.getCategories();
  }

  @Post('')
  @UseGuards(AdminRequiredGuard)
  createCategories(@Body() dto: CategoryDto) {
    return this.categoryService.createCategory(dto);
  }

  @Delete('/:id')
  @UseGuards(AdminRequiredGuard)
  deleteCategory(@Param('id') id: string) {
    return this.categoryService.deleteCategory(id);
  }

  @Put('/:id')
  @UseGuards(AdminRequiredGuard)
  updateCategory(@Param('id') id: string, @Body() dto: CategoryDto) {
    return this.categoryService.updateCategory(id, dto);
  }
}
