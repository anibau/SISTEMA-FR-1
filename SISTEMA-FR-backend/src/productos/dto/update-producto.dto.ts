import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateProductoDto } from './create-producto.dto';

export class UpdateProductoDto extends PartialType(
  OmitType(CreateProductoDto, ['codigo'] as const)
) {
  historialPrecios?: { precio: number; fecha: Date; usuario: string; motivo?: string }[];
}

