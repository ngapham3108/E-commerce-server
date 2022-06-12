import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  UseGuards,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { AdminRequiredGuard } from 'src/guard/admin.guard';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get('')
  @UseGuards(AdminRequiredGuard)
  get(@Query() query: Object) {
    return this.productService.get(query);
  }

  @Post('')
  @UseGuards(AdminRequiredGuard)
  create(@Body() dto: CreateProductDto) {
    return this.productService.createProduct(dto);
  }

  @Delete(':id')
  @UseGuards(AdminRequiredGuard)
  delete(@Param('id') id: string) {
    return this.productService.delete(id);
  }

  @Put(':id')
  @UseGuards(AdminRequiredGuard)
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productService.update(id, dto);
  }
}
