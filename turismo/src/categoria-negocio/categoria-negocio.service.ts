import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoriaNegocioDto } from './dto/create-categoria-negocio.dto';
import { UpdateCategoriaNegocioDto } from './dto/update-categoria-negocio.dto';
import { CategoriaNegocio } from './entities/categoria-negocio.entity';

@Injectable()
// Administra las categorías reutilizables para clasificar negocios.
export class CategoriaNegocioService {
  constructor(
    @InjectRepository(CategoriaNegocio)
    private readonly categoriaRepository: Repository<CategoriaNegocio>,
  ) {}

  // Registra una nueva categoría de negocio.
  async create(dto: CreateCategoriaNegocioDto): Promise<CategoriaNegocio> {
    return await this.categoriaRepository.save(
      this.categoriaRepository.create(dto),
    );
  }

  // Devuelve todas las categorías registradas.
  async findAll(): Promise<CategoriaNegocio[]> {
    return await this.categoriaRepository.find();
  }

  // Busca una categoría por ID o responde con 404.
  async findOne(id: number): Promise<CategoriaNegocio> {
    const categoria = await this.categoriaRepository.findOneBy({
      idCategoriaNeg: id,
    });
    if (!categoria) {
      throw new NotFoundException(`Categoría de negocio con ID ${id} no encontrada`);
    }
    return categoria;
  }

  // Actualiza únicamente los campos presentes en el DTO.
  async update(
    id: number,
    dto: UpdateCategoriaNegocioDto,
  ): Promise<CategoriaNegocio> {
    const categoria = await this.findOne(id);
    this.categoriaRepository.merge(categoria, dto);
    return await this.categoriaRepository.save(categoria);
  }

  // Elimina la categoría indicada.
  async remove(id: number): Promise<void> {
    const categoria = await this.findOne(id);
    await this.categoriaRepository.remove(categoria);
  }
}
