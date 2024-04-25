export type EntityName = 'city' | 'brand' | 'dishType' | 'diet';
export type Entity = { id: number; name: string };
export type ResultItem = Partial<Record<EntityName, Entity>>;

export type QueryKey = 'cities' | 'brands' | 'diets' | 'dish_types';
export type QueryResult = Record<QueryKey, null | Entity[]>;
