import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  getLikeSearches(columnName, terms: string[]) {
    const cond = terms.reduce((acc, curr, i) => {
      acc += `${i > 0 ? ' or ' : ''} lower(${columnName}) like '%${curr}%'`;
      return acc;
    }, '');

    return Prisma.raw(cond);
  }

  public async extractEntities(searchTerm: string) {
    const terms = searchTerm.toLowerCase().split(' ');

    const rawQuery = await this.prisma.$queryRaw`
      select brands.data as brands, cities.data as cities, diets.data as diets, dish_types.data as dish_types
from "Brand"
   left join lateral (
    select jsonb_agg("Brand") as data from "Brand"
       where ${this.getLikeSearches('"Brand".name', terms)}
    ) brands on true
   left join lateral (
    select jsonb_agg("City") as data from "City"
       where  ${this.getLikeSearches('"City".name', terms)}
    ) cities on true
   left join lateral (
    select jsonb_agg("Diet") as data from "Diet"
       where ${this.getLikeSearches('"Diet".name', terms)}
    ) diets on true
   left join lateral (
    select jsonb_agg("DishType") as data from "DishType"
       where ${this.getLikeSearches('"DishType".name', terms)}
    ) dish_types on true
limit 1;
      `;
    //     const rawQuery = await this.prisma.$queryRaw`
    //       select "Brand".name, brands.data as brands, cities.data as cities, diets.data as diets, dish_types.data as dish_types
    // from "Brand"
    //    left join lateral (
    //     select jsonb_agg("Brand") as data from "Brand"
    //        where to_tsvector("Brand".name) @@ websearch_to_tsquery(${terms})
    //     ) brands on true
    //    left join lateral (
    //     select jsonb_agg("City") as data from "City"
    //        where to_tsvector("City".name) @@ websearch_to_tsquery(${terms})
    //     ) cities on true
    //    left join lateral (
    //     select jsonb_agg("Diet") as data from "Diet"
    //        where to_tsvector("Diet".name) @@ websearch_to_tsquery(${terms})
    //     ) diets on true
    //    left join lateral (
    //     select jsonb_agg("DishType") as data from "DishType"
    //        where to_tsvector("DishType".name) @@ websearch_to_tsquery(${terms})
    //     ) dish_types on true
    // limit 1;
    //       `;

    console.log({ terms });

    return rawQuery;
  }
}
