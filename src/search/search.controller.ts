import { Controller, Get, Query } from '@nestjs/common';

import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Get()
  async getProfile(@Query('term') searchTerm) {
    return await this.searchService.extractEntities(searchTerm);
  }
}
