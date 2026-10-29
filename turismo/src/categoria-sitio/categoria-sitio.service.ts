import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoriaSitio } from './entities/categoria-sitio.entity';
import { CreateCategoriaSitioDto } from './dto/create-categoria-sitio.dto';
import { UpdateCategoriaSitioDto } from './dto/update-categoria-sitio.dto';

@Injectable()
// Operaciones CRUD de las categorías reutilizables para sitios turísticos.
export class CategoriaSitioService {
  constructor(
    @InjectRepository(CategoriaSitio)
    private readonly categoriaRepository: Repository<CategoriaSitio>,
  ) {}

  // Registra una nueva categoría de sitio.
  async create(dto: CreateCategoriaSitioDto): Promise<CategoriaSitio> {
    return await this.categoriaRepository.save(
      this.categoriaRepository.create(dto),
    );
  }

  // Devuelve todas las categorías registradas.
  async findAll(): Promise<CategoriaSitio[]> {
    return await this.categoriaRepository.find();
  }

  // Busca una categoría por ID y responde con 404 si no existe.
  async findOne(id: number): Promise<CategoriaSitio> {
    const categoria = await this.categoriaRepository.findOneBy({
      idCategoria: id,
    });
    if (!categoria) {
      throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
    }
    return categoria;
  }

  // Actualiza únicamente los campos presentes en el DTO.
  async update(
    id: number,
    dto: UpdateCategoriaSitioDto,
  ): Promise<CategoriaSitio> {
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
