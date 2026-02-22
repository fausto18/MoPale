import { Injectable } from '@nestjs/common';

@Injectable()
export class ReviewsService {
  create(createReviewDto: any) {
    return {
      message: 'Review criada com sucesso',
      data: createReviewDto,
    };
  }
}
