import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  public async extractEntities(searchTerm: string) {
    return this.prisma.city.findMany({
      where: {
        name: {
          contains: searchTerm,
        },
      },
    });
  }
}
