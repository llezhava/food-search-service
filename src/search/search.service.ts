import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import stopWords from './stop-words';
import { QueryResult, ResultItem } from './types';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  getWordMatchConditions(columnName, terms: string[]) {
    const cond = terms.reduce((acc, curr, i) => {
      acc += `${i > 0 ? ' or ' : ''} lower(${columnName}) like '%${curr}%'`;
      return acc;
    }, '');

    return Prisma.raw(cond);
  }

  public async extractEntities(searchTerm: string) {
    const terms = searchTerm
      .toLowerCase()
      .split(' ')
      .filter((word) => !stopWords.has(word));

    const query = await this.prisma.$queryRaw<QueryResult[]>`
      select brands.data as brands, 
      cities.data as cities, 
      diets.data as diets, 
      dish_types.data as dish_types
      from "Brand"
        left join lateral (
          select jsonb_agg("Brand") as data from "Brand"
            where ${this.getWordMatchConditions('"Brand".name', terms)}
          ) brands on true
        left join lateral (
          select jsonb_agg("City") as data from "City"
            where  ${this.getWordMatchConditions('"City".name', terms)}
          ) cities on true
        left join lateral (
          select jsonb_agg("Diet") as data from "Diet"
            where ${this.getWordMatchConditions('"Diet".name', terms)}
          ) diets on true
        left join lateral (
          select jsonb_agg("DishType") as data from "DishType"
            where ${this.getWordMatchConditions('"DishType".name', terms)}
          ) dish_types on true
        limit 1;
      `;

    const pairs = this.generatePairs(query);

    return pairs;
  }

  /*
    {
      brands: null,
      cities: [
        { id: 1, name: 'London' },
        { id: 6, name: 'Manchester' },
      ],
      diets: [
        { id: 1, name: 'Vegan' },
        { id: 2, name: 'Vegetarian' },
        { id: 5, name: 'Ovo Vegetarian' },
      ],
      dish_types: [
        { id: 174, name: 'Tofu' },
        { id: 179, name: 'Potatoes' },
      ]
    }
*/
  generatePairs(data: QueryResult[]) {
    const { brands, cities, diets, dish_types } = data[0];

    const result: ResultItem[] = [];

    const cityList = cities || [{ name: null }];
    const dietList = diets || [{ name: null }];
    const dishTypeList = dish_types || [{ name: null }];
    const brandList = brands || [{ name: null }];

    cityList.forEach((city) => {
      dietList.forEach((diet) => {
        dishTypeList.forEach((dishType) => {
          brandList.forEach((brand) => {
            const item: ResultItem = {};

            if (city.name) {
              item['city'] = city;
            }
            if (diet.name) {
              item['diet'] = diet;
            }
            if (brand.name) {
              item['brand'] = brand;
            }
            if (dishType.name) {
              item['dishType'] = dishType;
            }

            result.push(item);
          });
        });
      });
    });

    return result;
  }
}
